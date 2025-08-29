import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity()
export class Personnel {
  // id SMALLSERIAL PRIMARY KEY,
  @PrimaryGeneratedColumn('increment', { type: 'smallint' })
  id: number;

  //   email VARCHAR(255) UNIQUE NOT NULL,
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  // password CHAR(60) NOT NULL,
  @Column({ type: 'varchar', length: 60, nullable: false })
  password: string;

  //  phone VARCHAR(255),

  @Column({ type: 'varchar', length: 255, default: null })
  phone: string;

  // name VARCHAR(255),
  @Column({ type: 'varchar', length: 255, default: null })
  name: string;

  //surname VARCHAR(255),
  @Column({ type: 'varchar', length: 255, default: null })
  surname: string;

  //father_name VARCHAR(255),
  @Column({ type: 'varchar', length: 255, default: null })
  father_name: string;

  //birthday DATE,
  @Column({ type: 'date', nullable: true })
  birthday: Date | null;

  //address VARCHAR(255),
  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  //picture VARCHAR(255), -- url on picture
  @Column({ type: 'varchar', length: 255, nullable: true })
  picture: string | null;

  //role_id VARCHAR(10) REFERENCES roles (id)
  // @Column({ default: null })
  // role_id: string;

  @OneToOne(() => Role, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role | null;
}
