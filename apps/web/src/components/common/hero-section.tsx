'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, MapPin, CalendarDays, Users, Sparkles, ChevronDown } from 'lucide-react';

const DESTINATIONS = [
  'استانبول', 'آنتالیا', 'دبی', 'باکو',
  'مشهد', 'کیش', 'اصفهان', 'شیراز', 'تهران',
];

const TRENDING = ['استانبول', 'آنتالیا', 'مشهد', 'کیش', 'دبی'];

export function HeroSection() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [travelers, setTravelers] = useState('2');
  const [destOpen, setDestOpen] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) params.set('q', destination.trim());
    if (date) params.set('date', date);
    if (travelers) params.set('travelers', travelers);
    router.push(`/tours${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="relative min-h-[680px] w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-persepolis.jpg"
          alt="تخت جمشید - میراث ایران"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-slate-900/70" />
        <div className="absolute inset-0 bg-gradient-to-l from-emerald-950/40 via-transparent to-teal-950/30" />
      </div>

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />

      {/* Content */}
      <div className="container-app relative z-10 flex min-h-[680px] flex-col items-center justify-center pt-24 pb-16 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-sm font-medium text-amber-200 backdrop-blur-sm">
          <Sparkles className="h-4 w-4" />
          بیش از ۵۰۰ تور فعال در سراسر جهان
        </div>

        {/* Headline */}
        <h1 className="mb-5 max-w-4xl text-4xl font-black leading-[1.15] text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
          سفری که سال‌ها در
          <span className="bg-gradient-to-l from-emerald-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent">
            {' '}خاطرت می‌ماند
          </span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-gray-200/90 sm:text-xl">
          از شکوه تخت‌جمشید تا سواحل آنتالیا؛ بهترین تورهای داخلی و خارجی را با
          خیال راحت رزرو کن
        </p>

        {/* Search Box */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-4xl rounded-3xl border border-white/20 bg-white/95 p-3 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-4"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-2">
            {/* Destination */}
            <div className="relative flex-1">
              <div className="flex h-full items-center gap-3 rounded-2xl bg-emerald-50/60 px-4 py-3 text-right transition-colors focus-within:bg-emerald-50">
                <MapPin className="h-5 w-5 shrink-0 text-emerald-600" />
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-emerald-700/80">
                    کجا می‌خوای بری؟
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onFocus={() => setDestOpen(true)}
                    onBlur={() => setTimeout(() => setDestOpen(false), 150)}
                    placeholder="مقصد، شهر یا کشور"
                    className="w-full bg-transparent text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Destination dropdown */}
              {destOpen && (
                <div className="absolute top-full right-0 z-30 mt-2 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 text-right shadow-xl">
                  <p className="px-3 py-1.5 text-[11px] font-semibold text-gray-400">
                    مقاصد پیشنهادی
                  </p>
                  {DESTINATIONS.filter((d) =>
                    destination ? d.includes(destination) : true,
                  ).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onMouseDown={() => {
                        setDestination(d);
                        setDestOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <MapPin className="h-4 w-4 text-emerald-500" />
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="hidden w-px bg-gray-200 lg:block" />

            {/* Date */}
            <div className="flex-1">
              <div className="flex h-full items-center gap-3 rounded-2xl bg-teal-50/60 px-4 py-3 transition-colors focus-within:bg-teal-50">
                <CalendarDays className="h-5 w-5 shrink-0 text-teal-600" />
                <div className="flex-1 text-right">
                  <label className="block text-[11px] font-semibold text-teal-700/80">
                    کِی می‌خوای بری؟
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    dir="ltr"
                    className="w-full bg-transparent text-sm font-medium text-gray-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden w-px bg-gray-200 lg:block" />

            {/* Travelers */}
            <div className="lg:w-44">
              <div className="flex h-full items-center gap-3 rounded-2xl bg-amber-50/60 px-4 py-3 transition-colors focus-within:bg-amber-50">
                <Users className="h-5 w-5 shrink-0 text-amber-600" />
                <div className="flex-1 text-right">
                  <label className="block text-[11px] font-semibold text-amber-700/80">
                    چند نفرید؟
                  </label>
                  <div className="relative">
                    <select
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      className="w-full appearance-none bg-transparent text-sm font-medium text-gray-900 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} مسافر
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute left-0 top-1 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/40 transition-all hover:from-emerald-600 hover:to-teal-700 hover:shadow-emerald-500/50 lg:px-6"
            >
              <Search className="h-5 w-5" />
              جستجو
            </button>
          </div>
        </form>

        {/* Trending */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-gray-300">پرطرفدارها:</span>
          {TRENDING.map((dest) => (
            <button
              key={dest}
              onClick={() => router.push(`/tours?q=${encodeURIComponent(dest)}`)}
              className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:border-emerald-400/50 hover:bg-emerald-500/20"
            >
              {dest}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full" preserveAspectRatio="none">
          <path
            d="M0 80V40C240 10 480 0 720 10C960 20 1200 50 1440 40V80H0Z"
            fill="rgb(248 250 249)"
          />
        </svg>
      </div>
    </section>
  );
}
