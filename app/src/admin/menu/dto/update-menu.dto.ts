import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { GeneralPropertyDecoratorMaker } from '../../../utils/propertyDecoratorApplier';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateMenuDto extends PartialType(
  OmitType(CreateMenuDto, ['categories', 'drinks', 'dishes'] as const),
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

export class AddDrinkInMenuDto {
  @ApiProperty()
  @IsUUID('4')
  drink: string;
}

export class AddDishInMenuDto {
  @ApiProperty()
  @IsUUID('4')
  dish: string;
}
