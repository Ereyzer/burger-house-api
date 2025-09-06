import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { GeneralPropertyDecoratorMaker } from '../../../utils/propertyDecoratorApplier';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMenuDto extends PartialType(
  OmitType(CreateMenuDto, ['categories'] as const),
) {}

const GeneralStringOptional = GeneralPropertyDecoratorMaker(
  ApiProperty(),
  IsString(),
  IsOptional(),
);

export class UpdateMenuImagesDto {
  @GeneralStringOptional()
  image_small?: string;
  @GeneralStringOptional()
  image_medium?: string;
}
