import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTourDto, UpdateTourDto, TourFilterDto } from './dto/tour.dto';
import { TourStatus } from '@prisma/client';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s؀-ۿ]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') + '-' + Date.now();
}

@Injectable()
export class ToursService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: TourFilterDto) {
    const {
      search,
      category,
      type,
      status,
      difficulty,
      destination,
      departureDateFrom,
      departureDateTo,
      priceMin,
      priceMax,
      durationMin,
      durationMax,
      page = 1,
      limit = 12,
      sortBy = 'departureDate',
      sortOrder = 'asc',
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    } else {
      where.status = TourStatus.PUBLISHED;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { destinationCity: { contains: search, mode: 'insensitive' } },
        { destinationCountry: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) where.category = category;
    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;
    if (destination) {
      where.OR = [
        { destinationCity: { contains: destination, mode: 'insensitive' } },
        { destinationCountry: { contains: destination, mode: 'insensitive' } },
      ];
    }
    if (departureDateFrom) where.departureDate = { gte: new Date(departureDateFrom) };
    if (departureDateTo) where.departureDate = { ...where.departureDate, lte: new Date(departureDateTo) };
    if (priceMin) where.basePrice = { gte: priceMin };
    if (priceMax) where.basePrice = { ...where.basePrice, lte: priceMax };
    if (durationMin) where.durationDays = { gte: durationMin };
    if (durationMax) where.durationDays = { ...where.durationDays, lte: durationMax };

    const [tours, total] = await Promise.all([
      this.prisma.tour.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          title: true,
          slug: true,
          shortDescription: true,
          coverImage: true,
          status: true,
          type: true,
          category: true,
          difficulty: true,
          departureDate: true,
          returnDate: true,
          durationDays: true,
          durationNights: true,
          destinationCity: true,
          destinationCountry: true,
          maxCapacity: true,
          currentCapacity: true,
          basePrice: true,
          currency: true,
          isFeatured: true,
          isInstallmentAvailable: true,
          _count: { select: { reviews: true } },
        },
      }),
      this.prisma.tour.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return { items: tours, total, page, totalPages };
  }

  async findOne(slug: string) {
    const tour = await this.prisma.tour.findFirst({
      where: { slug, deletedAt: null },
      include: {
        media: { orderBy: { sortOrder: 'asc' } },
        itinerary: { orderBy: { dayNumber: 'asc' } },
        services: true,
        guides: {
          include: {
            guide: {
              include: {
                user: {
                  select: { firstName: true, lastName: true, avatar: true },
                },
              },
            },
          },
        },
        hotels: { include: { hotel: true }, orderBy: { sortOrder: 'asc' } },
        transportations: { orderBy: { sortOrder: 'asc' } },
        reviews: {
          where: { status: 'APPROVED' },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true } },
            media: true,
          },
        },
        _count: { select: { reviews: true, bookings: true } },
      },
    });

    if (!tour) throw new NotFoundException('تور یافت نشد');

    await this.prisma.tour.update({
      where: { id: tour.id },
      data: { viewCount: { increment: 1 } },
    });

    return tour;
  }

  async findFeatured() {
    return this.prisma.tour.findMany({
      where: { status: TourStatus.PUBLISHED, isFeatured: true, deletedAt: null },
      take: 8,
      orderBy: { departureDate: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        category: true,
        departureDate: true,
        durationDays: true,
        destinationCity: true,
        destinationCountry: true,
        maxCapacity: true,
        currentCapacity: true,
        basePrice: true,
        currency: true,
      },
    });
  }

  async create(dto: CreateTourDto) {
    const slug = slugify(dto.title);

    const existing = await this.prisma.tour.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('تور با این عنوان قبلاً ثبت شده است');

    const { itinerary, services, ...tourData } = dto;

    return this.prisma.tour.create({
      data: {
        ...tourData,
        slug,
        departureDate: new Date(dto.departureDate),
        returnDate: new Date(dto.returnDate),
        basePrice: dto.basePrice,
        pricePerChild: dto.pricePerChild,
        priceSingleRoom: dto.priceSingleRoom,
        itinerary: itinerary ? { create: itinerary } : undefined,
        services: services ? { create: services } : undefined,
      },
      include: {
        itinerary: true,
        services: true,
      },
    });
  }

  async update(id: string, dto: UpdateTourDto) {
    await this.findById(id);

    const { itinerary, services, ...tourData } = dto;

    return this.prisma.tour.update({
      where: { id },
      data: {
        ...tourData,
        departureDate: dto.departureDate ? new Date(dto.departureDate) : undefined,
        returnDate: dto.returnDate ? new Date(dto.returnDate) : undefined,
        basePrice: dto.basePrice,
        pricePerChild: dto.pricePerChild,
        priceSingleRoom: dto.priceSingleRoom,
      },
    });
  }

  async updateStatus(id: string, status: TourStatus) {
    await this.findById(id);
    return this.prisma.tour.update({ where: { id }, data: { status } });
  }

  async softDelete(id: string) {
    await this.findById(id);
    return this.prisma.tour.update({
      where: { id },
      data: { deletedAt: new Date(), status: TourStatus.CANCELLED },
    });
  }

  async getSimilar(id: string) {
    const tour = await this.findById(id);
    return this.prisma.tour.findMany({
      where: {
        id: { not: id },
        category: tour.category,
        status: TourStatus.PUBLISHED,
        deletedAt: null,
      },
      take: 4,
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        basePrice: true,
        currency: true,
        departureDate: true,
        durationDays: true,
        destinationCity: true,
      },
    });
  }

  private async findById(id: string) {
    const tour = await this.prisma.tour.findFirst({ where: { id, deletedAt: null } });
    if (!tour) throw new NotFoundException('تور یافت نشد');
    return tour;
  }
}
