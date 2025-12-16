import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { UniqueIds } from '../../decorators/uniqueIds.decorator';

class Item {
  @ApiProperty()
  @IsUUID('4')
  id: string;
  @ApiProperty()
  @Min(1)
  quantity: number;
}
export class CountPriceDto {
  @ApiProperty({ type: [Item] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  @UniqueIds()
  items: Item[];

  @ApiProperty()
  @IsBoolean()
  isDelivery: boolean;

  @ValidateIf((o: CountPriceDto) => o.isDelivery === true)
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  distance?: number;

  @ValidateIf((o: CountPriceDto) => o.isDelivery === true)
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ValidateIf((o: CountPriceDto) => o.isDelivery === true)
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  secretToken?: string;
}
