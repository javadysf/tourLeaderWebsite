import {
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  TourStatus,
  TourType,
  TourCategory,
  TourDifficulty,
  ServiceType,
  GuideRole,
  TransportationType,
  TransportationClass,
} from '@prisma/client';

export class CreateTourItineraryDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  dayNumber: number;

  @ApiProperty({ example: 'ورود به استانبول' })
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accommodation?: string;

  @ApiPropertyOptional({ example: ['breakfast', 'dinner'] })
  @IsOptional()
  @IsArray()
  meals?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  activities?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  time?: string;
}

export class CreateTourServiceDto {
  @ApiProperty({ enum: ServiceType })
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string;
}

export class CreateTourDto {
  @ApiProperty({ example: 'تور استانبول ۷ شب ۸ روز' })
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({ enum: TourType })
  @IsEnum(TourType)
  type: TourType;

  @ApiProperty({ enum: TourCategory })
  @IsEnum(TourCategory)
  category: TourCategory;

  @ApiPropertyOptional({ enum: TourDifficulty })
  @IsOptional()
  @IsEnum(TourDifficulty)
  difficulty?: TourDifficulty;

  @ApiProperty({ example: '2025-07-15T00:00:00Z' })
  @IsDateString()
  departureDate: string;

  @ApiProperty({ example: '2025-07-22T00:00:00Z' })
  @IsDateString()
  returnDate: string;

  @ApiProperty({ example: 8 })
  @IsNumber()
  @IsPositive()
  durationDays: number;

  @ApiProperty({ example: 7 })
  @IsNumber()
  @IsPositive()
  durationNights: number;

  @ApiProperty({ example: 'تهران' })
  @IsString()
  originCity: string;

  @ApiProperty({ example: 'استانبول' })
  @IsString()
  destinationCity: string;

  @ApiProperty({ example: 'ترکیه' })
  @IsString()
  destinationCountry: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @IsPositive()
  maxCapacity: number;

  @ApiProperty({ example: 45000000 })
  @IsNumber()
  @IsPositive()
  basePrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  pricePerChild?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priceSingleRoom?: number;

  @ApiPropertyOptional({ default: 'IRR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isInstallmentAvailable?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  installmentMonths?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cancellationPolicy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  termsConditions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requiredDocuments?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  climateInfo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  minAge?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxAge?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({ type: [CreateTourItineraryDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTourItineraryDto)
  itinerary?: CreateTourItineraryDto[];

  @ApiPropertyOptional({ type: [CreateTourServiceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTourServiceDto)
  services?: CreateTourServiceDto[];
}

export class UpdateTourDto extends PartialType(CreateTourDto) {}

export class TourFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: TourCategory })
  @IsOptional()
  @IsEnum(TourCategory)
  category?: TourCategory;

  @ApiPropertyOptional({ enum: TourType })
  @IsOptional()
  @IsEnum(TourType)
  type?: TourType;

  @ApiPropertyOptional({ enum: TourStatus })
  @IsOptional()
  @IsEnum(TourStatus)
  status?: TourStatus;

  @ApiPropertyOptional({ enum: TourDifficulty })
  @IsOptional()
  @IsEnum(TourDifficulty)
  difficulty?: TourDifficulty;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  departureDateFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  departureDateTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priceMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  durationMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  durationMax?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @IsNumber()
  limit?: number = 12;

  @ApiPropertyOptional({ default: 'departureDate' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'departureDate';

  @ApiPropertyOptional({ default: 'asc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'asc';
}
