import { Controller, Get, Post, Body } from '@nestjs/common';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './dto/update-about.dto';
import { AuthWithBearerToken } from '../../decorators/authWithBearerToken.decorator';
import { RequirePermission } from '../../decorators/requiredPermission.decorator';
import { PermissionsEnum } from '../../enum/permissions.enum';

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
}
