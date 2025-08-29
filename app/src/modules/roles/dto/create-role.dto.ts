import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  display_name: string;
  @ApiProperty({ example: 'some text about this role' })
  description?: string;
  @ApiProperty({ type: [String] })
  permits: string[] | undefined;
}
