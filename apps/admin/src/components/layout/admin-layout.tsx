'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  BookOpen,
  Users,
  CreditCard,
  Star,
  Ticket,
  BarChart2,
  Tag,
  Settings,
  LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/tours', label: 'تورها', icon: Map },
  { href: '/bookings', label: 'رزروها', icon: BookOpen },
  { href: '/users', label: 'کاربران', icon: Users },
  { href: '/payments', label: 'پرداخت‌ها', icon: CreditCard },
  { href: '/reviews', label: 'نظرات', icon: Star },
  { href: '/marketing', label: 'بازاریابی', icon: Tag },
  { href: '/reports', label: 'گزارشات', icon: BarChart2 },
  { href: '/settings', label: 'تنظیمات', icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-60 border-l bg-white shadow-sm z-30">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
            T
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">تورلیدر</div>
            <div className="text-xs text-gray-400">پنل مدیریت</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t p-3">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 mr-60 min-h-screen bg-gray-50">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">
            {NAV_ITEMS.find((item) => pathname.startsWith(item.href))?.label || 'داشبورد'}
          </h2>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
              م
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
