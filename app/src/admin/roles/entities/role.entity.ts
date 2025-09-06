import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PermitInRole } from './permitInRole.entity';

@Entity({ name: 'roles' })
export class Role {
  //   Id VARCHAR(10) PRIMARY KEY,
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;
  //   display_name VARCHAR(50) NOT NULL UNIQUE,
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  display_name: string;
  //   description VARCHAR(150)
  @Column({ type: 'varchar', length: 150, default: null })
  description: string | null;

  @OneToMany(() => PermitInRole, (permitInRole) => permitInRole.role)
  permits: PermitInRole[];
}
