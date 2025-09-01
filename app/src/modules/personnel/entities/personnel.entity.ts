import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Password } from './password.entity';
import { CipherAndHash } from '../../../utils/CipherAndHash';

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
  @Column({ name: 'enc_phone', type: 'varchar', length: 255, default: null })
  @JoinColumn({ name: 'enc_phone' })
  public phone: string;

  // name VARCHAR(255),
  @Column({ name: 'enc_name', type: 'varchar', length: 255, default: null })
  @JoinColumn({ name: 'enc_name' })
  public name: string;

  //surname VARCHAR(255),
  @Column({ name: 'enc_surname', type: 'varchar', length: 255, default: null })
  @JoinColumn({ name: 'enc_surname' })
  public surname: string;

  //father_name VARCHAR(255),
  @Column({
    name: 'enc_father_name',
    type: 'varchar',
    length: 255,
    default: null,
  })
  @JoinColumn({ name: 'enc_father_name' })
  public father_name: string;

  //birthday DATE,
  @Column({ type: 'date', nullable: true })
  birthday: Date | null;

  //address VARCHAR(255),
  @Column({ name: 'enc_address', type: 'varchar', length: 255, nullable: true })
  @JoinColumn({ name: 'enc_address' })
  public address: string | null;

  //picture VARCHAR(255), -- url on picture
  @Column({ type: 'varchar', length: 255, nullable: true })
  picture: string | null;

  //role_id VARCHAR(10) REFERENCES roles (id)
  @Column({ type: 'varchar', length: 20 })
  role_id: string;

  @OneToOne(() => Role, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role | null;

  @BeforeInsert()
  @BeforeUpdate()
  public encryptData() {
    const cipher = CipherAndHash.instance;
    if (this.name) {
      this.name = cipher.encryptText(this.name);
    }
    if (this.surname) {
      this.surname = cipher.encryptText(this.surname);
    }
    if (this.father_name) {
      this.father_name = cipher.encryptText(this.father_name);
    }
    if (this.address) {
      this.address = cipher.encryptText(this.address);
    }
    if (this.phone) {
      this.phone = cipher.encryptText(this.phone);
    }
  }

  @AfterLoad()
  public decryptData() {
    const cipher = CipherAndHash.instance;

    if (this.name) {
      this.name = cipher.decryptText(this.name);
    }
    if (this.surname) {
      this.surname = cipher.decryptText(this.surname);
    }
    if (this.father_name) {
      this.father_name = cipher.decryptText(this.father_name);
    }
    if (this.address) {
      this.address = cipher.decryptText(this.address);
    }
    if (this.phone) {
      this.phone = cipher.decryptText(this.phone);
    }
  }
}
