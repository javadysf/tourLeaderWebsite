import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateBookingDto, UpdatePassengersDto, CancelBookingDto } from './dto/booking.dto';
import { BookingStatus, PaymentStatus, Role } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    const tour = await this.prisma.tour.findFirst({
      where: { id: dto.tourId, deletedAt: null, status: 'PUBLISHED' },
    });

    if (!tour) throw new NotFoundException('تور یافت نشد');

    const passengersCount = dto.adultsCount + (dto.childrenCount || 0);
    const remainingCapacity = tour.maxCapacity - tour.currentCapacity;

    if (passengersCount > remainingCapacity) {
      throw new BadRequestException(
        `ظرفیت کافی نیست. ظرفیت باقی‌مانده: ${remainingCapacity} نفر`,
      );
    }

    let totalPrice = Number(tour.basePrice) * dto.adultsCount;
    if (dto.childrenCount && tour.pricePerChild) {
      totalPrice += Number(tour.pricePerChild) * dto.childrenCount;
    }

    let discountAmount = 0;
    let couponId: string | undefined;

    if (dto.couponCode) {
      const coupon = await this.validateCoupon(dto.couponCode, dto.tourId, totalPrice);
      discountAmount = coupon.discount;
      couponId = coupon.id;
    }

    let walletUsed = 0;
    if (dto.walletAmount && dto.walletAmount > 0) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const maxWallet = Math.min(dto.walletAmount, Number(user!.walletBalance));
      walletUsed = Math.min(maxWallet, totalPrice - discountAmount);
    }

    const finalPrice = totalPrice - discountAmount - walletUsed;

    const booking = await this.prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          userId,
          tourId: dto.tourId,
          bookingCode: `TL-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
          adultsCount: dto.adultsCount,
          childrenCount: dto.childrenCount || 0,
          passengersCount,
          totalPrice,
          discountAmount,
          walletUsed,
          couponId,
          notes: dto.notes,
          passengers: dto.passengers
            ? {
                create: dto.passengers.map((p) => ({
                  ...p,
                  birthDate: p.birthDate ? new Date(p.birthDate) : undefined,
                  passportExpireDate: p.passportExpireDate
                    ? new Date(p.passportExpireDate)
                    : undefined,
                })),
              }
            : undefined,
        },
        include: { passengers: true },
      });

      await tx.tour.update({
        where: { id: dto.tourId },
        data: { currentCapacity: { increment: passengersCount } },
      });

      if (walletUsed > 0) {
        const user = await tx.user.findUnique({ where: { id: userId } });
        await tx.user.update({
          where: { id: userId },
          data: { walletBalance: { decrement: walletUsed } },
        });
        await tx.walletTransaction.create({
          data: {
            userId,
            type: 'DEBIT',
            amount: walletUsed,
            balanceBefore: Number(user!.walletBalance),
            balanceAfter: Number(user!.walletBalance) - walletUsed,
            description: `پرداخت رزرو ${newBooking.bookingCode}`,
            referenceType: 'booking',
            referenceId: newBooking.id,
          },
        });
      }

      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
        await tx.userDiscountUsage.create({
          data: { userId, couponId, bookingId: newBooking.id },
        });
      }

      return newBooking;
    });

    return { booking, totalPrice, discountAmount, walletUsed, finalPrice };
  }

  async findByCode(code: string, userId: string, userRole: Role) {
    // search by ID or bookingCode
    const booking = await this.prisma.booking.findFirst({
      where: { OR: [{ bookingCode: code }, { id: code }] },
      include: {
        tour: {
          select: {
            title: true,
            slug: true,
            coverImage: true,
            departureDate: true,
            returnDate: true,
            destinationCity: true,
            destinationCountry: true,
            originCity: true,
          },
        },
        user: { select: { firstName: true, lastName: true, mobile: true } },
        passengers: true,
        payments: { orderBy: { createdAt: 'desc' } },
        installmentPlan: { include: { installments: true } },
      },
    });

    if (!booking) throw new NotFoundException('رزرو یافت نشد');

    const isOwner = booking.userId === userId;
    const adminRoles: string[] = [Role.SUPER_ADMIN, Role.AGENCY_ADMIN, Role.AGENCY_STAFF];
    const isAdmin = adminRoles.includes(userRole as string);

    if (!isOwner && !isAdmin) throw new ForbiddenException('دسترسی غیرمجاز');

    return booking;
  }

  async findUserBookings(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          tour: {
            select: {
              title: true,
              slug: true,
              coverImage: true,
              departureDate: true,
              destinationCity: true,
              destinationCountry: true,
            },
          },
        },
      }),
      this.prisma.booking.count({ where: { userId } }),
    ]);

    return { data: bookings, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async updatePassengers(code: string, userId: string, dto: UpdatePassengersDto) {
    const booking = await this.prisma.booking.findUnique({ where: { bookingCode: code } });
    if (!booking) throw new NotFoundException('رزرو یافت نشد');
    if (booking.userId !== userId) throw new ForbiddenException('دسترسی غیرمجاز');
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('امکان ویرایش مسافران در این مرحله وجود ندارد');
    }

    await this.prisma.bookingPassenger.deleteMany({ where: { bookingId: booking.id } });

    return this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        passengers: {
          create: dto.passengers.map((p) => ({
            ...p,
            birthDate: p.birthDate ? new Date(p.birthDate) : undefined,
            passportExpireDate: p.passportExpireDate ? new Date(p.passportExpireDate) : undefined,
          })),
        },
      },
      include: { passengers: true },
    });
  }

  async cancel(code: string, userId: string, userRole: Role, dto: CancelBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { bookingCode: code },
      include: { tour: true },
    });

    if (!booking) throw new NotFoundException('رزرو یافت نشد');

    const isOwner = booking.userId === userId;
    const cancelAdminRoles: string[] = [Role.SUPER_ADMIN, Role.AGENCY_ADMIN];
    const isAdmin = cancelAdminRoles.includes(userRole as string);

    if (!isOwner && !isAdmin) throw new ForbiddenException('دسترسی غیرمجاز');
    if (['CANCELLED', 'COMPLETED', 'REFUNDED'].includes(booking.status)) {
      throw new BadRequestException('این رزرو قابل لغو نیست');
    }

    const daysUntilDeparture = Math.floor(
      (new Date(booking.tour.departureDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    let refundPercent = 0;
    if (daysUntilDeparture >= 14) refundPercent = 100;
    else if (daysUntilDeparture >= 7) refundPercent = 70;
    else if (daysUntilDeparture >= 3) refundPercent = 50;
    else refundPercent = 0;

    const refundAmount = (Number(booking.paidAmount) * refundPercent) / 100;
    const cancellationFee = Number(booking.paidAmount) - refundAmount;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.CANCELLED,
          paymentStatus: refundAmount > 0 ? PaymentStatus.REFUNDED : undefined,
          cancellationReason: dto.reason,
          cancelledAt: new Date(),
          cancellationFee,
          refundAmount,
        },
      });

      await tx.tour.update({
        where: { id: booking.tourId },
        data: { currentCapacity: { decrement: booking.passengersCount } },
      });

      if (refundAmount > 0) {
        await tx.user.update({
          where: { id: booking.userId },
          data: { walletBalance: { increment: refundAmount } },
        });
        const user = await tx.user.findUnique({ where: { id: booking.userId } });
        await tx.walletTransaction.create({
          data: {
            userId: booking.userId,
            type: 'REFUND',
            amount: refundAmount,
            balanceBefore: Number(user!.walletBalance) - refundAmount,
            balanceAfter: Number(user!.walletBalance),
            description: `استرداد رزرو ${booking.bookingCode}`,
            referenceType: 'booking',
            referenceId: booking.id,
          },
        });
      }

      return updated;
    });
  }

  async findAll(page = 1, limit = 20, status?: BookingStatus, search?: string) {
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (status) where.status = status;
    if (search) {
      where.OR = [
        { bookingCode: { contains: search, mode: 'insensitive' } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, mobile: true, email: true } },
          tour: { select: { title: true, departureDate: true } },
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    const totalPages = Math.ceil(total / Number(limit));
    return { items: bookings, total, page: Number(page), totalPages };
  }

  private async validateCoupon(code: string, tourId: string, amount: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code, isActive: true } });
    if (!coupon) throw new BadRequestException('کد تخفیف معتبر نیست');
    if (coupon.validTo < new Date()) throw new BadRequestException('کد تخفیف منقضی شده است');
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('ظرفیت استفاده از این کد به پایان رسیده است');
    }
    if (coupon.minOrderAmount && amount < Number(coupon.minOrderAmount)) {
      throw new BadRequestException(
        `حداقل مبلغ سفارش برای استفاده از این کد ${coupon.minOrderAmount} تومان است`,
      );
    }
    if (
      coupon.applicableTourIds.length > 0 &&
      !coupon.applicableTourIds.includes(tourId)
    ) {
      throw new BadRequestException('این کد تخفیف برای این تور قابل استفاده نیست');
    }

    let discount = 0;
    if (coupon.type === 'PERCENT') {
      discount = (amount * Number(coupon.value)) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, Number(coupon.maxDiscount));
    } else {
      discount = Number(coupon.value);
    }

    return { id: coupon.id, discount };
  }
}
