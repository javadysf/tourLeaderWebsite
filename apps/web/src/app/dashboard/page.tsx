'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Wallet, Star, User, Bell } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/store/auth.store';
import { formatPrice, formatNumber } from '@/lib/utils';

const MENU_ITEMS = [
  { href: '/dashboard/bookings', label: 'رزروهای من', icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
  { href: '/dashboard/wallet', label: 'کیف پول', icon: Wallet, color: 'bg-green-50 text-green-600' },
  { href: '/dashboard/reviews', label: 'نظرات من', icon: Star, color: 'bg-yellow-50 text-yellow-600' },
  { href: '/dashboard/profile', label: 'پروفایل', icon: User, color: 'bg-purple-50 text-purple-600' },
  { href: '/dashboard/notifications', label: 'اعلان‌ها', icon: Bell, color: 'bg-red-50 text-red-600' },
];

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-app py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            سلام {user.firstName}! 👋
          </h1>
          <p className="mt-1 text-gray-500">به داشبورد شخصی خود خوش آمدید</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="rounded-2xl border bg-white p-5 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(Number(user.walletBalance), 'IRR')}
            </div>
            <div className="mt-1 text-sm text-gray-500">کیف پول</div>
          </div>
          <div className="rounded-2xl border bg-white p-5 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(user.loyaltyPoints)}
            </div>
            <div className="mt-1 text-sm text-gray-500">امتیاز وفاداری</div>
          </div>
          <div className="rounded-2xl border bg-white p-5 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">—</div>
            <div className="mt-1 text-sm text-gray-500">سفرهای من</div>
          </div>
        </div>

        {/* Menu */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-3 rounded-2xl border bg-white p-6 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.color}`}>
                <item.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
