import { ApiProperty } from '@nestjs/swagger';
import { GeneralPropertyDecoratorMaker } from '../../../utils/propertyDecoratorApplier';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

const GeneralStringDecorator = GeneralPropertyDecoratorMaker(
  ApiProperty(),
  IsOptional(),
  IsString(),
);

export class CreateAboutDto {
  @GeneralStringDecorator()
  @IsUrl()
  facebook?: string;
  @GeneralStringDecorator()
  @IsUrl()
  instagram?: string;
  @GeneralStringDecorator()
  @IsEmail()
  email?: string;
  @GeneralStringDecorator()
  @Length(9, 9)
  phone?: string;
  @GeneralStringDecorator()
  about_description?: string;
  @GeneralStringDecorator()
  address?: string;
}
