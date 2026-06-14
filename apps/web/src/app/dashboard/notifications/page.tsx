'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Bell, CheckCheck } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  type: string;
}

const TYPE_ICONS: Record<string, string> = {
  BOOKING: '📋',
  PAYMENT: '💳',
  SYSTEM: '⚙️',
  PROMOTION: '🎁',
};

export default function NotificationsPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, router]);

  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications'),
    enabled: isAuthenticated,
  });

  const { mutate: markRead } = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-app py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowRight className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">اعلان‌ها</h1>
          </div>

          {notifications && notifications.some((n) => !n.isRead) && (
            <button
              onClick={() => notifications.filter((n) => !n.isRead).forEach((n) => markRead(n.id))}
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <CheckCheck className="h-4 w-4" />
              خواندن همه
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        ) : !notifications || notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bell className="mb-4 h-12 w-12 text-gray-300" />
            <h3 className="font-semibold text-gray-700">اعلانی وجود ندارد</h3>
            <p className="mt-1 text-sm text-gray-400">وقتی اعلانی داشته باشید اینجا نمایش داده می‌شود</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => !notif.isRead && markRead(notif.id)}
                className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all hover:shadow-sm ${
                  notif.isRead ? 'bg-white' : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                  {TYPE_ICONS[notif.type] || '🔔'}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-medium ${notif.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notif.title}
                    </h3>
                    {!notif.isRead && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">{notif.body}</p>
                  <p className="mt-1 text-xs text-gray-400">{formatDate(notif.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
