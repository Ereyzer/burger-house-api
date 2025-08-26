import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PermitsService } from './permits.service';
import { CreatePermitDto } from './dto/create-permit.dto';

@Controller('permits')
export class PermitsController {
  constructor(private readonly permitsService: PermitsService) {}

  @Post()
  create(@Body() createPermitDto: CreatePermitDto) {
    return this.permitsService.create(createPermitDto);
  }

  @Get()
  findAll() {
    return this.permitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permitsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permitsService.remove(+id);
  }
}
