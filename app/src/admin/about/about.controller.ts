import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './dto/update-about.dto';
import { AuthWithBearerToken } from '../../decorators/authWithBearerToken.decorator';
import { RequirePermission } from '../../decorators/requiredPermission.decorator';
import { PermissionsEnum } from '../../enum/permissions.enum';
import {
  DayOfWeekDto,
  UpdateOpeningHoursDto,
} from './dto/updateOpeningHours.dto';
import { CreateBrakeTimeDto } from './dto/create-brakeTime.dto';
import { CreateDeliveryPriceDto } from './dto/create-delivery-price.dto';

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
  async getAbout() {
    const [aboutData, openningHours, brakeTimes, deliveryPrices] =
      await Promise.all([
        this.aboutService.findOne(),
        this.aboutService.getOpeningHours(),
        this.aboutService.getBrakeTimes(),
        this.aboutService.getDeliveryPrices(),
      ]);
    return { ...aboutData, openningHours, brakeTimes, deliveryPrices };
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

  @RequirePermission(PermissionsEnum.OPENING_UPDATE)
  @Post('braketime')
  addBrakeTime(@Body() dto: CreateBrakeTimeDto) {
    return this.aboutService.addBrakeTime(dto);
  }

  @RequirePermission(PermissionsEnum.OPENING_READ)
  @Get('braketime')
  getBrakeTimes(@Query('date') workDate?: string) {
    return this.aboutService.getBrakeTimes(workDate);
  }

  @RequirePermission(PermissionsEnum.OPENING_UPDATE)
  @Delete('braketime/:id')
  rmBrakeTimeById(@Param('id') id: string) {
    return this.aboutService.rmBrakeTimeBy({ id });
  }
  @RequirePermission(PermissionsEnum.OPENING_UPDATE)
  @Delete('braketime')
  rmBrakeTime() {
    return this.aboutService.rmBrakeTimeBy();
  }

  // TODO:change permision
  @RequirePermission(PermissionsEnum.ABOUT_UPDATE)
  @Post('deliveryprice')
  addDeliveryPrice(@Body() newPrice: CreateDeliveryPriceDto) {
    return this.aboutService.addDeliveryPrice(newPrice);
  }

  // TODO: change permision
  @RequirePermission(PermissionsEnum.ABOUT_UPDATE)
  @Delete('deliveryprice/:id')
  rmDeliveryPrice(@Param('id') id: string) {
    return this.aboutService.rmDeliveryPrice(id);
  }
}
