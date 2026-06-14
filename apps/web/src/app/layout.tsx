import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | تورلیدر',
    default: 'تورلیدر — سفر را به بهترین شکل تجربه کن',
  },
  description: 'پلتفرم جامع رزرو و مدیریت تورهای مسافرتی داخلی و خارجی',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    locale: 'fa_IR',
    type: 'website',
    siteName: 'تورلیدر',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="bg-white text-gray-900 antialiased" style={{ fontFamily: 'var(--font-vazirmatn), system-ui, sans-serif' }}>
        <Providers>
          {children}
          <Toaster richColors position="top-center" dir="rtl" />
        </Providers>
      </body>
    </html>
  );
}
