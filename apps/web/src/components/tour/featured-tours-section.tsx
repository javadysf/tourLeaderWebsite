'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TourCard } from './tour-card';
import { useFeaturedTours } from '@/hooks/use-tours';

function TourCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 overflow-hidden">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="h-5 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedToursSection() {
  const { data: tours, isLoading } = useFeaturedTours();

  return (
    <section className="py-14">
      <div className="container-app">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="mb-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
              پیشنهاد ویژه
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              تورهای ویژه این هفته
            </h2>
          </div>
          <Link
            href="/tours?featured=true"
            className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            مشاهده همه
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <TourCardSkeleton key={i} />)
            : tours?.slice(0, 4).map((tour) => <TourCard key={tour.id} tour={tour} />)}
        </div>
      </div>
    </section>
  );
}
