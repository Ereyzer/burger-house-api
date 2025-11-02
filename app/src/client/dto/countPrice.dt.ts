import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, Min, ValidateNested } from 'class-validator';
import { UniqueIds } from '../../decorators/uniqueIds.decorator';

class Item {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  id: number;
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
}
