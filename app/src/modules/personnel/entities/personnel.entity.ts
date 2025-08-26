import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Personnel {
  // id SMALLSERIAL PRIMARY KEY,
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;

  //   email VARCHAR(255) UNIQUE NOT NULL,
  @Column({ unique: true, nullable: false })
  email: string;

  // password CHAR(60) NOT NULL,
  @Column({ nullable: false })
  password: string;

  //  phone VARCHAR(255),

  @Column({ default: null })
  phone: string;

  // name VARCHAR(255),
  @Column({ default: null })
  name: string;

  //surname VARCHAR(255),
  @Column({ default: null })
  surname: string;

  //father_name VARCHAR(252),
  @Column({ default: null })
  father_name: string;

  //birthday DATE,
  @Column({ default: null })
  birthday: string;

  //address VARCHAR(255),
  @Column({ default: null })
  address: string;

  //picture VARCHAR(255), -- url on picture
  @Column({ default: null })
  picture: string;

  //role_id VARCHAR(10) REFERENCES roles (id)
  @Column({ default: null })
  role_id: string;
}
