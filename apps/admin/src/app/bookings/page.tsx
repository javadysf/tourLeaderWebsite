'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Search, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/layout/admin-layout';
import { formatPrice, formatDate } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function getToken() {
  if (typeof window !== 'undefined') return localStorage.getItem('adminToken') || '';
  return '';
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'در انتظار', color: 'bg-yellow-100 text-yellow-700' },
  PAID: { label: 'پرداخت شده', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'لغو شده', color: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'استرداد شده', color: 'bg-gray-100 text-gray-600' },
};

interface Booking {
  id: string;
  bookingCode: string;
  status: string;
  totalPrice: number;
  passengersCount: number;
  createdAt: string;
  tour: { title: string };
  user: { firstName: string; lastName: string; mobile?: string };
}

export default function AdminBookingsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', search, statusFilter, page],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/bookings`, {
        params: { search, status: statusFilter || undefined, page, limit: 20 },
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data.data as { items: Booking[]; total: number; totalPages: number };
    },
  });

  const { mutate: cancelBooking } = useMutation({
    mutationFn: (id: string) =>
      axios.patch(
        `${API_URL}/bookings/${id}/cancel`,
        { reason: 'لغو توسط مدیر' },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      ),
    onSuccess: () => {
      toast.success('رزرو لغو شد');
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
    },
    onError: () => toast.error('خطا در لغو رزرو'),
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">مدیریت رزروها</h1>
          <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {data?.total || 0} رزرو
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="کد رزرو یا نام مسافر..."
              className="w-full rounded-xl border border-gray-300 py-2 pr-10 pl-4 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="PENDING">در انتظار</option>
            <option value="PAID">پرداخت شده</option>
            <option value="CANCELLED">لغو شده</option>
            <option value="REFUNDED">استرداد شده</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">کد رزرو</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">مسافر</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">تور</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">وضعیت</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">مبلغ</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">نفرات</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">تاریخ ثبت</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 animate-pulse rounded bg-gray-200" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : !data?.items?.length ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-gray-400">
                      <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-40" />
                      <p>رزروی یافت نشد</p>
                    </td>
                  </tr>
                ) : (
                  data.items.map((booking) => {
                    const statusMeta = STATUS_LABELS[booking.status] || { label: booking.status, color: 'bg-gray-100' };
                    return (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 font-mono text-xs text-blue-700">{booking.bookingCode}</td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900">
                            {booking.user.firstName} {booking.user.lastName}
                          </p>
                          {booking.user.mobile && (
                            <p className="text-xs text-gray-400" dir="ltr">{booking.user.mobile}</p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-gray-700">{booking.tour.title}</td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMeta.color}`}>
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-medium text-gray-900">{formatPrice(Number(booking.totalPrice))}</td>
                        <td className="px-5 py-4 text-center">{booking.passengersCount}</td>
                        <td className="px-5 py-4 text-gray-500">{formatDate(booking.createdAt)}</td>
                        <td className="px-5 py-4">
                          {booking.status === 'PAID' && (
                            <button
                              onClick={() => {
                                if (confirm('آیا از لغو این رزرو مطمئن هستید؟')) {
                                  cancelBooking(booking.id);
                                }
                              }}
                              className="rounded-lg px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              لغو
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-5 py-4">
              <p className="text-sm text-gray-500">مجموع {data.total} رزرو</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-40"
                >
                  قبلی
                </button>
                <span className="flex items-center px-3 text-sm text-gray-600">
                  صفحه {page} از {data.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                  className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-40"
                >
                  بعدی
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
