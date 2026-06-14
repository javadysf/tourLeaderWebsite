import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { ToursPageContent } from '@/components/tour/tours-page-content';

export const metadata: Metadata = {
  title: 'لیست تورها',
  description: 'مشاهده و جستجو در بین تورهای داخلی و خارجی',
};

export default function ToursPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-app py-8">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">تمام تورها</h1>
        <Suspense fallback={<div>در حال بارگذاری...</div>}>
          <ToursPageContent />
        </Suspense>
      </main>
    </div>
  );
}
