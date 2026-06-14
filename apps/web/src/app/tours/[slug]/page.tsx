import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { TourDetail } from '@/components/tour/tour-detail';
import { DEMO_MODE } from '@/lib/config';
import { getMockTourBySlug } from '@/lib/mock-data';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function getTour(slug: string) {
  // در حالت نمایشی از دادهٔ نمونهٔ محلی استفاده می‌کنیم (بدون نیاز به سرور)
  if (DEMO_MODE) {
    return getMockTourBySlug(slug);
  }
  try {
    const res = await fetch(`${API_URL}/tours/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) return { title: 'تور یافت نشد' };
  return {
    title: tour.title,
    description: tour.shortDescription || tour.description?.slice(0, 160),
    openGraph: {
      title: tour.title,
      description: tour.shortDescription,
      images: tour.coverImage ? [{ url: tour.coverImage }] : [],
    },
  };
}

export default async function TourPage({ params }: Props) {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <TourDetail tour={tour} />
      </main>
    </div>
  );
}
