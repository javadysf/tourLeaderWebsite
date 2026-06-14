'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLogin, useSendOtp, useVerifyOtp } from '@/hooks/use-auth';

const loginSchema = z.object({
  mobile: z.string().min(10, 'شماره موبایل معتبر نیست').optional(),
  email: z.string().email('ایمیل معتبر نیست').optional(),
  password: z.string().min(8, 'رمز عبور حداقل ۸ کاراکتر باشد').optional(),
  otp: z.string().length(5, 'کد ۵ رقمی است').optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

type LoginMode = 'password' | 'otp';
type OtpStep = 'send' | 'verify';

export function LoginForm() {
  const [mode, setMode] = useState<LoginMode>('password');
  const [otpStep, setOtpStep] = useState<OtpStep>('send');
  const [sentMobile, setSentMobile] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending: loginPending } = useLogin();
  const { mutate: sendOtp, isPending: sendPending } = useSendOtp();
  const { mutate: verifyOtp, isPending: verifyPending } = useVerifyOtp();

  const onSubmit = (data: LoginFormData) => {
    if (mode === 'password') {
      if (!data.password) return;
      login(
        { mobile: data.mobile, email: data.email, password: data.password },
        { onError: (e: any) => toast.error(e.message || 'خطا در ورود') },
      );
    } else if (otpStep === 'send') {
      if (!data.mobile) return;
      sendOtp(data.mobile, {
        onSuccess: () => {
          setSentMobile(data.mobile!);
          setOtpStep('verify');
          toast.success('کد تأیید ارسال شد');
        },
        onError: (e: any) => toast.error(e.message || 'خطا در ارسال کد'),
      });
    } else {
      if (!data.otp) return;
      verifyOtp(
        { mobile: sentMobile, otp: data.otp },
        { onError: (e: any) => toast.error(e.message || 'کد اشتباه است') },
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Mode switcher */}
      <div className="flex rounded-xl border overflow-hidden">
        <button
          type="button"
          onClick={() => setMode('password')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            mode === 'password' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          رمز عبور
        </button>
        <button
          type="button"
          onClick={() => { setMode('otp'); setOtpStep('send'); }}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            mode === 'otp' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          کد OTP
        </button>
      </div>

      {mode === 'password' ? (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              ایمیل یا موبایل
            </label>
            <input
              {...register('email')}
              type="text"
              placeholder="example@email.com یا 09121234567"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">رمز عبور</label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              dir="ltr"
            />
          </div>
          <div className="text-left">
            <a href="/auth/forgot-password" className="text-xs text-blue-600 hover:underline">
              فراموشی رمز عبور؟
            </a>
          </div>
        </>
      ) : otpStep === 'send' ? (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">شماره موبایل</label>
          <input
            {...register('mobile')}
            type="tel"
            placeholder="09121234567"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            dir="ltr"
          />
        </div>
      ) : (
        <div>
          <p className="mb-3 text-sm text-gray-500">
            کد ۵ رقمی ارسال‌شده به <strong>{sentMobile}</strong> را وارد کنید
          </p>
          <input
            {...register('otp')}
            type="text"
            maxLength={5}
            placeholder="_ _ _ _ _"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-center text-xl tracking-widest focus:border-blue-500 focus:outline-none"
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setOtpStep('send')}
            className="mt-2 text-xs text-gray-400 hover:text-gray-600"
          >
            تغییر شماره
          </button>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        loading={loginPending || sendPending || verifyPending}
      >
        {mode === 'password'
          ? 'ورود'
          : otpStep === 'send'
          ? 'ارسال کد'
          : 'تأیید و ورود'}
      </Button>
    </form>
  );
}
