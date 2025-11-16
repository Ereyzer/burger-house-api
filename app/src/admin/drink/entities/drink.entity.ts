import {
  AfterLoad,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Menu } from '../../menu/entities/menu.entity';

@Entity('drinks')
export class Drink {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: false })
  price: number;
  @Column({ type: 'smallint', nullable: false })
  calories: number;
  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => Menu, (menu) => menu.drinks)
  menu_items: Menu[];

  @AfterLoad()
  priceToNumber() {
    this.price = Number.parseFloat(this.price as unknown as string);
  }
}
