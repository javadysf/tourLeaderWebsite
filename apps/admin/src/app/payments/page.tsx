'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Search, CreditCard } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { formatPrice, formatDate } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function getToken() {
  if (typeof window !== 'undefined') return localStorage.getItem('adminToken') || '';
  return '';
}

const METHOD_LABELS: Record<string, string> = {
  CARD: 'کارت بانکی',
  WALLET: 'کیف پول',
  INSTALLMENT: 'اقساط',
  GATEWAY: 'درگاه آنلاین',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'در انتظار', color: 'bg-yellow-100 text-yellow-700' },
  SUCCESS: { label: 'موفق', color: 'bg-green-100 text-green-700' },
  FAILED: { label: 'ناموفق', color: 'bg-red-100 text-red-700' },
  CANCELLED: { label: 'لغو شده', color: 'bg-gray-100 text-gray-600' },
  REFUNDED: { label: 'استرداد شده', color: 'bg-blue-100 text-blue-700' },
};

interface Payment {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  gateway?: string;
  gatewayTransactionId?: string;
  paidAt?: string;
  createdAt: string;
  booking: { bookingCode: string };
  user: { firstName: string; lastName: string };
}

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments', search, statusFilter, page],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/payments`, {
        params: { search, status: statusFilter || undefined, page, limit: 20 },
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data.data as { items: Payment[]; total: number; totalPages: number; totalAmount: number };
    },
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">مدیریت پرداخت‌ها</h1>
          {data?.totalAmount !== undefined && (
            <div className="rounded-xl bg-green-50 px-4 py-2">
              <p className="text-xs text-gray-500">مجموع پرداخت‌های موفق</p>
              <p className="font-bold text-green-700">{formatPrice(data.totalAmount)}</p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="کد رزرو یا شناسه تراکنش..."
              className="w-full rounded-xl border border-gray-300 py-2 pr-10 pl-4 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="SUCCESS">موفق</option>
            <option value="PENDING">در انتظار</option>
            <option value="FAILED">ناموفق</option>
            <option value="REFUNDED">استرداد شده</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">شناسه</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">کاربر</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">کد رزرو</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">روش پرداخت</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">مبلغ</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">وضعیت</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 animate-pulse rounded bg-gray-200" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : !data?.items?.length ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-gray-400">
                      <CreditCard className="mx-auto mb-3 h-10 w-10 opacity-40" />
                      <p>پرداختی یافت نشد</p>
                    </td>
                  </tr>
                ) : (
                  data.items.map((payment) => {
                    const statusMeta = STATUS_LABELS[payment.status] || { label: payment.status, color: 'bg-gray-100' };
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 font-mono text-xs text-gray-500" dir="ltr">
                          {payment.gatewayTransactionId || payment.id.slice(0, 8)}
                        </td>
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {payment.user.firstName} {payment.user.lastName}
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-blue-700">
                          {payment.booking.bookingCode}
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {METHOD_LABELS[payment.method] || payment.method}
                          {payment.gateway && (
                            <span className="ml-1 text-xs text-gray-400">({payment.gateway})</span>
                          )}
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-900">{formatPrice(Number(payment.amount))}</td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMeta.color}`}>
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500">
                          {formatDate(payment.paidAt || payment.createdAt)}
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
              <p className="text-sm text-gray-500">مجموع {data.total} تراکنش</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-40">قبلی</button>
                <span className="flex items-center px-3 text-sm text-gray-600">صفحه {page} از {data.totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-40">بعدی</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
