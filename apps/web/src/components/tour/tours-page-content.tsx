'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { TourCard } from './tour-card';
import { Button } from '@/components/ui/button';
import { useTours } from '@/hooks/use-tours';
import { formatNumber } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'departureDate:asc', label: 'نزدیک‌ترین تاریخ' },
  { value: 'basePrice:asc', label: 'ارزان‌ترین' },
  { value: 'basePrice:desc', label: 'گران‌ترین' },
  { value: 'createdAt:desc', label: 'جدیدترین' },
];

function TourCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white overflow-hidden">
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

export function ToursPageContent() {
  const searchParams = useSearchParams();
  const [sort, setSort] = useState('departureDate:asc');
  const [page, setPage] = useState(1);

  const [sortBy, sortOrder] = sort.split(':') as [string, 'asc' | 'desc'];

  const filters = {
    search: searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined,
    type: searchParams.get('type') || undefined,
    page,
    limit: 12,
    sortBy,
    sortOrder,
  };

  const { data, isLoading } = useTours(filters);
  const tours = data?.items || [];
  const meta = data ? { total: data.total, totalPages: data.totalPages } : undefined;

  return (
    <div className="flex gap-6">
      {/* Sidebar filters — placeholder */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="rounded-2xl border bg-white p-4">
          <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
            <SlidersHorizontal className="h-4 w-4" />
            فیلترها
          </div>
          <p className="text-sm text-gray-400">به زودی...</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        {/* Toolbar */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {meta ? `${formatNumber(meta.total)} تور یافت شد` : ''}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">مرتب‌سازی:</span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? Array.from({ length: 9 }).map((_, i) => <TourCardSkeleton key={i} />)
            : tours.length > 0
            ? tours.map((tour) => <TourCard key={tour.id} tour={tour} />)
            : (
              <div className="col-span-full flex flex-col items-center py-20 text-gray-400">
                <Filter className="h-12 w-12 mb-4 opacity-40" />
                <p className="text-lg font-medium">توری یافت نشد</p>
                <p className="text-sm">فیلترها را تغییر دهید</p>
              </div>
            )}
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              قبلی
            </Button>
            <span className="text-sm text-gray-500">
              صفحه {formatNumber(page)} از {formatNumber(meta.totalPages)}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              بعدی
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
