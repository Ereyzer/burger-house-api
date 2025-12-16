import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateDeliveryPriceDto {
  @ApiProperty()
  @IsNumber()
  distance: number;
  @ApiProperty()
  @IsNumber()
  minOrder: number;
  @ApiProperty()
  @IsNumber()
  deliveryPrice: number;
}
