import { Controller, Get, Param } from '@nestjs/common';
import { PermitsService } from './permits.service';
import { ApiForbiddenResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { AuthWithBearerToken } from '../../decorators/authWithBearerToken.decorator';
import { RequirePermission } from '../../decorators/requiredPermission.decorator';
import { PermissionsEnum } from '../../enum/permissions.enum';

@AuthWithBearerToken()
@Controller('permits')
@ApiForbiddenResponse()
export class PermitsController {
  constructor(private readonly permitsService: PermitsService) {}

  @RequirePermission(PermissionsEnum.PERMITS_GET_ALL)
  @Get()
  findAll() {
    return this.permitsService.findAll();
  }

  @RequirePermission(PermissionsEnum.PERMITS_INFO)
  @ApiNotFoundResponse()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permitsService.findOne(id);
  }
}
