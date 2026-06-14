import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';

@ApiTags('نظرات')
@ApiBearerAuth()
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}
}
