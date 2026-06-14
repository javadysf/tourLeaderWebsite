import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalUsers,
      newUsersToday,
      totalTours,
      activeTours,
      todayBookings,
      monthBookings,
      totalRevenue,
      monthRevenue,
      pendingBookings,
      topTours,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: today } } }),
      this.prisma.tour.count({ where: { deletedAt: null } }),
      this.prisma.tour.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
      this.prisma.booking.count({ where: { createdAt: { gte: today } } }),
      this.prisma.booking.count({ where: { createdAt: { gte: monthStart } } }),
      this.prisma.booking.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { paidAmount: true },
      }),
      this.prisma.booking.aggregate({
        where: { paymentStatus: 'PAID', createdAt: { gte: monthStart } },
        _sum: { paidAmount: true },
      }),
      this.prisma.booking.count({ where: { status: 'PENDING' } }),
      this.prisma.tour.findMany({
        where: { deletedAt: null },
        take: 5,
        orderBy: { currentCapacity: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
          currentCapacity: true,
          maxCapacity: true,
          basePrice: true,
          _count: { select: { bookings: true } },
        },
      }),
    ]);

    return {
      users: { total: totalUsers, newToday: newUsersToday },
      tours: { total: totalTours, active: activeTours },
      bookings: {
        today: todayBookings,
        thisMonth: monthBookings,
        pending: pendingBookings,
      },
      revenue: {
        total: totalRevenue._sum.paidAmount || 0,
        thisMonth: monthRevenue._sum.paidAmount || 0,
      },
      topTours,
    };
  }

  async getSalesReport(from: Date, to: Date) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        createdAt: { gte: from, lte: to },
        paymentStatus: 'PAID',
      },
      include: {
        tour: { select: { title: true, category: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.paidAmount), 0);
    const totalDiscount = bookings.reduce((sum, b) => sum + Number(b.discountAmount), 0);

    return {
      bookings,
      summary: {
        totalBookings: bookings.length,
        totalRevenue,
        totalDiscount,
        netRevenue: totalRevenue - totalDiscount,
      },
    };
  }
}
