'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Map,
  BookOpen,
  DollarSign,
  TrendingUp,
  Clock,
} from 'lucide-react';
import axios from 'axios';
import { AdminLayout } from '@/components/layout/admin-layout';
import { formatPrice, formatNumber } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function api(token: string) {
  return axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: string;
  icon: any;
  color: string;
  sub?: string;
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

export default function AdminDashboardPage() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') || '' : '';

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/reports/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    },
    enabled: !!token,
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="mb-6 text-xl font-bold text-gray-900">داشبورد</h1>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : data ? (
          <>
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              <StatCard
                label="کل کاربران"
                value={formatNumber(data.users?.total || 0)}
                sub={`${formatNumber(data.users?.newToday || 0)} کاربر امروز`}
                icon={Users}
                color="bg-blue-500"
              />
              <StatCard
                label="تورهای فعال"
                value={formatNumber(data.tours?.active || 0)}
                sub={`از ${formatNumber(data.tours?.total || 0)} کل تور`}
                icon={Map}
                color="bg-green-500"
              />
              <StatCard
                label="رزروهای این ماه"
                value={formatNumber(data.bookings?.thisMonth || 0)}
                sub={`${formatNumber(data.bookings?.pending || 0)} در انتظار`}
                icon={BookOpen}
                color="bg-purple-500"
              />
              <StatCard
                label="درآمد این ماه"
                value={formatPrice(Number(data.revenue?.thisMonth || 0))}
                sub={`کل درآمد: ${formatPrice(Number(data.revenue?.total || 0))}`}
                icon={DollarSign}
                color="bg-orange-500"
              />
            </div>

            {/* Top Tours */}
            {data.topTours?.length > 0 && (
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-semibold text-gray-900">پرفروش‌ترین تورها</h2>
                <div className="space-y-3">
                  {data.topTours.map((tour: any) => (
                    <div key={tour.id} className="flex items-center gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Map className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-gray-900">{tour.title}</p>
                        <p className="text-xs text-gray-400">
                          {formatNumber(tour.currentCapacity)} / {formatNumber(tour.maxCapacity)} نفر
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-blue-600">
                        {formatNumber(tour._count?.bookings || 0)} رزرو
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <p>لطفاً وارد شوید</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
