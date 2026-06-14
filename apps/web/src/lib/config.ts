/**
 * حالت نمایشی (Demo Mode)
 *
 * وقتی روشن است، فرانت‌اند به‌جای فراخوانی سرور بک‌اند، از دادهٔ نمونهٔ محلی
 * (mock-data) استفاده می‌کند تا سایت بدون نیاز به سرور پر نمایش داده شود.
 *
 * روشن می‌شود وقتی:
 *  - متغیر NEXT_PUBLIC_DEMO_MODE برابر 'true' باشد، یا
 *  - آدرس سرور (NEXT_PUBLIC_API_URL) تنظیم نشده باشد، یا
 *  - آدرس سرور روی localhost باشد.
 *
 * بعداً که بک‌اند روی یک آدرس عمومی منتشر شد، کافی است NEXT_PUBLIC_API_URL را
 * به آن آدرس تنظیم کنید تا حالت نمایشی خودکار خاموش شود.
 */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

export const DEMO_MODE =
  process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ||
  apiUrl.trim() === '' ||
  apiUrl.includes('localhost') ||
  apiUrl.includes('127.0.0.1');
