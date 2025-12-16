import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, Matches } from 'class-validator';

const timePattern = '^(([01][0-9])|(2[0-3])):([0-5][0-9])(:([0-5][0-9]))?$';
const timeRegExp = new RegExp(timePattern);

export class CreateBrakeTimeDto {
  @ApiProperty({
    example: '2025-11-20',
    description: 'Work date in format YYYY-MM-DD',
  })
  @IsDateString({}, { message: 'workDate must be a valid date YYYY-MM-DD' })
  // @Matches(/^\d{4}-\d{2}-\d{2}$/, {
  //   message: 'workDate must be in format YYYY-MM-DD',
  // })
  workDate: string;
  @ApiProperty({
    example: '09:00',
    description: 'Open time format (HH:MM) or null',
  })
  @IsString()
  @Matches(timeRegExp, {
    message: 'closesAt format HH:MM (00:00–23:59)',
  })
  closesAt: string;
  @ApiProperty({
    example: '18:00',
    description: 'Close time format (HH:MM) or null',
  })
  @IsString()
  @Matches(timeRegExp, {
    message: 'opensAt format HH:MM (00:00–23:59)',
  })
  opensAt: string;
}
