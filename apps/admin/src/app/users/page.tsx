'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Search, Users, ShieldOff, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/layout/admin-layout';
import { formatDate } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function getToken() {
  if (typeof window !== 'undefined') return localStorage.getItem('adminToken') || '';
  return '';
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'مدیر ارشد',
  ADMIN: 'ادمین',
  AGENCY_ADMIN: 'مدیر آژانس',
  AGENCY_STAFF: 'کارمند آژانس',
  TOUR_GUIDE: 'راهنمای تور',
  ACCOUNTANT: 'حسابدار',
  CONTENT_MANAGER: 'مدیر محتوا',
  SUPPORT_AGENT: 'پشتیبانی',
  CUSTOMER: 'مسافر',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'فعال', color: 'bg-green-100 text-green-700' },
  INACTIVE: { label: 'غیرفعال', color: 'bg-gray-100 text-gray-600' },
  BANNED: { label: 'مسدود', color: 'bg-red-100 text-red-700' },
  SUSPENDED: { label: 'تعلیق', color: 'bg-yellow-100 text-yellow-700' },
};

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  mobile?: string;
  role: string;
  status: string;
  createdAt: string;
  _count?: { bookings: number };
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, roleFilter, page],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/users`, {
        params: { search, role: roleFilter || undefined, page, limit: 20 },
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data.data as { items: User[]; total: number; totalPages: number };
    },
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      axios.patch(
        `${API_URL}/users/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      ),
    onSuccess: () => {
      toast.success('وضعیت کاربر بروزرسانی شد');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('خطا در بروزرسانی'),
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">مدیریت کاربران</h1>
          <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">{data?.total || 0} کاربر</span>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="نام، ایمیل یا موبایل..."
              className="w-full rounded-xl border border-gray-300 py-2 pr-10 pl-4 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">همه نقش‌ها</option>
            {Object.entries(ROLE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">کاربر</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">نقش</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">وضعیت</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">رزروها</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">تاریخ ثبت‌نام</th>
                  <th className="px-5 py-3.5 text-right font-medium text-gray-500">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 animate-pulse rounded bg-gray-200" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : !data?.items?.length ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400">
                      <Users className="mx-auto mb-3 h-10 w-10 opacity-40" />
                      <p>کاربری یافت نشد</p>
                    </td>
                  </tr>
                ) : (
                  data.items.map((u) => {
                    const statusMeta = STATUS_LABELS[u.status] || { label: u.status, color: 'bg-gray-100' };
                    return (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                              {u.firstName?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                              <p className="text-xs text-gray-400" dir="ltr">{u.email || u.mobile}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-600">{ROLE_LABELS[u.role] || u.role}</td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMeta.color}`}>
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center text-gray-700">{u._count?.bookings || 0}</td>
                        <td className="px-5 py-4 text-gray-500">{formatDate(u.createdAt)}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            {u.status === 'ACTIVE' ? (
                              <button
                                onClick={() => updateStatus({ id: u.id, status: 'BANNED' })}
                                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                                title="مسدود کردن"
                              >
                                <ShieldOff className="h-3.5 w-3.5" />
                                مسدود
                              </button>
                            ) : (
                              <button
                                onClick={() => updateStatus({ id: u.id, status: 'ACTIVE' })}
                                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-green-600 hover:bg-green-50"
                                title="فعال‌سازی"
                              >
                                <ShieldCheck className="h-3.5 w-3.5" />
                                فعال
                              </button>
                            )}
                          </div>
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
              <p className="text-sm text-gray-500">مجموع {data.total} کاربر</p>
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
