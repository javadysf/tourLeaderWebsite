'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { User, Plus, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import type { Tour } from '@/types';

const passengerSchema = z.object({
  firstName: z.string().min(2, 'نام الزامی است'),
  lastName: z.string().min(2, 'نام خانوادگی الزامی است'),
  nationalId: z.string().length(10, 'کد ملی ۱۰ رقم').optional().or(z.literal('')),
  passportNumber: z.string().optional().or(z.literal('')),
  birthDate: z.string().optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
});

const formSchema = z.object({
  passengers: z.array(passengerSchema).min(1),
  couponCode: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const STEPS = ['انتخاب تور', 'اطلاعات مسافران', 'پرداخت', 'تایید'];

export default function PassengersPage() {
  const { tourId } = useParams<{ tourId: string }>();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [passengersCount, setPassengersCount] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login?redirect=/booking/' + tourId + '/passengers');
  }, [isAuthenticated, router, tourId]);

  const { data: tour, isLoading } = useQuery<Tour>({
    queryKey: ['tour', tourId],
    queryFn: () => api.get(`/tours/${tourId}`),
    enabled: !!tourId,
  });

  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passengers: [{ firstName: '', lastName: '', nationalId: '' }],
      couponCode: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'passengers' });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const result = await api.post('/bookings', {
        tourId,
        passengers: data.passengers,
        couponCode: data.couponCode || undefined,
      });
      return result as any;
    },
    onSuccess: (booking: any) => {
      router.push(`/booking/${booking.id}/payment`);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'خطا در ثبت اطلاعات');
    },
  });

  if (isLoading || !tour) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-app py-16 text-center">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 mx-auto mb-4" />
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-app py-8">
        {/* Steps */}
        <div className="mb-8 flex items-center justify-center gap-0">
          {STEPS.map((step, idx) => (
            <div key={step} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                idx === 1 ? 'bg-blue-600 text-white' : idx < 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {idx + 1}
              </div>
              <span className={`mx-2 text-xs font-medium ${idx === 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                {step}
              </span>
              {idx < STEPS.length - 1 && (
                <div className={`h-0.5 w-8 ${idx < 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-6">
              {fields.map((field, idx) => (
                <div key={field.id} className="rounded-2xl border bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                      <User className="h-5 w-5 text-blue-600" />
                      مسافر {idx + 1}
                      {idx === 0 && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">سرپرست</span>}
                    </h3>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        حذف
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">نام *</label>
                      <input
                        {...register(`passengers.${idx}.firstName`)}
                        placeholder="علی"
                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                      />
                      {errors.passengers?.[idx]?.firstName && (
                        <p className="mt-1 text-xs text-red-500">{errors.passengers[idx]?.firstName?.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">نام خانوادگی *</label>
                      <input
                        {...register(`passengers.${idx}.lastName`)}
                        placeholder="محمدی"
                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">کد ملی</label>
                      <input
                        {...register(`passengers.${idx}.nationalId`)}
                        dir="ltr"
                        maxLength={10}
                        placeholder="0000000000"
                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">جنسیت</label>
                      <select
                        {...register(`passengers.${idx}.gender`)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">انتخاب کنید</option>
                        <option value="MALE">آقا</option>
                        <option value="FEMALE">خانم</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">تاریخ تولد</label>
                      <input
                        {...register(`passengers.${idx}.birthDate`)}
                        type="date"
                        dir="ltr"
                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">شماره پاسپورت</label>
                      <input
                        {...register(`passengers.${idx}.passportNumber`)}
                        dir="ltr"
                        placeholder="اختیاری"
                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {fields.length < 10 && (
                <button
                  type="button"
                  onClick={() => append({ firstName: '', lastName: '', nationalId: '' })}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  افزودن مسافر
                </button>
              )}

              {/* Coupon */}
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-900">کد تخفیف</h3>
                <div className="flex gap-3">
                  <input
                    {...register('couponCode')}
                    dir="ltr"
                    placeholder="کد تخفیف را وارد کنید"
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    اعمال
                  </button>
                </div>
              </div>

              <Button type="submit" loading={isPending} className="w-full" size="xl">
                ادامه — پرداخت
              </Button>
            </form>
          </div>

          {/* Tour Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">خلاصه رزرو</h3>

              {tour.coverImage && (
                <img
                  src={tour.coverImage}
                  alt={tour.title}
                  className="mb-4 h-40 w-full rounded-xl object-cover"
                />
              )}

              <h4 className="font-medium text-gray-900">{tour.title}</h4>
              <p className="mt-1 text-sm text-gray-500">
                {tour.destinationCity}، {tour.destinationCountry}
              </p>

              <div className="mt-4 space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">تعداد مسافران</span>
                  <span className="font-medium">{fields.length} نفر</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">قیمت هر نفر</span>
                  <span className="font-medium">{formatPrice(Number(tour.basePrice))}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-bold">
                  <span className="text-gray-900">جمع کل</span>
                  <span className="text-blue-700">{formatPrice(Number(tour.basePrice) * fields.length)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
