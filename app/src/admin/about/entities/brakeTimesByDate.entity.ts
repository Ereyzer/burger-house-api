// CREATE TABLE IF NOT EXISTS brake_times_by_date (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   work_date DATE NOT NULL,
//   closes_at TIME WITHOUT TIME ZONE,
//   opens_at TIME WITHOUT TIME ZONE
// );

import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

// CREATE INDEX IF NOT EXISTS idx_brake_times_by_date_date ON brake_times_by_date (work_date);

@Entity('brake_times_by_date')
@Index('idx_brake_times_by_date_date', ['workDate'])
export class BrakeTimesByDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'work_date', type: 'date', nullable: false })
  workDate: string;
  @Column({
    name: 'closes_at',
    type: 'time without time zone',
    nullable: false,
  })
  closesAt: string;
  @Column({ name: 'opens_at', type: 'time without time zone', nullable: false })
  opensAt: string;
}
