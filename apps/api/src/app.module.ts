import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ToursModule } from './modules/tours/tours.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { GuidesModule } from './modules/guides/guides.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { SettingsModule } from './modules/settings/settings.module';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import storageConfig from './config/storage.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, storageConfig],
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ToursModule,
    BookingsModule,
    PaymentsModule,
    WalletModule,
    ReviewsModule,
    GuidesModule,
    CouponsModule,
    NotificationsModule,
    TicketsModule,
    ReportsModule,
    UploadsModule,
    SettingsModule,
  ],
})
export class AppModule {}
