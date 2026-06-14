'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { CheckCircle, Download, CalendarDays, Users, MapPin, Phone, Share2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';

const STEPS = ['انتخاب تور', 'اطلاعات مسافران', 'پرداخت', 'تایید'];

interface BookingConfirm {
  id: string;
  bookingCode: string;
  status: string;
  totalPrice: number;
  passengersCount: number;
  createdAt: string;
  tour: {
    title: string;
    coverImage?: string;
    departureDate: string;
    returnDate: string;
    destinationCity: string;
    destinationCountry: string;
  };
  passengers: Array<{
    firstName: string;
    lastName: string;
    isLeadPassenger: boolean;
  }>;
}

export default function ConfirmPage() {
  const { tourId } = useParams<{ tourId: string }>();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, router]);

  const { data: booking, isLoading } = useQuery<BookingConfirm>({
    queryKey: ['booking-confirm', tourId],
    queryFn: () => api.get(`/bookings/${tourId}`),
    enabled: !!tourId && isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      </div>
    );
  }

  const isPaid = booking?.status === 'PAID';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-app py-8">
        {/* Steps */}
        <div className="mb-8 flex items-center justify-center gap-0">
          {STEPS.map((step, idx) => (
            <div key={step} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                idx === 3 ? (isPaid ? 'bg-green-500 text-white' : 'bg-blue-600 text-white') : 'bg-green-500 text-white'
              }`}>
                {idx < 3 ? '✓' : isPaid ? '✓' : '4'}
              </div>
              <span className={`mx-2 text-xs font-medium ${idx === 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                {step}
              </span>
              {idx < STEPS.length - 1 && <div className="h-0.5 w-8 bg-green-500" />}
            </div>
          ))}
        </div>

        {booking && (
          <div className="mx-auto max-w-2xl">
            {/* Success Banner */}
            <div className={`mb-6 rounded-2xl p-8 text-center ${
              isPaid ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'
            }`}>
              <div className="mb-4 flex justify-center">
                <CheckCircle className={`h-16 w-16 ${isPaid ? 'text-green-500' : 'text-yellow-500'}`} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isPaid ? 'رزرو شما با موفقیت ثبت شد!' : 'رزرو در انتظار پرداخت'}
              </h1>
              <p className="mt-2 text-gray-600">
                {isPaid
                  ? 'واچر سفر شما آماده است و به ایمیل شما ارسال خواهد شد'
                  : 'لطفاً پرداخت را تکمیل کنید'
                }
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
                <span className="text-sm text-gray-500">کد رزرو:</span>
                <span className="font-bold font-mono text-blue-700">{booking.bookingCode}</span>
              </div>
            </div>

            {/* Booking Details */}
            <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 font-semibold text-gray-900">جزئیات سفر</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {booking.tour.coverImage && (
                    <img
                      src={booking.tour.coverImage}
                      alt={booking.tour.title}
                      className="h-16 w-24 shrink-0 rounded-xl object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.tour.title}</h3>
                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      {booking.tour.destinationCity}، {booking.tour.destinationCountry}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">تاریخ حرکت</p>
                      <p className="font-medium text-gray-900">{formatDate(booking.tour.departureDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">تاریخ بازگشت</p>
                      <p className="font-medium text-gray-900">{formatDate(booking.tour.returnDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">تعداد مسافران</p>
                      <p className="font-medium text-gray-900">{booking.passengersCount} نفر</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">مبلغ پرداختی</p>
                      <p className="font-bold text-blue-700">{formatPrice(booking.totalPrice)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passengers */}
            {booking.passengers?.length > 0 && (
              <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-semibold text-gray-900">مسافران</h2>
                <div className="space-y-2">
                  {booking.passengers.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                        {idx + 1}
                      </div>
                      <span className="font-medium text-gray-800">
                        {p.firstName} {p.lastName}
                      </span>
                      {p.isLeadPassenger && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">سرپرست</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {isPaid && (
                <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">
                  <Download className="h-5 w-5" />
                  دانلود واچر سفر
                </button>
              )}
              <Link
                href="/dashboard/bookings"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                مشاهده رزروها
              </Link>
              <Link
                href="/tours"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                تورهای بیشتر
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
