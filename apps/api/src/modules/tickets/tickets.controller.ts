import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';

@ApiTags('تیکت‌ها')
@ApiBearerAuth()
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}
}
