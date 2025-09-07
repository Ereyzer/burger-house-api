import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PermitInRole } from '../../roles/entities/permitInRole.entity';

@Entity({ name: 'permits' })
export class Permit {
  // id VARCHAR(50) PRIMARY KEY,
  @PrimaryColumn({
    type: 'varchar',
    length: 50,
  })
  id: string;

  //display_name VARCHAR(50) NOT NULL,
  @Column({ type: 'varchar', length: 50, nullable: false })
  display_name: string;

  //description VARCHAR(150)
  @Column({ type: 'varchar', length: 150, nullable: true })
  description: string | null;

  @OneToMany(() => PermitInRole, (permitInRole) => permitInRole.permit)
  permitInRole: PermitInRole[];
}
