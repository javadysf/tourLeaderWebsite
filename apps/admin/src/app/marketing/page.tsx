'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Tag, Trash2, X } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { formatDate } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function getToken() {
  if (typeof window !== 'undefined') return localStorage.getItem('adminToken') || '';
  return '';
}

const couponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  value: z.number().min(1),
  minOrderAmount: z.number().optional(),
  maxDiscount: z.number().optional(),
  usageLimit: z.number().min(1).optional(),
  validFrom: z.string(),
  validTo: z.string(),
});

type CouponForm = z.infer<typeof couponSchema>;

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

export default function MarketingPage() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: coupons, isLoading } = useQuery<Coupon[]>({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/coupons`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data.data;
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CouponForm>({
    resolver: zodResolver(couponSchema),
    defaultValues: { type: 'PERCENTAGE', value: 10 },
  });

  const { mutate: createCoupon, isPending } = useMutation({
    mutationFn: (data: CouponForm) =>
      axios.post(`${API_URL}/coupons`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      }),
    onSuccess: () => {
      toast.success('کد تخفیف ایجاد شد');
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      setShowForm(false);
      reset();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'خطا در ایجاد کد تخفیف'),
  });

  const { mutate: deleteCoupon } = useMutation({
    mutationFn: (id: string) =>
      axios.delete(`${API_URL}/coupons/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      }),
    onSuccess: () => {
      toast.success('کد تخفیف حذف شد');
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
    },
    onError: () => toast.error('خطا در حذف'),
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">بازاریابی — کدهای تخفیف</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            کد تخفیف جدید
          </button>
        </div>

        {/* Create Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">کد تخفیف جدید</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit((d) => createCoupon(d))} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">کد تخفیف *</label>
                  <input
                    {...register('code')}
                    dir="ltr"
                    placeholder="SUMMER20"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm uppercase focus:border-blue-500 focus:outline-none"
                  />
                  {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">نوع تخفیف</label>
                    <select
                      {...register('type')}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="PERCENTAGE">درصدی</option>
                      <option value="FIXED_AMOUNT">مقدار ثابت</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">مقدار *</label>
                    <input
                      {...register('value', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">حداکثر تخفیف (ریال)</label>
                    <input
                      {...register('maxDiscount', { valueAsNumber: true })}
                      type="number"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">سقف استفاده</label>
                    <input
                      {...register('usageLimit', { valueAsNumber: true })}
                      type="number"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">از تاریخ *</label>
                    <input
                      {...register('validFrom')}
                      type="date"
                      dir="ltr"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">تا تاریخ *</label>
                    <input
                      {...register('validTo')}
                      type="date"
                      dir="ltr"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 rounded-xl border py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isPending ? 'در حال ذخیره...' : 'ایجاد کد تخفیف'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Coupons Table */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">کد</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">نوع</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">مقدار</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">استفاده</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">اعتبار</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">وضعیت</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 animate-pulse rounded bg-gray-200" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : !coupons?.length ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-gray-400">
                      <Tag className="mx-auto mb-3 h-10 w-10 opacity-40" />
                      <p>کد تخفیفی ثبت نشده</p>
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-mono font-bold text-gray-900" dir="ltr">{coupon.code}</td>
                      <td className="px-5 py-4 text-gray-600">
                        {coupon.type === 'PERCENTAGE' ? 'درصدی' : 'مقدار ثابت'}
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {coupon.type === 'PERCENTAGE' ? `${coupon.value}٪` : `${coupon.value.toLocaleString('fa-IR')} ریال`}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-gray-900">{coupon.usedCount}</span>
                        {coupon.usageLimit && (
                          <span className="text-gray-400"> / {coupon.usageLimit}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">
                        {formatDate(coupon.validFrom)} — {formatDate(coupon.validTo)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {coupon.isActive ? 'فعال' : 'غیرفعال'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => {
                            if (confirm('آیا از حذف این کد تخفیف مطمئن هستید؟')) {
                              deleteCoupon(coupon.id);
                            }
                          }}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
