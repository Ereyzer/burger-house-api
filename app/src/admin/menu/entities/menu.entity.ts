import {
  AfterLoad,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Drink } from '../../drink/entities/drink.entity';

//   id SERIAL PRIMARY KEY,
//   name VARCHAR(255) NOT NULL UNIQUE,
//   price DECIMAL(6,2) NOT NULL,
//   onboard BOOLEAN NOT NULL,
//   image_small VARCHAR(255),
//   image_medium VARCHAR(255),
//   description TEXT,
//   rating DECIMAL(3,2),
//   calories SMALLINT
@Entity('menu')
@Index('menu_title_subtitle_name', ['title', 'subtitle'])
export class Menu {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;
  @Column({ type: 'varchar', length: 255, nullable: false, default: '' })
  subtitle: string;
  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: false })
  price: number;
  @Column({ type: 'boolean', nullable: false })
  onboard: boolean;
  @Column({ type: 'varchar', length: 255 })
  image_small: string;
  @Column({ type: 'varchar', length: 255 })
  image_medium: string;
  @Column({ type: 'text' })
  description: string;
  @Column({ type: 'decimal', precision: 3, scale: 2 })
  rating: number;
  @Column({ type: 'smallint' })
  calories: number;
  @ManyToMany(() => Category, (category) => category.menu)
  @JoinTable({
    name: 'menu_in_category',
    joinColumns: [{ name: 'menu_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'category_id', referencedColumnName: 'id' }],
  })
  categories: Category[];

  @ManyToMany(() => Drink, (drink) => drink.menu_items)
  @JoinTable({
    name: 'drinks_in_menu',
    joinColumns: [{ name: 'menu_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'drink_id', referencedColumnName: 'id' }],
  })
  drinks: Drink[];

  @AfterLoad()
  priceToNumber() {
    this.price = Number.parseFloat(this.price as unknown as string);
  }
}
