import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';

@ApiTags('کوپن‌ها')
@ApiBearerAuth()
@Controller('coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}
}
