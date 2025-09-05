import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//   id SERIAL PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   price DECIMAL(5, 2) NOT NULL,
//   calories SMALLINT NOT NULL,
//   description TEXT
@Entity('drinks')
export class Drink {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: false })
  price: number;
  @Column({ type: 'smallint', nullable: false })
  calories: number;
  @Column({ type: 'text' })
  description: string;
}
