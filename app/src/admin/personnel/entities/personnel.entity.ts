import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Password } from './password.entity';

@Entity('personnel')
export class Personnel {
  // id SMALLSERIAL PRIMARY KEY,
  @PrimaryGeneratedColumn('increment', { type: 'smallint' })
  id: number;

  //   email VARCHAR(255) UNIQUE NOT NULL,
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  // password_id INTEGER NOT NULL REFERENCES passwords (id),
  @OneToOne(() => Password, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'password_id' })
  password: Password;
  //  phone VARCHAR(255),
  @Column({ name: 'enc_phone', type: 'varchar', length: 255, nullable: true })
  public phone: string | null;

  // name VARCHAR(255),
  @Column({ name: 'enc_name', type: 'varchar', length: 255, nullable: true })
  public name: string | null;

  //surname VARCHAR(255),
  @Column({ name: 'enc_surname', type: 'varchar', length: 255, nullable: true })
  public surname: string | null;

  //father_name VARCHAR(255),
  @Column({
    name: 'enc_father_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public father_name: string | null;

  //birthday DATE,
  @Column({ type: 'date', nullable: true })
  birthday: Date | null;

  //address VARCHAR(255),
  @Column({ name: 'enc_address', type: 'varchar', length: 255, nullable: true })
  public address: string | null;

  //picture VARCHAR(255), -- url on picture
  @Column({ type: 'varchar', length: 255, nullable: true })
  picture: string | null;

  //role_id VARCHAR(10) REFERENCES roles (id)
  @Index('one_owner_per_role', { unique: true, where: "role_id = 'owner'" })
  @Column({ type: 'varchar', length: 20, nullable: true })
  role_id: string | null;

  @OneToOne(() => Role, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role | null;
}
