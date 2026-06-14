'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Wallet, ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';

const TX_TYPE_LABELS: Record<string, { label: string; icon: typeof ArrowUpRight; color: string }> = {
  CREDIT: { label: 'واریز', icon: ArrowDownLeft, color: 'text-green-600' },
  DEBIT: { label: 'برداشت', icon: ArrowUpRight, color: 'text-red-500' },
  REFUND: { label: 'استرداد', icon: ArrowDownLeft, color: 'text-blue-500' },
  CASHBACK: { label: 'کشبک', icon: ArrowDownLeft, color: 'text-purple-500' },
};

interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description?: string;
  createdAt: string;
}

export default function WalletPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, router]);

  const { data: transactions, isLoading } = useQuery<WalletTransaction[]>({
    queryKey: ['wallet-transactions'],
    queryFn: () => api.get('/wallet/transactions'),
    enabled: isAuthenticated,
  });

  const balance = user?.walletBalance || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-app py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
            <ArrowRight className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">کیف پول</h1>
        </div>

        {/* Balance Card */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-1 text-sm text-blue-200">موجودی فعلی</p>
              <p className="text-4xl font-bold">{formatPrice(Number(balance))}</p>
              <p className="mt-1 text-sm text-blue-200">تومان</p>
            </div>
            <div className="rounded-xl bg-white/20 p-3">
              <Wallet className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              disabled
              className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              شارژ کیف پول
            </button>
          </div>
        </div>

        {/* Transactions */}
        <div className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-gray-900">تاریخچه تراکنش‌ها</h2>
          </div>

          {isLoading ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : !transactions || transactions.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <Wallet className="mx-auto mb-3 h-10 w-10 opacity-40" />
              <p>هنوز تراکنشی ثبت نشده</p>
            </div>
          ) : (
            <div className="divide-y">
              {transactions.map((tx) => {
                const meta = TX_TYPE_LABELS[tx.type] || {
                  label: tx.type,
                  icon: ArrowDownLeft,
                  color: 'text-gray-500',
                };
                const IconComp = meta.icon;
                const isIncoming = tx.type === 'CREDIT' || tx.type === 'REFUND' || tx.type === 'CASHBACK';

                return (
                  <div key={tx.id} className="flex items-center gap-4 px-6 py-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100`}>
                      <IconComp className={`h-5 w-5 ${meta.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{meta.label}</p>
                      {tx.description && (
                        <p className="text-xs text-gray-400">{tx.description}</p>
                      )}
                      <p className="text-xs text-gray-400">{formatDate(tx.createdAt)}</p>
                    </div>
                    <div className="text-left">
                      <p className={`font-bold ${isIncoming ? 'text-green-600' : 'text-red-500'}`}>
                        {isIncoming ? '+' : '-'}{formatPrice(tx.amount)}
                      </p>
                      <p className="text-xs text-gray-400">مانده: {formatPrice(tx.balanceAfter)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
