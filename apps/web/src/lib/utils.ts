import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | string, currency = 'IRR'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (currency === 'IRR') {
    return new Intl.NumberFormat('fa-IR').format(num / 10) + ' تومان';
  }
  return new Intl.NumberFormat('fa-IR', { style: 'currency', currency }).format(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fa-IR');
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fa-IR').format(num);
}

export function getDaysUntil(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function getRemainingCapacity(max: number, current: number) {
  return max - current;
}

export function getCapacityLabel(remaining: number): {
  label: string;
  color: string;
} {
  if (remaining === 0) return { label: 'تکمیل ظرفیت', color: 'text-red-600' };
  if (remaining <= 3) return { label: `${remaining} جای خالی`, color: 'text-orange-600' };
  if (remaining <= 10) return { label: `${remaining} جای خالی`, color: 'text-yellow-600' };
  return { label: `${remaining} جای خالی`, color: 'text-green-600' };
}
