import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GuidesService } from './guides.service';

@ApiTags('راهنماها')
@ApiBearerAuth()
@Controller('guides')
export class GuidesController {
  constructor(private guidesService: GuidesService) {}
}
