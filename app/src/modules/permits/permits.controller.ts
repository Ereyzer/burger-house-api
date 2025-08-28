import { Controller, Get, Param } from '@nestjs/common';
import { PermitsService } from './permits.service';
import { ApiForbiddenResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@Controller('permits')
@ApiForbiddenResponse()
export class PermitsController {
  constructor(private readonly permitsService: PermitsService) {}
  @Get()
  findAll() {
    return this.permitsService.findAll();
  }

  @ApiNotFoundResponse()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permitsService.findOne(id);
  }
}
