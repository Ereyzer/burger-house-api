import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Menu } from '../../../admin/menu/entities/menu.entity';

@Entity('menu_item_in_order')
@Index('idx_menuItem_in_order_time', ['createdAt'])
export class MenuItemInOrder {
  @PrimaryColumn('integer')
  order_id: number;
  @PrimaryColumn('integer')
  menu_id: number;
  @Column({ type: 'integer', nullable: false, default: 1 })
  quantity: number;
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp without time zone',
    default: () => 'NOW()',
  })
  createdAt: Date;

  @ManyToOne(() => Order, (order) => order.selections, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Menu, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'menu_id' })
  selection: Menu;
}
