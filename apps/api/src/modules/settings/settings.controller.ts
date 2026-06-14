import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';

@ApiTags('تنظیمات')
@ApiBearerAuth()
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}
}
