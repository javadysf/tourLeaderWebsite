'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  CheckCircle,
  XCircle,
  Minus,
  Plane,
  BedDouble,
  FileText,
  CloudSun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate, getCapacityLabel, getDaysUntil } from '@/lib/utils';
import type { Tour } from '@/types';

const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: 'آسان',
  MEDIUM: 'متوسط',
  HARD: 'سخت',
  EXPERT: 'حرفه‌ای',
};

const TRANSPORT_LABELS: Record<string, string> = {
  FLIGHT: 'پرواز',
  TRAIN: 'قطار',
  BUS: 'اتوبوس',
  SHIP: 'کشتی',
  VAN: 'ون',
};

interface TourDetailProps {
  tour: Tour;
}

export function TourDetail({ tour }: TourDetailProps) {
  const remaining = tour.maxCapacity - tour.currentCapacity;
  const capacityInfo = getCapacityLabel(remaining);
  const daysUntil = getDaysUntil(tour.departureDate);
  const isFull = remaining === 0;
  const isPast = daysUntil < 0;

  const includedServices = tour.services?.filter((s) => s.serviceType === 'INCLUDED') || [];
  const excludedServices = tour.services?.filter((s) => s.serviceType === 'EXCLUDED') || [];

  const avgRating = tour.reviews?.length
    ? tour.reviews.reduce((sum, r) => sum + r.rating, 0) / tour.reviews.length
    : 0;

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      <div className="relative h-[400px] bg-gray-900">
        {tour.coverImage ? (
          <Image
            src={tour.coverImage}
            alt={tour.title}
            fill
            className="object-cover opacity-70"
            priority
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-blue-900 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container-app">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge>{tour.category}</Badge>
              <Badge variant="outline" className="text-white border-white">
                {DIFFICULTY_LABELS[tour.difficulty]}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{tour.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-200">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {tour.originCity} ← {tour.destinationCity}، {tour.destinationCountry}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(tour.departureDate)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {tour.durationNights} شب {tour.durationDays} روز
              </span>
              {avgRating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  {avgRating.toFixed(1)} ({tour._count?.reviews} نظر)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-app py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main content */}
          <div className="flex-1 space-y-8">
            {/* Description */}
            <section className="rounded-2xl border bg-white p-6">
              <h2 className="mb-4 text-lg font-bold text-gray-900">درباره این تور</h2>
              <p className="leading-relaxed text-gray-600">{tour.description}</p>
            </section>

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <section className="rounded-2xl border bg-white p-6">
                <h2 className="mb-6 text-lg font-bold text-gray-900">برنامه سفر روزانه</h2>
                <div className="space-y-4">
                  {tour.itinerary.map((day) => (
                    <div key={day.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                          {day.dayNumber}
                        </div>
                        <div className="mt-1 w-px flex-1 bg-gray-200" />
                      </div>
                      <div className="pb-4">
                        <h3 className="font-semibold text-gray-900">{day.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{day.description}</p>
                        {day.accommodation && (
                          <p className="mt-1 text-xs text-gray-400">
                            <BedDouble className="inline h-3 w-3 mr-1" />
                            اقامت: {day.accommodation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Services */}
            {(includedServices.length > 0 || excludedServices.length > 0) && (
              <section className="rounded-2xl border bg-white p-6">
                <h2 className="mb-6 text-lg font-bold text-gray-900">خدمات تور</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {includedServices.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-green-700">خدمات شامل</h3>
                      <ul className="space-y-2">
                        {includedServices.map((s) => (
                          <li key={s.id} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                            {s.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {excludedServices.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-red-700">خدمات غیرشامل</h3>
                      <ul className="space-y-2">
                        {excludedServices.map((s) => (
                          <li key={s.id} className="flex items-start gap-2 text-sm text-gray-600">
                            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                            {s.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Hotels */}
            {tour.hotels && tour.hotels.length > 0 && (
              <section className="rounded-2xl border bg-white p-6">
                <h2 className="mb-4 text-lg font-bold text-gray-900">اقامتگاه‌ها</h2>
                <div className="space-y-3">
                  {tour.hotels.map((th, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border p-4">
                      <BedDouble className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium text-gray-900">{th.hotel.name}</div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: th.hotel.stars }).map((_, j) => (
                            <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-xs text-gray-500 mr-1">
                            {th.nights} شب — {th.hotel.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Transportations */}
            {tour.transportations && tour.transportations.length > 0 && (
              <section className="rounded-2xl border bg-white p-6">
                <h2 className="mb-4 text-lg font-bold text-gray-900">حمل‌ونقل</h2>
                <div className="space-y-3">
                  {tour.transportations.map((t) => (
                    <div key={t.id} className="flex items-center gap-3 rounded-xl border p-4">
                      <Plane className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {TRANSPORT_LABELS[t.type]} — {t.fromLocation} به {t.toLocation}
                        </div>
                        {t.company && (
                          <div className="text-xs text-gray-500">{t.company}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Required Documents */}
            {tour.requiredDocuments && (
              <section className="rounded-2xl border bg-white p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <FileText className="h-5 w-5" />
                  مدارک موردنیاز
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">{tour.requiredDocuments}</p>
              </section>
            )}

            {/* Climate */}
            {tour.climateInfo && (
              <section className="rounded-2xl border bg-white p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <CloudSun className="h-5 w-5" />
                  آب و هوا
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">{tour.climateInfo}</p>
              </section>
            )}
          </div>

          {/* Booking Card — Sticky */}
          <aside className="lg:w-80 xl:w-96">
            <div className="sticky top-24 rounded-2xl border bg-white p-6 shadow-lg">
              {/* Price */}
              <div className="mb-4">
                <div className="text-xs text-gray-400">قیمت هر نفر از</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(tour.basePrice, tour.currency)}
                </div>
                {tour.priceSingleRoom && (
                  <div className="text-sm text-gray-500">
                    اتاق تک‌نفره: {formatPrice(tour.priceSingleRoom, tour.currency)}
                  </div>
                )}
                {tour.isInstallmentAvailable && tour.installmentMonths && (
                  <div className="mt-1 text-xs text-blue-600">
                    امکان پرداخت {tour.installmentMonths} قسطه
                  </div>
                )}
              </div>

              {/* Capacity */}
              <div className={`mb-4 text-sm font-medium ${capacityInfo.color}`}>
                <Users className="inline h-4 w-4 mr-1" />
                {capacityInfo.label}
              </div>

              {/* Countdown */}
              {daysUntil > 0 && (
                <div className="mb-4 rounded-xl bg-blue-50 p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">{daysUntil}</div>
                  <div className="text-xs text-blue-500">روز تا حرکت</div>
                </div>
              )}

              {/* CTA */}
              {isFull ? (
                <Button className="w-full" disabled>
                  تکمیل ظرفیت
                </Button>
              ) : isPast ? (
                <Button className="w-full" disabled>
                  این تور به پایان رسیده
                </Button>
              ) : (
                <Link href={`/booking/${tour.id}/passengers`}>
                  <Button className="w-full" size="lg">
                    رزرو کن
                  </Button>
                </Link>
              )}

              {/* Cancellation */}
              {tour.cancellationPolicy && (
                <p className="mt-3 text-xs text-gray-400 text-center">
                  {tour.cancellationPolicy}
                </p>
              )}

              {/* Age */}
              {(tour.minAge || tour.maxAge) && (
                <div className="mt-3 text-xs text-gray-400 text-center">
                  {tour.minAge && `حداقل سن: ${tour.minAge} سال`}
                  {tour.minAge && tour.maxAge && ' | '}
                  {tour.maxAge && `حداکثر سن: ${tour.maxAge} سال`}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
