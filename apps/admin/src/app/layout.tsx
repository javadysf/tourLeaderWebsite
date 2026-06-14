import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import { AdminProviders } from './providers';
import { Toaster } from 'sonner';

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: { template: '%s | پنل مدیریت تورلیدر', default: 'پنل مدیریت تورلیدر' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="bg-gray-100" style={{ fontFamily: 'var(--font-vazirmatn), system-ui, sans-serif' }}>
        <AdminProviders>
          {children}
          <Toaster richColors position="top-center" dir="rtl" />
        </AdminProviders>
      </body>
    </html>
  );
}
