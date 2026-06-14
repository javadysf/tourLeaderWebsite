import { PrismaClient, TourStatus, TourType, TourCategory, TourDifficulty, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const adminHash = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tourleader.ir' },
    update: {},
    create: {
      email: 'admin@tourleader.ir',
      firstName: 'مدیر',
      lastName: 'سیستم',
      passwordHash: adminHash,
      role: Role.SUPER_ADMIN,
      emailVerifiedAt: new Date(),
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Test customer
  const customerHash = await bcrypt.hash('Customer@123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      mobile: '09121234567',
      firstName: 'علی',
      lastName: 'محمدی',
      passwordHash: customerHash,
      role: Role.CUSTOMER,
      walletBalance: 5000000,
      loyaltyPoints: 250,
    },
  });
  console.log('✅ Customer user created:', customer.email);

  // Sample tours
  const tours = [
    {
      title: 'تور استانبول ۷ شب ۸ روز',
      slug: 'istanbul-7n-8d',
      description: 'سفری ماندگار به شهر زیبای استانبول، ترکیه. بازدید از آیاصوفیه، بازار کاپالی چارشی، کروز بسفر و بسیاری از جاذبه‌های دیدنی دیگر.',
      shortDescription: 'سفر به قلب تاریخ و فرهنگ ترکیه',
      type: TourType.INTERNATIONAL,
      category: TourCategory.CULTURAL,
      difficulty: TourDifficulty.EASY,
      departureDate: new Date('2025-08-15'),
      returnDate: new Date('2025-08-22'),
      durationDays: 8,
      durationNights: 7,
      originCity: 'تهران',
      destinationCity: 'استانبول',
      destinationCountry: 'ترکیه',
      maxCapacity: 30,
      currentCapacity: 12,
      basePrice: 45000000,
      pricePerChild: 35000000,
      priceSingleRoom: 55000000,
      currency: 'IRR',
      isInstallmentAvailable: true,
      installmentMonths: 3,
      status: TourStatus.PUBLISHED,
      isFeatured: true,
      climateInfo: 'هوای استانبول در تابستان گرم و مرطوب است. دمای هوا بین ۲۵ تا ۳۵ درجه سانتیگراد.',
      requiredDocuments: 'پاسپورت با حداقل ۶ ماه اعتبار، بیمه مسافرتی',
      cancellationPolicy: 'لغو بیش از ۱۴ روز: استرداد کامل. ۷ تا ۱۴ روز: ۷۰٪. کمتر از ۷ روز: ۵۰٪',
    },
    {
      title: 'تور مشهد مقدس ۳ شب ۴ روز',
      slug: 'mashhad-3n-4d',
      description: 'زیارت مرقد مطهر امام رضا (ع) و بازدید از جاذبه‌های دیدنی مشهد مقدس.',
      shortDescription: 'سفری معنوی به شهر مقدس مشهد',
      type: TourType.DOMESTIC,
      category: TourCategory.PILGRIMAGE,
      difficulty: TourDifficulty.EASY,
      departureDate: new Date('2025-07-20'),
      returnDate: new Date('2025-07-23'),
      durationDays: 4,
      durationNights: 3,
      originCity: 'تهران',
      destinationCity: 'مشهد',
      destinationCountry: 'ایران',
      maxCapacity: 45,
      currentCapacity: 28,
      basePrice: 12000000,
      currency: 'IRR',
      isInstallmentAvailable: false,
      status: TourStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      title: 'تور کیش ۴ شب ۵ روز',
      slug: 'kish-4n-5d',
      description: 'تعطیلاتی رویایی در جزیره زیبای کیش با آب‌های فیروزه‌ای و آفتاب طلایی.',
      shortDescription: 'استراحت در بهشت خلیج فارس',
      type: TourType.DOMESTIC,
      category: TourCategory.RECREATIONAL,
      difficulty: TourDifficulty.EASY,
      departureDate: new Date('2025-09-05'),
      returnDate: new Date('2025-09-09'),
      durationDays: 5,
      durationNights: 4,
      originCity: 'تهران',
      destinationCity: 'کیش',
      destinationCountry: 'ایران',
      maxCapacity: 25,
      currentCapacity: 8,
      basePrice: 18000000,
      currency: 'IRR',
      isInstallmentAvailable: true,
      installmentMonths: 2,
      status: TourStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      title: 'تور آنتالیا ۶ شب ۷ روز',
      slug: 'antalya-6n-7d',
      description: 'لذت ساحل، دریا و آفتاب در زیباترین ریزورت‌های ترکیه.',
      shortDescription: 'بهشت ساحلی مدیترانه',
      type: TourType.INTERNATIONAL,
      category: TourCategory.LUXURY,
      difficulty: TourDifficulty.EASY,
      departureDate: new Date('2025-08-01'),
      returnDate: new Date('2025-08-07'),
      durationDays: 7,
      durationNights: 6,
      originCity: 'تهران',
      destinationCity: 'آنتالیا',
      destinationCountry: 'ترکیه',
      maxCapacity: 20,
      currentCapacity: 15,
      basePrice: 65000000,
      priceSingleRoom: 80000000,
      currency: 'IRR',
      isInstallmentAvailable: true,
      installmentMonths: 4,
      status: TourStatus.PUBLISHED,
      isFeatured: true,
    },
  ];

  for (const tourData of tours) {
    const tour = await prisma.tour.upsert({
      where: { slug: tourData.slug },
      update: {},
      create: {
        ...tourData,
        itinerary: {
          create: [
            {
              dayNumber: 1,
              title: 'روز اول — ورود و اقامت',
              description: 'ورود به مقصد، چک‌این هتل و استراحت.',
              meals: ['dinner'],
            },
            {
              dayNumber: 2,
              title: 'روز دوم — بازدید جاذبه‌ها',
              description: 'بازدید از مراکز دیدنی و تاریخی شهر.',
              meals: ['breakfast', 'lunch', 'dinner'],
            },
          ],
        },
        services: {
          create: [
            { serviceType: 'INCLUDED', title: 'بلیط رفت و برگشت' },
            { serviceType: 'INCLUDED', title: 'اقامت در هتل ۴ ستاره' },
            { serviceType: 'INCLUDED', title: 'صبحانه هتل' },
            { serviceType: 'INCLUDED', title: 'راهنمای فارسی‌زبان' },
            { serviceType: 'EXCLUDED', title: 'ویزا' },
            { serviceType: 'EXCLUDED', title: 'بیمه مسافرتی' },
          ],
        },
      },
    });
    console.log('✅ Tour seeded:', tour.title);
  }

  // Sample coupon
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      type: 'PERCENT',
      value: 10,
      maxDiscount: 5000000,
      minOrderAmount: 10000000,
      usageLimit: 100,
      userLimitPerCode: 1,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  });
  console.log('✅ Coupon WELCOME10 created');

  // Settings
  const settings = [
    { key: 'site_name', value: 'تورلیدر', group: 'general' },
    { key: 'site_phone', value: '021-12345678', group: 'contact' },
    { key: 'cancellation_policy_days', value: '14,7,3', group: 'booking' },
    { key: 'loyalty_points_per_booking', value: '100', group: 'loyalty' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('✅ Settings seeded');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
