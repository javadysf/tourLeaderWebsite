import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    });
    if (!user) throw new NotFoundException('کاربر یافت نشد');
    return { balance: user.walletBalance };
  }

  async getTransactions(userId: string, page = 1, limit = 20) {
    const skip = (Number(page) - 1) * Number(limit);
    const [transactions, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({
        where: { userId },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.walletTransaction.count({ where: { userId } }),
    ]);
    const totalPages = Math.ceil(total / Number(limit));
    return { items: transactions, total, page: Number(page), totalPages };
  }

  async credit(userId: string, amount: number, description?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('کاربر یافت نشد');

    const balanceBefore = Number(user.walletBalance);
    const balanceAfter = balanceBefore + amount;

    const [, tx] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { walletBalance: { increment: amount } },
      }),
      this.prisma.walletTransaction.create({
        data: {
          userId,
          type: 'CREDIT',
          amount,
          balanceBefore,
          balanceAfter,
          description: description || 'واریز به کیف پول',
        },
      }),
    ]);

    return tx;
  }
}
