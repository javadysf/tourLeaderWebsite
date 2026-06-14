import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Clock, Users, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDateShort, getCapacityLabel } from '@/lib/utils';
import type { Tour } from '@/types';

const CATEGORY_LABELS: Record<string, string> = {
  DOMESTIC: 'داخلی',
  INTERNATIONAL: 'خارجی',
  ADVENTURE: 'ماجراجویی',
  NATURE: 'طبیعت‌گردی',
  CULTURAL: 'فرهنگی',
  PILGRIMAGE: 'زیارتی',
  LUXURY: 'لوکس',
  FAMILY: 'خانوادگی',
  EDUCATIONAL: 'آموزشی',
  RECREATIONAL: 'تفریحی',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: 'آسان',
  MEDIUM: 'متوسط',
  HARD: 'سخت',
  EXPERT: 'حرفه‌ای',
};

interface TourCardProps {
  tour: Tour;
  compact?: boolean;
}

export function TourCard({ tour, compact = false }: TourCardProps) {
  const remaining = tour.maxCapacity - tour.currentCapacity;
  const capacityInfo = getCapacityLabel(remaining);
  const isFull = remaining === 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {tour.coverImage ? (
          <Image
            src={tour.coverImage}
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <MapPin className="h-12 w-12 text-blue-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute right-3 top-3 flex flex-col gap-1">
          <Badge variant="default" className="text-xs">
            {CATEGORY_LABELS[tour.category] || tour.category}
          </Badge>
          {tour.isFeatured && (
            <Badge variant="warning" className="text-xs">
              ویژه
            </Badge>
          )}
        </div>

        {isFull && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white">
              تکمیل ظرفیت
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Destination */}
        <div className="mb-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span>
            {tour.destinationCity}، {tour.destinationCountry}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-3 line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-emerald-600">
          <Link href={`/tours/${tour.slug}`}>{tour.title}</Link>
        </h3>

        {/* Info Row */}
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDateShort(tour.departureDate)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {tour.durationNights} شب {tour.durationDays} روز
          </span>
          <span className={`flex items-center gap-1 font-medium ${capacityInfo.color}`}>
            <Users className="h-3.5 w-3.5" />
            {capacityInfo.label}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-400">قیمت از</div>
            <div className="text-base font-bold text-gray-900">
              {formatPrice(tour.basePrice, tour.currency)}
            </div>
            {tour.isInstallmentAvailable && (
              <div className="text-xs text-emerald-600">پرداخت اقساطی</div>
            )}
          </div>
          {isFull ? (
            <Button size="sm" disabled>تکمیل ظرفیت</Button>
          ) : (
            <Link href={`/tours/${tour.slug}`}>
              <Button size="sm">رزرو کن</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
