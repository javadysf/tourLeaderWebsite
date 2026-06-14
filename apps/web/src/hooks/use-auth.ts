import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

interface LoginPayload {
  email?: string;
  mobile?: string;
  password: string;
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email?: string;
  mobile?: string;
  password: string;
}

interface OtpPayload {
  mobile: string;
  otp: string;
}

interface AuthResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
}

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginPayload) => api.post<never, AuthResponse>('/auth/login', payload),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push('/dashboard');
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      api.post<never, AuthResponse>('/auth/register', payload),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push('/dashboard');
    },
  });
}

export function useSendOtp() {
  return useMutation({
    mutationFn: (mobile: string) => api.post('/auth/send-otp', { mobile }),
  });
}

export function useVerifyOtp() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: OtpPayload) =>
      api.post<never, AuthResponse>('/auth/verify-otp', payload),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push('/dashboard');
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      logout();
      router.push('/');
    },
    onError: () => {
      logout();
      router.push('/');
    },
  });
}
