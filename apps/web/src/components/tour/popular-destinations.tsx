import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowLeft } from 'lucide-react';

interface Destination {
  name: string;
  country: string;
  image: string;
  tours: number;
  query: string;
  /** اندازه در گرید بنتو */
  span?: string;
}

const DESTINATIONS: Destination[] = [
  {
    name: 'اصفهان',
    country: 'ایران',
    image: '/images/destinations/isfahan.jpg',
    tours: 24,
    query: 'اصفهان',
    span: 'lg:col-span-2 lg:row-span-2',
  },
  {
    name: 'استانبول',
    country: 'ترکیه',
    image: '/images/destinations/istanbul.jpg',
    tours: 38,
    query: 'استانبول',
  },
  {
    name: 'شیراز',
    country: 'ایران',
    image: '/images/destinations/shiraz.jpg',
    tours: 19,
    query: 'شیراز',
  },
  {
    name: 'دبی',
    country: 'امارات',
    image: '/images/destinations/dubai.jpg',
    tours: 27,
    query: 'دبی',
  },
  {
    name: 'آنتالیا',
    country: 'ترکیه',
    image: '/images/destinations/antalya.jpg',
    tours: 31,
    query: 'آنتالیا',
  },
  {
    name: 'مشهد',
    country: 'ایران',
    image: '/images/destinations/mashhad.jpg',
    tours: 42,
    query: 'مشهد',
  },
  {
    name: 'کیش',
    country: 'ایران',
    image: '/images/destinations/kish.jpg',
    tours: 16,
    query: 'کیش',
  },
];

function DestinationCard({ dest }: { dest: Destination }) {
  return (
    <Link
      href={`/tours?q=${encodeURIComponent(dest.query)}`}
      className={`group relative overflow-hidden rounded-3xl ${dest.span || ''} min-h-[200px]`}
    >
      <Image
        src={dest.image}
        alt={`${dest.name} - ${dest.country}`}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 1024px) 50vw, 33vw"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:from-black/90" />

      {/* Tours badge */}
      <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur">
        {dest.tours} تور
      </span>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="mb-0.5 flex items-center gap-1 text-xs text-emerald-200">
          <MapPin className="h-3.5 w-3.5" />
          {dest.country}
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-white drop-shadow">
            {dest.name}
          </h3>
          <span className="flex h-9 w-9 translate-x-2 items-center justify-center rounded-full bg-white/0 text-white opacity-0 transition-all group-hover:translate-x-0 group-hover:bg-emerald-500 group-hover:opacity-100">
            <ArrowLeft className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function PopularDestinations() {
  return (
    <section className="py-14">
      <div className="container-app">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              مقاصد محبوب
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              کجا بریم این فصل؟
            </h2>
          </div>
          <Link
            href="/tours"
            className="hidden items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 sm:flex"
          >
            همه مقاصد
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid auto-rows-[200px] grid-cols-2 gap-4 lg:grid-cols-4">
          {DESTINATIONS.map((dest) => (
            <DestinationCard key={dest.name} dest={dest} />
          ))}
        </div>
      </div>
    </section>
  );
}
