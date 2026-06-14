'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  User,
  LogOut,
  Wallet,
  BookOpen,
  ChevronDown,
  Compass,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/use-auth';

interface HeaderProps {
  /** اگر true باشد، هدر روی هیرو شفاف می‌نشیند و با اسکرول سفید می‌شود */
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { mutate: logout } = useLogout();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/tours', label: 'همه تورها' },
    { href: '/tours?category=DOMESTIC', label: 'داخلی' },
    { href: '/tours?category=INTERNATIONAL', label: 'خارجی' },
    { href: '/tours?category=NATURE', label: 'طبیعت‌گردی' },
    { href: '/tours?category=LUXURY', label: 'لوکس' },
  ];

  // وقتی شفاف است و هنوز اسکرول نشده، متن‌ها روشن باشند
  const onDark = transparent && !scrolled;

  const headerClass = onDark
    ? 'bg-transparent border-transparent'
    : 'bg-white/90 backdrop-blur-md border-gray-200/80 shadow-sm';

  const linkClass = onDark
    ? 'text-white/90 hover:text-white'
    : 'text-gray-600 hover:text-emerald-700';

  return (
    <header
      className={`${transparent ? 'fixed' : 'sticky'} top-0 z-50 w-full border-b transition-all duration-300 ${headerClass}`}
    >
      <div className="container-app">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
              <Compass className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <span
                className={`block text-lg font-extrabold ${onDark ? 'text-white' : 'text-gray-900'}`}
              >
                تورلیدر
              </span>
              <span
                className={`block text-[10px] font-medium ${onDark ? 'text-emerald-200' : 'text-emerald-600'}`}
              >
                سفر بی‌دغدغه
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${linkClass}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Support phone */}
            <a
              href="tel:02100000000"
              className={`hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors xl:flex ${linkClass}`}
            >
              <Phone className="h-4 w-4" />
              <span dir="ltr">۰۲۱-۰۰۰۰۰۰۰۰</span>
            </a>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    onDark
                      ? 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white">
                    {user.firstName?.charAt(0)}
                  </span>
                  <span className="hidden sm:inline">{user.firstName}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute left-0 top-12 z-20 w-52 overflow-hidden rounded-2xl border bg-white py-1.5 shadow-xl">
                      <div className="border-b px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="truncate text-xs text-gray-400" dir="ltr">
                          {user.email || user.mobile}
                        </p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => setUserMenuOpen(false)}>
                        <User className="h-4 w-4" /> داشبورد
                      </Link>
                      <Link href="/dashboard/bookings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => setUserMenuOpen(false)}>
                        <BookOpen className="h-4 w-4" /> رزروهای من
                      </Link>
                      <Link href="/dashboard/wallet" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => setUserMenuOpen(false)}>
                        <Wallet className="h-4 w-4" /> کیف پول
                      </Link>
                      <hr className="my-1" />
                      <button onClick={() => logout()} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="h-4 w-4" /> خروج
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="hidden sm:block">
                  <button
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      onDark ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    ورود
                  </button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 hover:from-emerald-600 hover:to-teal-700">
                    ثبت‌نام
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              className={`rounded-lg p-2 transition-colors lg:hidden ${
                onDark ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="منو"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="flex flex-col gap-1 border-t border-gray-100 bg-white py-4 lg:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                href="/auth/login"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-emerald-700 sm:hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                ورود به حساب
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
