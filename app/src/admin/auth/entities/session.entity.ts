import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Personnel } from '../../personnel/entities/personnel.entity';

@Entity({ name: 'sessions' })
@Index('idx_sessions_sas_srs', ['sas', 'srs'])
export class Session {
  // CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  // CREATE TABLE IF NOT EXISTS sessions (
  //   id UUID PRIMARY KEY DEFAULT uuid_generated_v4(),
  //   personnel_id SMALLINT NOT NULL REFERENCES personnel (id) ON DELETE CASCADE ON UPDATE CASCADE,
  //   sas CHAR(32) NOT NULL,
  //   srs CHAR(32) NOT NULL,
  //   created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  //   updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  // );
  // CREATE INDEX idx_sessions_sas_srs ON sessions (sas, srs);
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'smallint', nullable: false })
  personnel_id: number;
  @ManyToOne(() => Personnel, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'personnel_id' })
  personnel: Personnel;

  @Column({ type: 'char', length: 32, nullable: false })
  sas: string;

  @Column({ type: 'char', length: 32, nullable: false })
  srs: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
