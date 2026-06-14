import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Headphones, CreditCard, Star, Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { HeroSection } from '@/components/common/hero-section';
import { FeaturedToursSection } from '@/components/tour/featured-tours-section';
import { CategorySection } from '@/components/tour/category-section';
import { PopularDestinations } from '@/components/tour/popular-destinations';

export const metadata: Metadata = {
  title: 'تورلیدر — سفر را به بهترین شکل تجربه کن',
};

const TRUST_ITEMS = [
  { icon: ShieldCheck, title: 'تضمین قیمت', description: 'بهترین قیمت را تضمین می‌کنیم', color: 'from-emerald-400 to-teal-500' },
  { icon: Headphones, title: 'پشتیبانی ۲۴/۷', description: 'همیشه در کنار شما هستیم', color: 'from-sky-400 to-blue-500' },
  { icon: CreditCard, title: 'پرداخت امن', description: 'درگاه‌های پرداخت معتبر', color: 'from-amber-400 to-orange-500' },
  { icon: Star, title: 'رضایت مشتری', description: 'بیش از ۱۰٬۰۰۰ مسافر راضی', color: 'from-fuchsia-400 to-purple-500' },
];

const STATS = [
  { value: '۱۰٬۰۰۰+', label: 'مسافر راضی' },
  { value: '۵۰۰+', label: 'تور فعال' },
  { value: '۴۵+', label: 'مقصد گردشگری' },
  { value: '۸ سال', label: 'تجربه و اعتماد' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[rgb(248_250_249)]">
      <Header transparent />
      <main>
        <HeroSection />

        {/* Stats bar */}
        <section className="relative z-20 -mt-2">
          <div className="container-app">
            <div className="grid grid-cols-2 gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:grid-cols-4 sm:p-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="bg-gradient-to-l from-emerald-600 to-teal-500 bg-clip-text text-2xl font-black text-transparent sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CategorySection />
        <PopularDestinations />
        <FeaturedToursSection />

        {/* Trust Section */}
        <section className="py-16">
          <div className="container-app">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                چرا تورلیدر؟
              </h2>
              <p className="mt-2 text-gray-500">تجربه‌ای بی‌دغدغه از رزرو تا بازگشت</p>
            </div>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {TRUST_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col items-center gap-3 rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20">
          <div className="container-app">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-emerald-600 via-teal-600 to-emerald-700 px-8 py-16 text-center shadow-2xl">
              {/* decorative blobs */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />

              <div className="relative">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
                  <Sparkles className="h-4 w-4" />
                  همین حالا شروع کن
                </div>
                <h2 className="mb-4 text-3xl font-black text-white sm:text-4xl">
                  آماده‌ی سفر بعدی‌ت هستی؟
                </h2>
                <p className="mx-auto mb-8 max-w-xl text-lg text-emerald-50">
                  تور موردنظرت رو پیدا کن، آنلاین رزرو کن و با خیال راحت سفر کن
                </p>
                <Link
                  href="/tours"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 font-bold text-emerald-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  مشاهده تمام تورها
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container-app py-10">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-right">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold">
                ت
              </div>
              <span className="font-extrabold text-gray-900">تورلیدر</span>
            </div>
            <p className="text-sm text-gray-400">
              © ۱۴۰۵ تورلیدر — تمام حقوق محفوظ است
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
