'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import axios from 'axios';
import { Settings, Save } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function getToken() {
  if (typeof window !== 'undefined') return localStorage.getItem('adminToken') || '';
  return '';
}

const schema = z.object({
  siteName: z.string().min(2),
  supportPhone: z.string().optional(),
  supportEmail: z.string().email().optional().or(z.literal('')),
  cancellationPolicy: z.string().optional(),
  taxRate: z.number().min(0).max(100).optional(),
});

type FormData = z.infer<typeof schema>;

export default function SettingsPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/settings`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data.data as Record<string, string>;
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: settings
      ? {
          siteName: settings['site.name'] || 'تورلیدر',
          supportPhone: settings['support.phone'] || '',
          supportEmail: settings['support.email'] || '',
          cancellationPolicy: settings['cancellation.policy'] || '',
          taxRate: Number(settings['tax.rate']) || 9,
        }
      : undefined,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) =>
      axios.patch(`${API_URL}/settings`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      }),
    onSuccess: () => toast.success('تنظیمات ذخیره شد'),
    onError: () => toast.error('خطا در ذخیره تنظیمات'),
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Settings className="h-5 w-5 text-gray-400" />
          <h1 className="text-xl font-bold text-gray-900">تنظیمات سیستم</h1>
        </div>

        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-6">
            {/* General Settings */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 font-semibold text-gray-900">تنظیمات عمومی</h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">نام سایت *</label>
                  <input
                    {...register('siteName')}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  {errors.siteName && <p className="mt-1 text-xs text-red-500">{errors.siteName.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">تلفن پشتیبانی</label>
                    <input
                      {...register('supportPhone')}
                      type="tel"
                      dir="ltr"
                      placeholder="021-00000000"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">ایمیل پشتیبانی</label>
                    <input
                      {...register('supportEmail')}
                      type="email"
                      dir="ltr"
                      placeholder="support@example.com"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Settings */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 font-semibold text-gray-900">تنظیمات مالی</h2>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">نرخ مالیات بر ارزش افزوده (%)</label>
                <input
                  {...register('taxRate', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  dir="ltr"
                  className="w-40 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 font-semibold text-gray-900">سیاست لغو</h2>
              <textarea
                {...register('cancellationPolicy')}
                rows={5}
                placeholder="قوانین لغو و استرداد را وارد کنید..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {isPending ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
