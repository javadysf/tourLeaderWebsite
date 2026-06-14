'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowRight, User, Mail, Phone, IdCard } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';

const schema = z.object({
  firstName: z.string().min(2, 'نام حداقل ۲ کاراکتر'),
  lastName: z.string().min(2, 'نام خانوادگی حداقل ۲ کاراکتر'),
  email: z.string().email('ایمیل نامعتبر').optional().or(z.literal('')),
  mobile: z.string().optional(),
  nationalId: z.string().length(10, 'کد ملی باید ۱۰ رقم باشد').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { isAuthenticated, user, updateUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, router]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      nationalId: user?.nationalId || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || '',
        mobile: user.mobile || '',
        nationalId: user.nationalId || '',
      });
    }
  }, [user, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => api.patch('/users/profile', data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser as any);
      toast.success('پروفایل با موفقیت بروزرسانی شد');
    },
    onError: () => toast.error('خطا در بروزرسانی پروفایل'),
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-app py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
            <ArrowRight className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">پروفایل من</h1>
        </div>

        <div className="mx-auto max-w-2xl">
          {/* Avatar */}
          <div className="mb-6 flex items-center gap-4 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
              {user.firstName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-gray-400">{user.email || user.mobile}</p>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="mb-6 font-semibold text-gray-900">ویرایش اطلاعات</h3>

            <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">نام</label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      {...register('firstName')}
                      className="w-full rounded-xl border border-gray-300 py-2.5 pr-10 pl-4 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">نام خانوادگی</label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      {...register('lastName')}
                      className="w-full rounded-xl border border-gray-300 py-2.5 pr-10 pl-4 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">ایمیل</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    {...register('email')}
                    type="email"
                    dir="ltr"
                    className="w-full rounded-xl border border-gray-300 py-2.5 pr-10 pl-4 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">موبایل</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    {...register('mobile')}
                    type="tel"
                    dir="ltr"
                    disabled
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-10 pl-4 text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">شماره موبایل قابل تغییر نیست</p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">کد ملی</label>
                <div className="relative">
                  <IdCard className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    {...register('nationalId')}
                    dir="ltr"
                    maxLength={10}
                    placeholder="۱۰ رقم"
                    className="w-full rounded-xl border border-gray-300 py-2.5 pr-10 pl-4 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                {errors.nationalId && (
                  <p className="mt-1 text-xs text-red-500">{errors.nationalId.message}</p>
                )}
              </div>

              <Button type="submit" loading={isPending} className="w-full" size="lg">
                ذخیره تغییرات
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
