import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';

@ApiTags('فایل‌ها')
@ApiBearerAuth()
@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}
}
