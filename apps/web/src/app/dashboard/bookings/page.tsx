'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CalendarDays, Users, Clock } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'در انتظار پرداخت', color: 'bg-yellow-100 text-yellow-700' },
  PAID: { label: 'تایید شده', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'لغو شده', color: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'استرداد شده', color: 'bg-gray-100 text-gray-700' },
};

interface Booking {
  id: string;
  bookingCode: string;
  status: string;
  totalPrice: number;
  passengersCount: number;
  createdAt: string;
  tour: {
    id: string;
    title: string;
    slug: string;
    coverImage?: string;
    departureDate: string;
    returnDate: string;
  };
}

export default function BookingsPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, router]);

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['my-bookings'],
    queryFn: () => api.get('/bookings/my'),
    enabled: isAuthenticated,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-app py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
            <ArrowRight className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">رزروهای من</h1>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CalendarDays className="mb-4 h-12 w-12 text-gray-300" />
            <h3 className="font-semibold text-gray-700">هنوز رزروی ثبت نکرده‌اید</h3>
            <p className="mt-1 text-sm text-gray-400">اولین تور خود را پیدا کنید</p>
            <Link
              href="/tours"
              className="mt-4 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              مشاهده تورها
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const statusMeta = STATUS_LABELS[booking.status] || { label: booking.status, color: 'bg-gray-100 text-gray-700' };
              return (
                <div
                  key={booking.id}
                  className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  {booking.tour.coverImage ? (
                    <img
                      src={booking.tour.coverImage}
                      alt={booking.tour.title}
                      className="h-20 w-28 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                      <CalendarDays className="h-8 w-8 text-gray-300" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMeta.color}`}>
                        {statusMeta.label}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">#{booking.bookingCode}</span>
                    </div>
                    <h3 className="truncate font-semibold text-gray-900">{booking.tour.title}</h3>
                    <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(booking.tour.departureDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {booking.passengersCount} نفر
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        ثبت {formatDate(booking.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-left">
                    <div className="font-bold text-blue-700">{formatPrice(booking.totalPrice)}</div>
                    <div className="text-xs text-gray-400">مبلغ رزرو</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
