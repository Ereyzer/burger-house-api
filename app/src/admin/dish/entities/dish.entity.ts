import {
  AfterLoad,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Menu } from '../../menu/entities/menu.entity';

//   id SERIAL PRIMARY KEY,
//   price DECIMAL(5, 2) NOT NULL,
//   name VARCHAR(255) NOT NULL
@Entity('dishes')
export class Dish {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: false })
  price: number;
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;
  @ManyToMany(() => Menu, (menu) => menu.dishes)
  menu_items: Menu[];

  @AfterLoad()
  priceToNumber() {
    this.price = Number(this.price);
  }
}
