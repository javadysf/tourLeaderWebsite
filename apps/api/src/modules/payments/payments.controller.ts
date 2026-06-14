import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('پرداخت‌ها')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('initiate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'شروع فرایند پرداخت' })
  initiate(
    @CurrentUser('id') userId: string,
    @Body() body: { bookingId: string; gateway: string },
  ) {
    return this.paymentsService.initiatePayment(userId, body.bookingId, body.gateway);
  }

  @Post('wallet')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'پرداخت با کیف پول' })
  payWithWallet(
    @CurrentUser('id') userId: string,
    @Body() body: { bookingId: string },
  ) {
    return this.paymentsService.payWithWallet(userId, body.bookingId);
  }

  @Get('callback')
  @Public()
  @ApiOperation({ summary: 'بازگشت از درگاه پرداخت' })
  callback(
    @Query('payment_id') paymentId: string,
    @Query('status') status: string,
  ) {
    return this.paymentsService.processCallback(paymentId, status);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.AGENCY_ADMIN, Role.ACCOUNTANT)
  @ApiOperation({ summary: 'لیست پرداخت‌ها (ادمین)' })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
  ) {
    return this.paymentsService.findAll(page, limit, status);
  }
}
