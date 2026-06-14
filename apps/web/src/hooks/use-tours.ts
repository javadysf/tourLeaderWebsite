import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DEMO_MODE } from '@/lib/config';
import {
  getMockFeatured,
  getMockTours,
  getMockTourBySlug,
  getMockSimilar,
} from '@/lib/mock-data';
import type { Tour, PaginatedResponse } from '@/types';

export function useTours(filters: Record<string, unknown> = {}) {
  return useQuery<PaginatedResponse<Tour>>({
    queryKey: ['tours', filters],
    queryFn: () =>
      DEMO_MODE
        ? Promise.resolve(getMockTours(filters))
        : api.get('/tours', { params: filters }),
  });
}

export function useTour(slug: string) {
  return useQuery<Tour>({
    queryKey: ['tour', slug],
    queryFn: () => {
      if (DEMO_MODE) {
        const tour = getMockTourBySlug(slug);
        if (!tour) throw new Error('تور یافت نشد');
        return Promise.resolve(tour);
      }
      return api.get(`/tours/${slug}`);
    },
    enabled: !!slug,
  });
}

export function useFeaturedTours() {
  return useQuery<Tour[]>({
    queryKey: ['tours', 'featured'],
    queryFn: () =>
      DEMO_MODE ? Promise.resolve(getMockFeatured()) : api.get('/tours/featured'),
  });
}

export function useSimilarTours(tourId: string) {
  return useQuery<Tour[]>({
    queryKey: ['tours', 'similar', tourId],
    queryFn: () =>
      DEMO_MODE
        ? Promise.resolve(getMockSimilar(tourId))
        : api.get(`/tours/${tourId}/similar`),
    enabled: !!tourId,
  });
}
