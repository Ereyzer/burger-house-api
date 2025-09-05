import { CreateDrinkDto } from './create-drink.dto';
import { PickType } from '@nestjs/mapped-types';

export class UpdateDrinkPriceDto extends PickType(CreateDrinkDto, [
  'price',
] as const) {}
