'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useRegister } from '@/hooks/use-auth';

const schema = z.object({
  firstName: z.string().min(2, 'نام حداقل ۲ کاراکتر باشد'),
  lastName: z.string().min(2, 'نام خانوادگی حداقل ۲ کاراکتر باشد'),
  email: z.string().email('ایمیل معتبر نیست').optional().or(z.literal('')),
  mobile: z.string().min(10, 'موبایل معتبر نیست').optional().or(z.literal('')),
  password: z.string().min(8, 'رمز عبور حداقل ۸ کاراکتر باشد'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'رمز عبور تطابق ندارد',
  path: ['confirmPassword'],
}).refine((d) => d.email || d.mobile, {
  message: 'ایمیل یا موبایل الزامی است',
  path: ['email'],
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { mutate, isPending } = useRegister();

  const onSubmit = (data: FormData) => {
    mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || undefined,
        mobile: data.mobile || undefined,
        password: data.password,
      },
      { onError: (e: any) => toast.error(e.message || 'خطا در ثبت‌نام') },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">نام</label>
          <input
            {...register('firstName')}
            placeholder="علی"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          />
          {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">نام خانوادگی</label>
          <input
            {...register('lastName')}
            placeholder="محمدی"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          />
          {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">موبایل</label>
        <input
          {...register('mobile')}
          type="tel"
          placeholder="09121234567"
          dir="ltr"
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        />
        {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">ایمیل</label>
        <input
          {...register('email')}
          type="email"
          placeholder="example@email.com"
          dir="ltr"
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">رمز عبور</label>
        <input
          {...register('password')}
          type="password"
          placeholder="حداقل ۸ کاراکتر"
          dir="ltr"
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        />
        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">تکرار رمز عبور</label>
        <input
          {...register('confirmPassword')}
          type="password"
          placeholder="••••••••"
          dir="ltr"
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        />
        {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" className="w-full" size="lg" loading={isPending}>
        ثبت‌نام
      </Button>
    </form>
  );
}
