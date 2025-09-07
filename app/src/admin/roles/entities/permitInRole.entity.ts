import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Role } from './role.entity';
import { Permit } from '../../permits/entities/permit.entity';

@Entity({ name: 'permit_in_role' })
export class PermitInRole {
  //   role_id VARCHAR(10) NOT NULL,
  @PrimaryColumn({ type: 'varchar', length: 20 })
  role_id: string;

  //   permit_id VARCHAR(50) NOT NULL,
  @PrimaryColumn({ type: 'varchar', length: 50 })
  permit_id: string;

  @ManyToOne(() => Permit, (permit) => permit.permitInRole, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'permit_id' })
  permit: Permit;
  @ManyToOne(() => Role, (role) => role.permits, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
