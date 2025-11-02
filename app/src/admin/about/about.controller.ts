import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './dto/update-about.dto';
import { AuthWithBearerToken } from '../../decorators/authWithBearerToken.decorator';
import { RequirePermission } from '../../decorators/requiredPermission.decorator';
import { PermissionsEnum } from '../../enum/permissions.enum';
import {
  DayOfWeekDto,
  UpdateOpeningHoursDto,
} from './dto/updateOpeningHours.dto';

@AuthWithBearerToken()
@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @RequirePermission(PermissionsEnum.ABOUT_UPDATE)
  @Post()
  upsert(@Body() updateAboutDto: UpdateAboutDto) {
    return this.aboutService.upsert(updateAboutDto);
  }

  @RequirePermission(PermissionsEnum.ABOUT_GET)
  @Get()
  getAbout() {
    return this.aboutService.findOne();
  }

  @RequirePermission(PermissionsEnum.OPENING_READ)
  @Get('opening')
  getOpeningHours() {
    return this.aboutService.getOpeningHours();
  }

  @RequirePermission(PermissionsEnum.OPENING_READ)
  @Get('opening/:dayOfWeek')
  getOpeningHoursByDay(@Param() { dayOfWeek }: DayOfWeekDto) {
    return this.aboutService.getOpeningHoursByDay(+dayOfWeek);
  }
  @RequirePermission(PermissionsEnum.OPENING_UPDATE)
  @Put('opening')
  usertOpeningTime(@Body() day: UpdateOpeningHoursDto) {
    return this.aboutService.upsertOpeningHours(day);
  }
}
