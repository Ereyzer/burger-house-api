import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('passwords')
export class Password {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'char', length: 60, nullable: false })
  password: string;

  @Column({ type: 'char', length: 29, nullable: false })
  salt: string;
}
