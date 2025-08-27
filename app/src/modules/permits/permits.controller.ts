import { Controller, Get, Param } from '@nestjs/common';
import { PermitsService } from './permits.service';

@Controller('permits')
export class PermitsController {
  constructor(private readonly permitsService: PermitsService) {}
  @Get()
  findAll() {
    return this.permitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permitsService.findOne(id);
  }
}
