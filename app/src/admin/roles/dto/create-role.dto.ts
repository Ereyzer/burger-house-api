import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  display_name: string;
  @ApiProperty({ example: 'some text about this role' })
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsOptional()
  permits: string[] | undefined;
}
