import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { GeneralPropertyDecoratorMaker } from '../../../utils/propertyDecoratorApplier';

const GeneralStringDecorator = GeneralPropertyDecoratorMaker(
  ApiProperty(),
  IsString(),
);
export class CreateCategoryDto {
  @GeneralStringDecorator()
  id: string;
  @GeneralStringDecorator()
  display_name: string;
  @GeneralStringDecorator()
  @IsOptional()
  description: string;
}
