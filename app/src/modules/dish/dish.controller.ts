import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto, UpdateDishPriceDto } from './dto/update-dish.dto';
import { AuthWithBearerToken } from '../../decorators/authWithBearerToken.decorator';
import { RequirePermission } from '../../decorators/requiredPermission.decorator';
import { PermissionsEnum } from '../../enum/permissions.enum';

@AuthWithBearerToken()
@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @RequirePermission(PermissionsEnum.DISH_ADD)
  @Post()
  create(@Body() createDishDto: CreateDishDto) {
    return this.dishService.create(createDishDto);
  }

  @Get()
  findAll() {
    return this.dishService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dishService.findOne(+id);
  }

  @RequirePermission(PermissionsEnum.DISH_UPDATE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
    return this.dishService.update(+id, updateDishDto);
  }

  @RequirePermission(PermissionsEnum.DISH_UPDATE)
  @Patch('price/:id')
  updatePrice(
    @Param('id') id: string,
    @Body() updatePrice: UpdateDishPriceDto,
  ) {
    return this.dishService.updatePrice(+id, updatePrice);
  }

  @RequirePermission(PermissionsEnum.DISH_DELETE)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.dishService.remove(+id);
    return;
  }
}
