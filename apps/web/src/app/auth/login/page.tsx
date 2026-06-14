import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = { title: 'ورود به حساب کاربری' };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-xl">
            T
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ورود به تورلیدر</h1>
          <p className="mt-1 text-sm text-gray-500">با حساب کاربری خود وارد شوید</p>
        </div>
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <LoginForm />
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          حساب کاربری ندارید؟{' '}
          <a href="/auth/register" className="font-medium text-blue-600 hover:underline">
            ثبت‌نام کنید
          </a>
        </p>
      </div>
    </div>
  );
}
