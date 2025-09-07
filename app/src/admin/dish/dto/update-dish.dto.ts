import { PartialType, PickType } from '@nestjs/swagger';
import { CreateDishDto } from './create-dish.dto';

export class UpdateDishDto extends PartialType(CreateDishDto) {}

export class UpdateDishPriceDto extends PickType(CreateDishDto, [
  'price',
] as const) {}
