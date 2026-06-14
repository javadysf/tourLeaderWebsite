'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Search, Eye, Edit, Trash2, Map } from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/layout/admin-layout';
import { formatPrice, formatDate } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function getToken() {
  if (typeof window !== 'undefined') return localStorage.getItem('adminToken') || '';
  return '';
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'پیش‌نویس', color: 'bg-gray-100 text-gray-600' },
  PUBLISHED: { label: 'منتشر شده', color: 'bg-green-100 text-green-700' },
  FINISHED: { label: 'پایان یافته', color: 'bg-blue-100 text-blue-700' },
  CANCELLED: { label: 'لغو شده', color: 'bg-red-100 text-red-700' },
};

interface Tour {
  id: string;
  title: string;
  slug: string;
  status: string;
  basePrice: number;
  maxCapacity: number;
  currentCapacity: number;
  departureDate: string;
  destinationCity?: string;
  destinationCountry?: string;
  coverImage?: string;
  _count?: { bookings: number };
}

export default function AdminToursPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tours', search, page],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/tours`, {
        params: { search, page, limit: 20 },
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data.data as { items: Tour[]; total: number; totalPages: number };
    },
  });

  const { mutate: deleteTour } = useMutation({
    mutationFn: (id: string) =>
      axios.delete(`${API_URL}/tours/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      }),
    onSuccess: () => {
      toast.success('تور حذف شد');
      queryClient.invalidateQueries({ queryKey: ['admin-tours'] });
    },
    onError: () => toast.error('خطا در حذف تور'),
  });

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">مدیریت تورها</h1>
          <a
            href="/tours/create"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            تور جدید
          </a>
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="جستجوی تور..."
              className="w-full rounded-xl border border-gray-300 py-2 pr-10 pl-4 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">تور</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">وضعیت</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">قیمت</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">ظرفیت</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">تاریخ حرکت</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">رزروها</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">عملیات</th>
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
                ) : data?.items?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-gray-400">
                      <Map className="mx-auto mb-3 h-10 w-10 opacity-40" />
                      <p>توری یافت نشد</p>
                    </td>
                  </tr>
                ) : (
                  data?.items?.map((tour) => {
                    const statusMeta = STATUS_LABELS[tour.status] || { label: tour.status, color: 'bg-gray-100 text-gray-600' };
                    return (
                      <tr key={tour.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {tour.coverImage ? (
                              <img src={tour.coverImage} alt={tour.title} className="h-10 w-14 rounded-lg object-cover" />
                            ) : (
                              <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-gray-100">
                                <Map className="h-5 w-5 text-gray-300" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{tour.title}</p>
                              <p className="text-xs text-gray-400">{tour.destinationCity}، {tour.destinationCountry}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMeta.color}`}>
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-medium text-gray-900">{formatPrice(Number(tour.basePrice))}</td>
                        <td className="px-5 py-4">
                          <span className="text-gray-900">{tour.currentCapacity}</span>
                          <span className="text-gray-400"> / {tour.maxCapacity}</span>
                        </td>
                        <td className="px-5 py-4 text-gray-600">{formatDate(tour.departureDate)}</td>
                        <td className="px-5 py-4 font-medium text-blue-700">{tour._count?.bookings || 0}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={`http://localhost:3000/tours/${tour.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                              title="مشاهده"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                            <a
                              href={`/tours/${tour.id}/edit`}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                              title="ویرایش"
                            >
                              <Edit className="h-4 w-4" />
                            </a>
                            <button
                              onClick={() => {
                                if (confirm('آیا از حذف این تور مطمئن هستید؟')) {
                                  deleteTour(tour.id);
                                }
                              }}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                              title="حذف"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-5 py-4">
              <p className="text-sm text-gray-500">
                مجموع {data.total} تور
              </p>
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
