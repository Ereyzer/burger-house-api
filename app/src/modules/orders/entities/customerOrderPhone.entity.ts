import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('customer_order_phone_hashes')
@Index('idx_customer_order_hash_phone', ['hashPhone'])
export class CustomerOrderPhoneEntity {
  @PrimaryColumn({ type: 'char', length: 60, name: 'hash_phone' })
  hashPhone: string;
  @PrimaryColumn('integer', { name: 'order_id' })
  orderId: number;
  @ManyToOne(() => Order, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
