import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  BookingStatus,
  PaymentMethod,
  PaymentType,
  PaymentGateway,
  TransactionStatus,
} from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async initiatePayment(userId: string, bookingId: string, gateway: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { OR: [{ id: bookingId }, { bookingCode: bookingId }], userId },
    });

    if (!booking) throw new NotFoundException('رزرو یافت نشد');
    if (booking.status === BookingStatus.CONFIRMED) {
      throw new BadRequestException('این رزرو قبلاً پرداخت شده است');
    }

    const gatewayEnum = gateway.toUpperCase() as PaymentGateway;

    const payment = await this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        userId,
        amount: booking.totalPrice,
        currency: 'IRR',
        type: PaymentType.PAYMENT,
        method: PaymentMethod.GATEWAY,
        gateway: PaymentGateway[gatewayEnum] || PaymentGateway.ZARINPAL,
        status: TransactionStatus.PENDING,
      },
    });

    // Mock payment URL (در محیط واقعی به درگاه ارسال می‌شود)
    const paymentUrl = `http://localhost:3000/payment/callback?payment_id=${payment.id}&status=success`;

    return { payment, paymentUrl };
  }

  async processCallback(paymentId: string, status: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true },
    });

    if (!payment) throw new NotFoundException('پرداخت یافت نشد');

    if (status === 'success') {
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: TransactionStatus.SUCCESS,
            paidAt: new Date(),
          },
        }),
        this.prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            status: BookingStatus.CONFIRMED,
            paidAmount: payment.booking.totalPrice,
            paymentStatus: 'PAID',
          },
        }),
      ]);
      return { success: true, bookingId: payment.bookingId };
    }

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: TransactionStatus.FAILED },
    });

    return { success: false };
  }

  async payWithWallet(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { OR: [{ id: bookingId }, { bookingCode: bookingId }], userId },
    });

    if (!booking) throw new NotFoundException('رزرو یافت نشد');
    if (booking.status === BookingStatus.CONFIRMED) {
      throw new BadRequestException('این رزرو قبلاً پرداخت شده است');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('کاربر یافت نشد');

    const balance = Number(user.walletBalance);
    const amount = Number(booking.totalPrice);

    if (balance < amount) {
      throw new BadRequestException('موجودی کیف پول کافی نیست');
    }

    const balanceBefore = balance;
    const balanceAfter = balance - amount;

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { walletBalance: { decrement: amount } },
      }),
      this.prisma.walletTransaction.create({
        data: {
          userId,
          type: 'DEBIT',
          amount,
          balanceBefore,
          balanceAfter,
          description: `پرداخت رزرو ${booking.bookingCode}`,
          referenceType: 'BOOKING',
          referenceId: booking.id,
        },
      }),
      this.prisma.payment.create({
        data: {
          bookingId: booking.id,
          userId,
          amount: booking.totalPrice,
          currency: 'IRR',
          type: PaymentType.PAYMENT,
          method: PaymentMethod.WALLET,
          status: TransactionStatus.SUCCESS,
          paidAt: new Date(),
        },
      }),
      this.prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.CONFIRMED,
          paidAmount: booking.totalPrice,
          paymentStatus: 'PAID',
          walletUsed: amount,
        },
      }),
    ]);

    return { success: true, bookingId: booking.id, bookingCode: booking.bookingCode };
  }

  async findAll(page = 1, limit = 20, status?: string) {
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = status ? { status } : {};

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          booking: {
            select: {
              bookingCode: true,
              user: { select: { firstName: true, lastName: true } },
            },
          },
        },
      }),
      this.prisma.payment.count({ where }),
    ]);

    const totalRevenue = await this.prisma.payment.aggregate({
      where: { status: TransactionStatus.SUCCESS },
      _sum: { amount: true },
    });

    const totalPages = Math.ceil(total / Number(limit));

    // flatten user info
    const items = payments.map((p) => ({
      ...p,
      user: p.booking.user,
      booking: { bookingCode: p.booking.bookingCode },
    }));

    return {
      items,
      total,
      totalPages,
      page: Number(page),
      totalAmount: Number(totalRevenue._sum.amount || 0),
    };
  }
}
