import type { Tour, PaginatedResponse } from '@/types';

/**
 * دادهٔ نمونهٔ تورها برای حالت نمایشی (بدون نیاز به سرور بک‌اند).
 * تاریخ‌ها نسبت به «امروز» در آینده محاسبه می‌شوند تا شمارش معکوس و دکمهٔ رزرو فعال بماند.
 */

function futureDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(8, 0, 0, 0);
  return d.toISOString();
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const MOCK_TOURS: Tour[] = [
  {
    id: 'tour-istanbul',
    title: 'تور استانبول ۷ شب ۸ روز',
    slug: 'istanbul-7n-8d',
    shortDescription: 'گشت کامل استانبول؛ از مسجد ایاصوفیه و کاخ توپکاپی تا کروز بسفر و بازار بزرگ.',
    description:
      'استانبول، شهر دو قاره، ترکیبی بی‌نظیر از تاریخ و مدرنیته است. در این تور ۸ روزه از جاذبه‌های اصلی شهر شامل ایاصوفیه، مسجد سلطان احمد (مسجد آبی)، کاخ توپکاپی و بازار بزرگ بازدید می‌کنید و یک عصر فراموش‌نشدنی را با کروز روی تنگهٔ بسفر سپری می‌کنید. اقامت در هتل‌های مرکزی، صبحانهٔ بوفه و راهنمای فارسی‌زبان همراه شما خواهد بود.',
    coverImage: '/images/destinations/istanbul.jpg',
    status: 'PUBLISHED',
    type: 'INTERNATIONAL',
    category: 'CULTURAL',
    difficulty: 'EASY',
    departureDate: futureDate(25),
    returnDate: futureDate(32),
    durationDays: 8,
    durationNights: 7,
    originCity: 'تهران',
    destinationCity: 'استانبول',
    destinationCountry: 'ترکیه',
    maxCapacity: 30,
    currentCapacity: 12,
    basePrice: 45000000,
    pricePerChild: 32000000,
    priceSingleRoom: 58000000,
    currency: 'IRR',
    isInstallmentAvailable: true,
    installmentMonths: 6,
    cancellationPolicy: 'لغو رایگان تا ۱۰ روز پیش از حرکت.',
    requiredDocuments: 'گذرنامه با حداقل ۶ ماه اعتبار، کارت ملی.',
    climateInfo: 'هوای معتدل؛ روزها حدود ۲۲ تا ۲۸ درجه. لباس راحت و یک ژاکت سبک همراه داشته باشید.',
    minAge: 0,
    isFeatured: true,
    viewCount: 1840,
    itinerary: [
      { id: 'ist-d1', dayNumber: 1, title: 'ورود به استانبول', description: 'استقبال در فرودگاه، انتقال به هتل و استراحت. عصر گشت آزاد در میدان تقسیم.', accommodation: 'هتل ۴ ستاره مرکزی', meals: ['شام'] },
      { id: 'ist-d2', dayNumber: 2, title: 'شبه‌جزیرهٔ تاریخی', description: 'بازدید از ایاصوفیه، مسجد آبی و میدان سلطان احمد.', accommodation: 'هتل ۴ ستاره مرکزی', meals: ['صبحانه'] },
      { id: 'ist-d3', dayNumber: 3, title: 'کاخ توپکاپی و بازار بزرگ', description: 'گشت در کاخ توپکاپی و خرید در بازار بزرگ استانبول.', accommodation: 'هتل ۴ ستاره مرکزی', meals: ['صبحانه'] },
      { id: 'ist-d4', dayNumber: 4, title: 'کروز بسفر', description: 'گشت دریایی روی تنگهٔ بسفر و تماشای کاخ دلمه‌باغچه از روی آب.', accommodation: 'هتل ۴ ستاره مرکزی', meals: ['صبحانه', 'ناهار'] },
    ],
    services: [
      { id: 'ist-s1', serviceType: 'INCLUDED', title: 'بلیط رفت و برگشت هواپیما' },
      { id: 'ist-s2', serviceType: 'INCLUDED', title: 'اقامت ۷ شب با صبحانه' },
      { id: 'ist-s3', serviceType: 'INCLUDED', title: 'راهنمای فارسی‌زبان' },
      { id: 'ist-s4', serviceType: 'INCLUDED', title: 'گشت‌های شهری طبق برنامه' },
      { id: 'ist-s5', serviceType: 'EXCLUDED', title: 'هزینهٔ ناهار و شام (به‌جز موارد ذکرشده)' },
      { id: 'ist-s6', serviceType: 'EXCLUDED', title: 'بیمهٔ مسافرتی' },
    ],
    hotels: [
      { hotel: { id: 'h-ist', name: 'Grand Istanbul Hotel', stars: 4, city: 'استانبول', country: 'ترکیه', images: [], amenities: ['وای‌فای', 'صبحانه', 'استخر'] }, checkInDate: futureDate(25), checkOutDate: futureDate(32), nights: 7 },
    ],
    transportations: [
      { id: 'ist-t1', type: 'FLIGHT', company: 'ترکیش ایرلاینز', departureTime: futureDate(25), arrivalTime: futureDate(25), fromLocation: 'تهران (IKA)', toLocation: 'استانبول (IST)', class: 'ECONOMY' },
    ],
    reviews: [
      { id: 'ist-r1', rating: 5, title: 'فوق‌العاده بود', body: 'برنامه‌ریزی عالی و راهنمای حرفه‌ای. حتماً پیشنهاد می‌کنم.', createdAt: futureDate(-40), user: { firstName: 'سارا', lastName: 'محمدی' } },
      { id: 'ist-r2', rating: 4, title: 'سفر خوب', body: 'هتل تمیز و مرکزی بود. کروز بسفر بهترین قسمت سفر بود.', createdAt: futureDate(-60), user: { firstName: 'رضا', lastName: 'کریمی' } },
    ],
    _count: { reviews: 2, bookings: 18 },
  },
  {
    id: 'tour-mashhad',
    title: 'تور مشهد مقدس ۳ شب ۴ روز',
    slug: 'mashhad-3n-4d',
    shortDescription: 'زیارت حرم مطهر امام رضا (ع) با اقامت در هتل نزدیک حرم و پرواز رفت و برگشت.',
    description:
      'سفری معنوی به مشهد مقدس برای زیارت بارگاه ملکوتی امام رضا (ع). اقامت در هتلی نزدیک به حرم مطهر، پرواز رفت و برگشت و ترانسفر فرودگاهی در این پکیج لحاظ شده است تا با آرامش کامل اوقات خود را به زیارت و عبادت اختصاص دهید.',
    coverImage: '/images/destinations/mashhad.jpg',
    status: 'PUBLISHED',
    type: 'DOMESTIC',
    category: 'PILGRIMAGE',
    difficulty: 'EASY',
    departureDate: futureDate(12),
    returnDate: futureDate(15),
    durationDays: 4,
    durationNights: 3,
    originCity: 'تهران',
    destinationCity: 'مشهد',
    destinationCountry: 'ایران',
    maxCapacity: 45,
    currentCapacity: 28,
    basePrice: 12000000,
    pricePerChild: 8000000,
    priceSingleRoom: 16000000,
    currency: 'IRR',
    isInstallmentAvailable: false,
    cancellationPolicy: 'لغو رایگان تا ۵ روز پیش از حرکت.',
    requiredDocuments: 'کارت ملی یا شناسنامه.',
    climateInfo: 'هوای خشک و معتدل؛ همراه داشتن لباس راحت توصیه می‌شود.',
    isFeatured: true,
    viewCount: 2560,
    itinerary: [
      { id: 'msh-d1', dayNumber: 1, title: 'ورود و اولین زیارت', description: 'انتقال به هتل، اسکان و تشرف به حرم مطهر برای اولین زیارت.', accommodation: 'هتل ۴ ستاره نزدیک حرم', meals: ['شام'] },
      { id: 'msh-d2', dayNumber: 2, title: 'زیارت و گشت زیارتی', description: 'زیارت صبحگاهی و بازدید از موزه‌های آستان قدس رضوی.', accommodation: 'هتل ۴ ستاره نزدیک حرم', meals: ['صبحانه'] },
      { id: 'msh-d3', dayNumber: 3, title: 'وقت آزاد و خرید', description: 'وقت آزاد برای زیارت و خرید از بازارهای اطراف حرم.', accommodation: 'هتل ۴ ستاره نزدیک حرم', meals: ['صبحانه'] },
    ],
    services: [
      { id: 'msh-s1', serviceType: 'INCLUDED', title: 'بلیط رفت و برگشت هواپیما' },
      { id: 'msh-s2', serviceType: 'INCLUDED', title: 'اقامت ۳ شب با صبحانه' },
      { id: 'msh-s3', serviceType: 'INCLUDED', title: 'ترانسفر فرودگاهی' },
      { id: 'msh-s4', serviceType: 'EXCLUDED', title: 'هزینهٔ ناهار' },
    ],
    hotels: [
      { hotel: { id: 'h-msh', name: 'هتل رضوان', stars: 4, city: 'مشهد', country: 'ایران', images: [], amenities: ['وای‌فای', 'صبحانه', 'نزدیک حرم'] }, checkInDate: futureDate(12), checkOutDate: futureDate(15), nights: 3 },
    ],
    transportations: [
      { id: 'msh-t1', type: 'FLIGHT', company: 'ماهان ایر', departureTime: futureDate(12), arrivalTime: futureDate(12), fromLocation: 'تهران (THR)', toLocation: 'مشهد (MHD)', class: 'ECONOMY' },
    ],
    reviews: [
      { id: 'msh-r1', rating: 5, body: 'هتل واقعاً نزدیک حرم بود، خیلی راحت بودیم.', createdAt: futureDate(-30), user: { firstName: 'فاطمه', lastName: 'احمدی' } },
    ],
    _count: { reviews: 1, bookings: 42 },
  },
  {
    id: 'tour-kish',
    title: 'تور کیش ۴ شب ۵ روز',
    slug: 'kish-4n-5d',
    shortDescription: 'تفریح و خرید در جزیرهٔ کیش با اقامت در هتل ساحلی و پرواز رفت و برگشت.',
    description:
      'جزیرهٔ زیبای کیش با سواحل مرجانی، مراکز خرید مدرن و آب‌وهوای دلپذیر، مقصدی عالی برای تفریح و استراحت است. این پکیج شامل پرواز رفت و برگشت، اقامت در هتل ساحلی و ترانسفر است. فرصتی برای ورزش‌های آبی، گشت در بازارهای کیش و لذت بردن از غروب‌های بی‌نظیر جزیره.',
    coverImage: '/images/destinations/kish.jpg',
    status: 'PUBLISHED',
    type: 'DOMESTIC',
    category: 'RECREATIONAL',
    difficulty: 'EASY',
    departureDate: futureDate(18),
    returnDate: futureDate(22),
    durationDays: 5,
    durationNights: 4,
    originCity: 'تهران',
    destinationCity: 'کیش',
    destinationCountry: 'ایران',
    maxCapacity: 25,
    currentCapacity: 8,
    basePrice: 18000000,
    pricePerChild: 13000000,
    priceSingleRoom: 24000000,
    currency: 'IRR',
    isInstallmentAvailable: true,
    installmentMonths: 4,
    cancellationPolicy: 'لغو رایگان تا ۷ روز پیش از حرکت.',
    requiredDocuments: 'کارت ملی یا شناسنامه.',
    climateInfo: 'گرم و مرطوب؛ لباس خنک، کلاه و ضدآفتاب همراه داشته باشید.',
    isFeatured: true,
    viewCount: 1320,
    itinerary: [
      { id: 'kish-d1', dayNumber: 1, title: 'ورود به کیش', description: 'انتقال به هتل ساحلی، اسکان و وقت آزاد در ساحل.', accommodation: 'هتل ۵ ستاره ساحلی', meals: ['شام'] },
      { id: 'kish-d2', dayNumber: 2, title: 'ورزش‌های آبی', description: 'فرصت استفاده از تفریحات و ورزش‌های آبی جزیره.', accommodation: 'هتل ۵ ستاره ساحلی', meals: ['صبحانه'] },
      { id: 'kish-d3', dayNumber: 3, title: 'گشت و خرید', description: 'بازدید از کشتی یونانی، شهر زیرزمینی کاریز و مراکز خرید.', accommodation: 'هتل ۵ ستاره ساحلی', meals: ['صبحانه'] },
    ],
    services: [
      { id: 'kish-s1', serviceType: 'INCLUDED', title: 'بلیط رفت و برگشت هواپیما' },
      { id: 'kish-s2', serviceType: 'INCLUDED', title: 'اقامت ۴ شب با صبحانه' },
      { id: 'kish-s3', serviceType: 'INCLUDED', title: 'ترانسفر فرودگاهی' },
      { id: 'kish-s4', serviceType: 'EXCLUDED', title: 'هزینهٔ تفریحات آبی' },
    ],
    hotels: [
      { hotel: { id: 'h-kish', name: 'هتل ساحلی مارینا', stars: 5, city: 'کیش', country: 'ایران', images: [], amenities: ['ساحل اختصاصی', 'استخر', 'صبحانه'] }, checkInDate: futureDate(18), checkOutDate: futureDate(22), nights: 4 },
    ],
    transportations: [
      { id: 'kish-t1', type: 'FLIGHT', company: 'کیش ایر', departureTime: futureDate(18), arrivalTime: futureDate(18), fromLocation: 'تهران (THR)', toLocation: 'کیش (KIH)', class: 'ECONOMY' },
    ],
    reviews: [
      { id: 'kish-r1', rating: 4, body: 'هتل ساحلی عالی بود و دسترسی به ساحل راحت.', createdAt: futureDate(-50), user: { firstName: 'علی', lastName: 'نوری' } },
    ],
    _count: { reviews: 1, bookings: 16 },
  },
  {
    id: 'tour-antalya',
    title: 'تور آنتالیا ۶ شب ۷ روز',
    slug: 'antalya-6n-7d',
    shortDescription: 'اقامت لوکس همه‌چیز شامل (Ultra All Inclusive) در سواحل آنتالیا.',
    description:
      'آنتالیا، نگین گردشگری ترکیه روی سواحل مدیترانه، با هتل‌های لوکس و سواحل بی‌نظیرش شناخته می‌شود. این پکیج لوکس با خدمات Ultra All Inclusive، پرواز مستقیم و ترانسفر، تجربه‌ای کامل از استراحت و تفریح را برای شما رقم می‌زند. مناسب سفرهای خانوادگی و ماه‌عسل.',
    coverImage: '/images/destinations/antalya.jpg',
    status: 'PUBLISHED',
    type: 'INTERNATIONAL',
    category: 'LUXURY',
    difficulty: 'EASY',
    departureDate: futureDate(35),
    returnDate: futureDate(41),
    durationDays: 7,
    durationNights: 6,
    originCity: 'تهران',
    destinationCity: 'آنتالیا',
    destinationCountry: 'ترکیه',
    maxCapacity: 20,
    currentCapacity: 15,
    basePrice: 65000000,
    pricePerChild: 45000000,
    priceSingleRoom: 85000000,
    currency: 'IRR',
    isInstallmentAvailable: true,
    installmentMonths: 8,
    cancellationPolicy: 'لغو رایگان تا ۱۴ روز پیش از حرکت.',
    requiredDocuments: 'گذرنامه با حداقل ۶ ماه اعتبار.',
    climateInfo: 'مدیترانه‌ای و آفتابی؛ مناسب شنا و تفریحات ساحلی.',
    minAge: 0,
    isFeatured: true,
    viewCount: 980,
    itinerary: [
      { id: 'ant-d1', dayNumber: 1, title: 'ورود به آنتالیا', description: 'استقبال در فرودگاه و انتقال به هتل لوکس ساحلی.', accommodation: 'هتل ۵ ستاره Ultra All Inclusive', meals: ['صبحانه', 'ناهار', 'شام'] },
      { id: 'ant-d2', dayNumber: 2, title: 'استراحت در هتل', description: 'استفاده از امکانات هتل، استخر و ساحل اختصاصی.', accommodation: 'هتل ۵ ستاره Ultra All Inclusive', meals: ['صبحانه', 'ناهار', 'شام'] },
      { id: 'ant-d3', dayNumber: 3, title: 'گشت اختیاری شهر', description: 'امکان شرکت در تور اختیاری بازدید از آبشار دودان و شهر قدیمی کالیچی.', accommodation: 'هتل ۵ ستاره Ultra All Inclusive', meals: ['صبحانه', 'ناهار', 'شام'] },
    ],
    services: [
      { id: 'ant-s1', serviceType: 'INCLUDED', title: 'بلیط رفت و برگشت هواپیما' },
      { id: 'ant-s2', serviceType: 'INCLUDED', title: 'اقامت ۶ شب Ultra All Inclusive' },
      { id: 'ant-s3', serviceType: 'INCLUDED', title: 'ترانسفر فرودگاهی' },
      { id: 'ant-s4', serviceType: 'INCLUDED', title: 'راهنمای فارسی‌زبان' },
      { id: 'ant-s5', serviceType: 'EXCLUDED', title: 'تورهای اختیاری' },
      { id: 'ant-s6', serviceType: 'EXCLUDED', title: 'بیمهٔ مسافرتی' },
    ],
    hotels: [
      { hotel: { id: 'h-ant', name: 'Royal Antalya Resort', stars: 5, city: 'آنتالیا', country: 'ترکیه', images: [], amenities: ['Ultra All Inclusive', 'ساحل اختصاصی', 'اسپا', 'استخر'] }, checkInDate: futureDate(35), checkOutDate: futureDate(41), nights: 6 },
    ],
    transportations: [
      { id: 'ant-t1', type: 'FLIGHT', company: 'ترکیش ایرلاینز', departureTime: futureDate(35), arrivalTime: futureDate(35), fromLocation: 'تهران (IKA)', toLocation: 'آنتالیا (AYT)', class: 'ECONOMY' },
    ],
    reviews: [
      { id: 'ant-r1', rating: 5, title: 'بهترین تجربه', body: 'هتل و خدمات فوق‌العاده بود. ارزش هزینه را داشت.', createdAt: futureDate(-25), user: { firstName: 'مریم', lastName: 'حسینی' } },
    ],
    _count: { reviews: 1, bookings: 9 },
  },
];

