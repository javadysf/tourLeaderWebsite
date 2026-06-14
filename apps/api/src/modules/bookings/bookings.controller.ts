import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role, BookingStatus } from '@prisma/client';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdatePassengersDto, CancelBookingDto } from './dto/booking.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('رزروها')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'ایجاد رزرو جدید' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(userId, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'رزروهای من' })
  myBookings(
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.bookingsService.findUserBookings(userId, page, limit);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.AGENCY_ADMIN, Role.AGENCY_STAFF, Role.ACCOUNTANT)
  @ApiOperation({ summary: 'لیست تمام رزروها (ادمین)' })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: BookingStatus,
    @Query('search') search?: string,
  ) {
    return this.bookingsService.findAll(page, limit, status, search);
  }

  @Get(':code')
  @ApiOperation({ summary: 'جزئیات رزرو' })
  findOne(
    @Param('code') code: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.bookingsService.findByCode(code, userId, userRole);
  }

  @Put(':code/passengers')
  @ApiOperation({ summary: 'ثبت/ویرایش اطلاعات مسافران' })
  updatePassengers(
    @Param('code') code: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdatePassengersDto,
  ) {
    return this.bookingsService.updatePassengers(code, userId, dto);
  }

  @Post(':code/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'لغو رزرو' })
  cancel(
    @Param('code') code: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancel(code, userId, userRole, dto);
  }
}
