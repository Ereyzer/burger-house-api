import { Entity, PrimaryColumn, Column, Check } from 'typeorm';

@Entity('opening_hours')
@Check(`"day_of_week" BETWEEN 0 AND 6`)
export class OpeningHour {
  @PrimaryColumn({ name: 'day_of_week', type: 'smallint' })
  dayOfWeek: number;

  @Column({ name: 'opens_at', type: 'time', nullable: true })
  opensAt: string | null;

  @Column({ name: 'closes_at', type: 'time', nullable: true })
  closesAt: string | null;
}
