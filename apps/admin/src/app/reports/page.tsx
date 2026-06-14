'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BarChart2, TrendingUp, Users, Map, BookOpen, DollarSign } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { formatPrice, formatNumber } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function getToken() {
  if (typeof window !== 'undefined') return localStorage.getItem('adminToken') || '';
  return '';
}

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: typeof BarChart2;
  color: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function AdminReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/reports/dashboard`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data.data;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('adminToken'),
  });

  const { data: salesData, isLoading: isSalesLoading } = useQuery({
    queryKey: ['admin-sales'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/reports/sales`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data.data;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('adminToken'),
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="mb-6 text-xl font-bold text-gray-900">گزارشات</h1>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : data ? (
          <>
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              <MetricCard
                label="کل کاربران"
                value={formatNumber(data.users?.total || 0)}
                sub={`${formatNumber(data.users?.newToday || 0)} امروز`}
                icon={Users}
                color="bg-blue-500"
              />
              <MetricCard
                label="کاربران فعال"
                value={formatNumber(data.users?.active || 0)}
                sub="در ۳۰ روز گذشته"
                icon={TrendingUp}
                color="bg-cyan-500"
              />
              <MetricCard
                label="کل تورها"
                value={formatNumber(data.tours?.total || 0)}
                sub={`${formatNumber(data.tours?.active || 0)} فعال`}
                icon={Map}
                color="bg-green-500"
              />
              <MetricCard
                label="رزروهای این ماه"
                value={formatNumber(data.bookings?.thisMonth || 0)}
                sub={`${formatNumber(data.bookings?.total || 0)} کل`}
                icon={BookOpen}
                color="bg-purple-500"
              />
              <MetricCard
                label="درآمد این ماه"
                value={formatPrice(Number(data.revenue?.thisMonth || 0))}
                icon={DollarSign}
                color="bg-orange-500"
              />
              <MetricCard
                label="درآمد کل"
                value={formatPrice(Number(data.revenue?.total || 0))}
                icon={DollarSign}
                color="bg-yellow-500"
              />
            </div>

            {/* Top Tours */}
            {data.topTours?.length > 0 && (
              <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-semibold text-gray-900">پرفروش‌ترین تورها</h2>
                <div className="space-y-3">
                  {data.topTours.map((tour: any, idx: number) => (
                    <div key={tour.id} className="flex items-center gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-gray-900">{tour.title}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-blue-500"
                              style={{
                                width: `${Math.min(100, ((tour._count?.bookings || 0) / (data.topTours[0]?._count?.bookings || 1)) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="shrink-0 text-xs text-gray-500">
                            {formatNumber(tour._count?.bookings || 0)} رزرو
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <div className="text-center">
              <BarChart2 className="mx-auto mb-3 h-12 w-12 opacity-40" />
              <p>لطفاً با حساب ادمین وارد شوید</p>
            </div>
          </div>
        )}

        {/* Sales Report */}
        {salesData && (
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-900">گزارش فروش</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-xl font-bold text-gray-900">{formatNumber(salesData.totalBookings || 0)}</p>
                <p className="mt-1 text-xs text-gray-500">کل رزروها</p>
              </div>
              <div className="rounded-xl bg-green-50 p-4 text-center">
                <p className="text-xl font-bold text-green-700">{formatNumber(salesData.paidBookings || 0)}</p>
                <p className="mt-1 text-xs text-gray-500">پرداخت شده</p>
              </div>
              <div className="rounded-xl bg-yellow-50 p-4 text-center">
                <p className="text-xl font-bold text-yellow-700">{formatNumber(salesData.pendingBookings || 0)}</p>
                <p className="mt-1 text-xs text-gray-500">در انتظار</p>
              </div>
              <div className="rounded-xl bg-red-50 p-4 text-center">
                <p className="text-xl font-bold text-red-700">{formatNumber(salesData.cancelledBookings || 0)}</p>
                <p className="mt-1 text-xs text-gray-500">لغو شده</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
