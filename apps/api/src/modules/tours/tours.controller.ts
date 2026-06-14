import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role, TourStatus } from '@prisma/client';
import { ToursService } from './tours.service';
import { CreateTourDto, UpdateTourDto, TourFilterDto } from './dto/tour.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('تورها')
@Controller('tours')
export class ToursController {
  constructor(private toursService: ToursService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'لیست تورها با فیلتر و جستجو' })
  findAll(@Query() filters: TourFilterDto) {
    return this.toursService.findAll(filters);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'تورهای ویژه' })
  findFeatured() {
    return this.toursService.findFeatured();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'جزئیات تور' })
  findOne(@Param('slug') slug: string) {
    return this.toursService.findOne(slug);
  }

  @Public()
  @Get(':id/similar')
  @ApiOperation({ summary: 'تورهای مشابه' })
  getSimilar(@Param('id') id: string) {
    return this.toursService.getSimilar(id);
  }

  @ApiBearerAuth()
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.AGENCY_ADMIN, Role.CONTENT_MANAGER)
  @ApiOperation({ summary: 'ایجاد تور جدید' })
  create(@Body() dto: CreateTourDto) {
    return this.toursService.create(dto);
  }

  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.AGENCY_ADMIN, Role.CONTENT_MANAGER, Role.AGENCY_STAFF)
  @ApiOperation({ summary: 'ویرایش تور' })
  update(@Param('id') id: string, @Body() dto: UpdateTourDto) {
    return this.toursService.update(id, dto);
  }

  @ApiBearerAuth()
  @Patch(':id/status')
  @Roles(Role.SUPER_ADMIN, Role.AGENCY_ADMIN)
  @ApiOperation({ summary: 'تغییر وضعیت تور' })
  updateStatus(@Param('id') id: string, @Body('status') status: TourStatus) {
    return this.toursService.updateStatus(id, status);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.AGENCY_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف تور' })
  delete(@Param('id') id: string) {
    return this.toursService.softDelete(id);
  }
}
