'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreditCard, Wallet, ShieldCheck, Lock } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate } from '@/lib/utils';

const STEPS = ['انتخاب تور', 'اطلاعات مسافران', 'پرداخت', 'تایید'];

interface BookingDetail {
  id: string;
  bookingCode: string;
  totalPrice: number;
  discountAmount: number;
  passengersCount: number;
  tour: {
    title: string;
    coverImage?: string;
    departureDate: string;
  };
  user: {
    walletBalance: number;
  };
}

export default function PaymentPage() {
  const { tourId } = useParams<{ tourId: string }>();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, router]);

  // tourId here is actually the booking ID after passenger step
  const { data: booking, isLoading } = useQuery<BookingDetail>({
    queryKey: ['booking', tourId],
    queryFn: () => api.get(`/bookings/${tourId}`),
    enabled: !!tourId && isAuthenticated,
  });

  const { mutate: payWithGateway, isPending: isPayingGateway } = useMutation({
    mutationFn: () =>
      api.post('/payments/initiate', {
        bookingId: tourId,
        gateway: 'zarinpal',
      }) as Promise<{ paymentUrl: string }>,
    onSuccess: (data: any) => {
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast.error('خطا در دریافت لینک پرداخت');
      }
    },
    onError: (err: any) => toast.error(err?.message || 'خطا در پرداخت'),
  });

  const { mutate: payWithWallet, isPending: isPayingWallet } = useMutation({
    mutationFn: () =>
      api.post(`/bookings/${tourId}/pay`, { method: 'WALLET' }),
    onSuccess: () => {
      router.push(`/booking/${tourId}/confirm`);
    },
    onError: (err: any) => toast.error(err?.message || 'خطا در پرداخت با کیف پول'),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-app py-16 text-center">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 mx-auto" />
        </div>
      </div>
    );
  }

  const walletBalance = Number(user?.walletBalance || 0);
  const totalPrice = Number(booking?.totalPrice || 0);
  const canPayWithWallet = walletBalance >= totalPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-app py-8">
        {/* Steps */}
        <div className="mb-8 flex items-center justify-center gap-0">
          {STEPS.map((step, idx) => (
            <div key={step} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                idx === 2 ? 'bg-blue-600 text-white' : idx < 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {idx < 2 ? '✓' : idx + 1}
              </div>
              <span className={`mx-2 text-xs font-medium ${idx === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                {step}
              </span>
              {idx < STEPS.length - 1 && (
                <div className={`h-0.5 w-8 ${idx < 2 ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-2xl space-y-6">
          {/* Order Summary */}
          {booking && (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-900">خلاصه سفارش</h2>
              <div className="flex items-center gap-4">
                {booking.tour.coverImage && (
                  <img
                    src={booking.tour.coverImage}
                    alt={booking.tour.title}
                    className="h-16 w-24 shrink-0 rounded-xl object-cover"
                  />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">{booking.tour.title}</h3>
                  <p className="text-sm text-gray-500">
                    تاریخ حرکت: {formatDate(booking.tour.departureDate)}
                  </p>
                  <p className="text-sm text-gray-500">{booking.passengersCount} نفر</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t pt-4">
                {booking.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">تخفیف</span>
                    <span className="font-medium text-green-600">
                      -{formatPrice(booking.discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold">
                  <span className="text-gray-900">مبلغ قابل پرداخت</span>
                  <span className="text-blue-700">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Wallet Payment */}
          <div className={`rounded-2xl border-2 p-6 shadow-sm ${canPayWithWallet ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">پرداخت با کیف پول</h3>
                  <p className="text-sm text-gray-500">
                    موجودی: <span className="font-medium text-green-700">{formatPrice(walletBalance)}</span>
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => payWithWallet()}
              loading={isPayingWallet}
              disabled={!canPayWithWallet}
              className="mt-4 w-full"
              variant={canPayWithWallet ? 'default' : 'outline'}
              size="lg"
            >
              {canPayWithWallet ? 'پرداخت با کیف پول' : 'موجودی ناکافی'}
            </Button>

            {!canPayWithWallet && (
              <p className="mt-2 text-center text-xs text-gray-400">
                موجودی کیف پول شما کافی نیست
              </p>
            )}
          </div>

          {/* Online Payment */}
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">پرداخت آنلاین</h3>
                <p className="text-sm text-gray-500">زرین‌پال، شتاب، ملت</p>
              </div>
            </div>

            <Button
              onClick={() => payWithGateway()}
              loading={isPayingGateway}
              className="mt-4 w-full"
              size="lg"
            >
              <Lock className="h-4 w-4" />
              پرداخت امن آنلاین
            </Button>
          </div>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="h-4 w-4" />
            پرداخت شما توسط SSL ایمن است
          </div>
        </div>
      </main>
    </div>
  );
}
