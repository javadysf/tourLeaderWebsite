import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ReportsService } from './reports.service';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('گزارشات')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN, Role.AGENCY_ADMIN, Role.ACCOUNTANT)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'داشبورد آماری' })
  getDashboard() {
    return this.reportsService.getDashboard();
  }

  @Get('sales')
  @ApiOperation({ summary: 'گزارش فروش' })
  getSales(@Query('from') from: string, @Query('to') to: string) {
    return this.reportsService.getSalesReport(new Date(from), new Date(to));
  }
}
