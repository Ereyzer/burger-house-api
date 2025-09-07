import { PickType } from '@nestjs/mapped-types';
import { CreatePersonnelDto } from './create-personnel.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDecimal,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { GeneralPropertyDecoratorMaker } from '../../../utils/propertyDecoratorApplier';

const GeneralDecorator = GeneralPropertyDecoratorMaker(
  ApiProperty(),
  IsOptional(),
);

const GeneralStringDecorator = GeneralPropertyDecoratorMaker(
  ApiProperty(),
  IsOptional(),
  IsString(),
);

export class UpdatePersonnelDto {
  @GeneralStringDecorator()
  name: string;
  @GeneralStringDecorator()
  @Length(9, 9)
  @IsDecimal()
  phone: string;
  @GeneralStringDecorator()
  surname: string;
  @GeneralStringDecorator()
  father_name: string;
  @GeneralDecorator()
  @IsDate()
  birthday: Date;
  @GeneralStringDecorator()
  address: string;
}

export class UpdatePersonnelEmailDto extends PickType(CreatePersonnelDto, [
  'email',
] as const) {
  @ApiProperty()
  @IsEmail()
  newEmail: string;
}

export class UpdatePersonnelPasswordDto extends PickType(CreatePersonnelDto, [
  'password',
] as const) {}

export class UpdatePersonnelRoleDto {
  @ApiProperty()
  @IsString()
  role: string;
}
