import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class DayOfWeekDto {
  @ApiProperty({
    example: 1,
    description: 'Day of week: 0 (Sunday) – 6 (Saturday)',
  })
  @IsString()
  @IsAlphanumeric()
  dayOfWeek: string;
}
const timePattern = '^(([01][0-9])|(2[0-3])):([0-5][0-9])$';
const timeRegExp = new RegExp(timePattern);

export class UpdateOpeningHoursDto {
  @ApiProperty({
    example: 1,
    description: 'Day of week: 0 (Sunday) – 6 (Saturday)',
  })
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;
  @ApiProperty({
    example: '09:00',
    description: 'Open time format (HH:MM) or null',
  })
  @IsOptional()
  @IsString()
  @Matches(timeRegExp, {
    message: 'opensAt format HH:MM (00:00–23:59)',
  })
  opensAt: string | null;
  @ApiProperty({
    example: '18:00',
    description: 'Close time format (HH:MM) or null',
  })
  @IsOptional()
  @IsString()
  @Matches(timeRegExp, {
    message: 'opensAt format HH:MM (00:00–23:59)',
  })
  closesAt: string | null;
}
