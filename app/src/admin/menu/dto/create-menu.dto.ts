import { ApiProperty } from '@nestjs/swagger';
import { GeneralPropertyDecoratorMaker } from '../../../utils/propertyDecoratorApplier';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

const GeneralString = GeneralPropertyDecoratorMaker(ApiProperty(), IsString());
const GeneralNumber = GeneralPropertyDecoratorMaker(ApiProperty(), IsNumber());

export class CreateMenuDto {
  @GeneralString()
  title: string;
  @GeneralString()
  @IsOptional()
  subtitle?: string;
  @GeneralNumber()
  @Min(0.01)
  @Max(9999.99)
  price: number;
  @ApiProperty()
  @IsBoolean()
  onboard: boolean;
  @GeneralString()
  @IsOptional()
  description?: string;
  // @GeneralNumber()
  // @IsOptional()
  // @Min(1)
  // @Max(5)
  // rating?: number;
  // TODO: not optional when all functionality is ready
  @GeneralNumber()
  @IsOptional()
  calories?: number;
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  categories: string[];
  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  drinks: number[];
}
