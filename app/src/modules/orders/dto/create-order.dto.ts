import { ApiProperty } from '@nestjs/swagger';

import { PaymentMethod } from '../types/enums';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class Selection {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  id: number;
  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  payment: PaymentMethod;
  @ApiProperty()
  @IsNumber()
  @Min(0.0)
  @Max(99999.99)
  amount: number;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0.0)
  @Max(99.99)
  deliveryPrice?: number;
  @ApiProperty()
  @IsString()
  @Length(9)
  @IsNumberString()
  phone: string;
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  customerName: string;
  @ApiProperty()
  @IsBoolean()
  delivery: boolean;
  @ApiProperty({ required: false, nullable: true, type: String })
  @IsOptional()
  @IsString()
  street?: string;
  @ApiProperty({ required: false, nullable: true, type: String })
  @IsOptional()
  @IsString()
  address?: string | null;
  @ApiProperty({ required: false, nullable: true, type: String })
  @IsOptional()
  @IsString()
  addressClarification?: string | null;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
  @ApiProperty({ type: [Selection] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Selection)
  selections: Selection[];
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  distance?: number;
}
