import Link from 'next/link';

const CATEGORIES = [
  { key: 'DOMESTIC', label: 'داخلی', emoji: '🇮🇷', from: 'from-green-400', to: 'to-emerald-500' },
  { key: 'INTERNATIONAL', label: 'خارجی', emoji: '🌍', from: 'from-sky-400', to: 'to-blue-500' },
  { key: 'NATURE', label: 'طبیعت‌گردی', emoji: '🌿', from: 'from-lime-400', to: 'to-green-500' },
  { key: 'PILGRIMAGE', label: 'زیارتی', emoji: '🕌', from: 'from-amber-400', to: 'to-orange-500' },
  { key: 'ADVENTURE', label: 'ماجراجویی', emoji: '🏔️', from: 'from-orange-400', to: 'to-red-500' },
  { key: 'CULTURAL', label: 'فرهنگی', emoji: '🎭', from: 'from-purple-400', to: 'to-fuchsia-500' },
  { key: 'RECREATIONAL', label: 'تفریحی', emoji: '🎡', from: 'from-pink-400', to: 'to-rose-500' },
  { key: 'LUXURY', label: 'لوکس', emoji: '💎', from: 'from-yellow-400', to: 'to-amber-500' },
];

export function CategorySection() {
  return (
    <section className="py-14">
      <div className="container-app">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            چه نوع سفری دوست داری؟
          </h2>
          <p className="mt-2 text-gray-500">
            دسته‌بندی موردنظرت رو انتخاب کن و تورهای مرتبط رو ببین
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={`/tours?category=${cat.key}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-transparent hover:shadow-xl"
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.from} ${cat.to} text-3xl shadow-lg transition-transform group-hover:scale-110`}
              >
                {cat.emoji}
              </span>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