/** تورهای ویژه برای صفحهٔ اصلی */
export function getMockFeatured(): Tour[] {
  return MOCK_TOURS.filter((t) => t.isFeatured);
}

/** فهرست تورها با پشتیبانی از جستجو، دسته‌بندی، نوع، مرتب‌سازی و صفحه‌بندی */
export function getMockTours(
  filters: Record<string, unknown> = {},
): PaginatedResponse<Tour> {
  let items = [...MOCK_TOURS];

  const search = (filters.search as string)?.trim();
  if (search) {
    items = items.filter(
      (t) =>
        t.title.includes(search) ||
        t.destinationCity.includes(search) ||
        t.destinationCountry.includes(search),
    );
  }

  const category = filters.category as string;
  if (category) items = items.filter((t) => t.category === category);

  const type = filters.type as string;
  if (type) items = items.filter((t) => t.type === type);

  const sortBy = (filters.sortBy as string) || 'departureDate';
  const sortOrder = (filters.sortOrder as string) || 'asc';
  items.sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'basePrice') cmp = a.basePrice - b.basePrice;
    else if (sortBy === 'createdAt') cmp = b.viewCount - a.viewCount;
    else cmp = new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
    return sortOrder === 'desc' ? -cmp : cmp;
  });

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 12;
  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  return { items: paged, total, page, totalPages: Math.ceil(total / limit) || 1 };
}

/** جزئیات یک تور بر اساس slug (یا id) */
export function getMockTourBySlug(slug: string): Tour | null {
  return MOCK_TOURS.find((t) => t.slug === slug || t.id === slug) || null;
}

/** تورهای مشابه (به‌جز خود تور) */
export function getMockSimilar(tourId: string): Tour[] {
  return MOCK_TOURS.filter((t) => t.id !== tourId && t.slug !== tourId).slice(0, 3);
}
