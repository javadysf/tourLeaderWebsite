import { Injectable, NotFoundException } from '@nestjs/common';
import { Gender } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        nationalId: true,
        birthDate: true,
        gender: true,
        avatar: true,
        walletBalance: true,
        loyaltyPoints: true,
        role: true,
        status: true,
        twoFaEnabled: true,
        preferredLanguage: true,
        emailVerifiedAt: true,
        mobileVerifiedAt: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('کاربر یافت نشد');
    return user;
  }

  async updateProfile(userId: string, data: Partial<{
    firstName: string;
    lastName: string;
    nationalId: string;
    birthDate: string;
    gender: Gender;
    preferredLanguage: string;
  }>) {
    const { birthDate, gender, ...rest } = data;
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...rest,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        gender: gender ?? undefined,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        nationalId: true,
        birthDate: true,
        gender: true,
        avatar: true,
        walletBalance: true,
        loyaltyPoints: true,
        role: true,
      },
    });
  }

  async getWallet(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    });
    const transactions = await this.prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return { balance: user?.walletBalance, transactions };
  }

  async getLoyalty(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { loyaltyPoints: true },
    });
    const transactions = await this.prisma.loyaltyTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return { points: user?.loyaltyPoints, transactions };
  }

  async findAll(page = 1, limit = 20, search?: string, role?: string) {
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { mobile: { contains: search } },
      ];
    }

    if (role) where.role = role;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          mobile: true,
          role: true,
          status: true,
          walletBalance: true,
          loyaltyPoints: true,
          createdAt: true,
          _count: { select: { bookings: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / Number(limit));
    return { items: users, total, page: Number(page), totalPages };
  }

  async updateStatus(userId: string, status: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: status as any },
      select: { id: true, status: true },
    });
  }
}
