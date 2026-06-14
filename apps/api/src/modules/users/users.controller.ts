import {
  Controller,
  Get,
  Put,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('کاربران')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'پروفایل کاربر جاری' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Put('profile')
  @Patch('profile')
  @ApiOperation({ summary: 'ویرایش پروفایل' })
  updateProfile(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.usersService.updateProfile(userId, body);
  }

  @Get('wallet')
  @ApiOperation({ summary: 'کیف پول' })
  getWallet(@CurrentUser('id') userId: string) {
    return this.usersService.getWallet(userId);
  }

  @Get('loyalty')
  @ApiOperation({ summary: 'امتیاز وفاداری' })
  getLoyalty(@CurrentUser('id') userId: string) {
    return this.usersService.getLoyalty(userId);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.AGENCY_ADMIN, Role.AGENCY_STAFF)
  @ApiOperation({ summary: 'لیست کاربران (ادمین)' })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('role') role?: Role,
  ) {
    return this.usersService.findAll(page, limit, search, role);
  }

  @Patch(':id/status')
  @Roles(Role.SUPER_ADMIN, Role.AGENCY_ADMIN)
  @ApiOperation({ summary: 'تغییر وضعیت کاربر (ادمین)' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.usersService.updateStatus(id, body.status);
  }
}
