import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuItemInOrder } from './menuItemInOrder.entity';
import { OrderStatus, PaymentMethod } from '../types/enums';

@Entity('orders')
export class Order {
  // id SERIAL PRIMARY KEY,
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp without time zone',
    default: () => 'NOW()',
    nullable: false,
  })
  public createdAt: Date;
  // updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp without time zone',
    default: () => 'NOW()',
    nullable: false,
  })
  public updatedAt: Date;
  // payment payment_method NOT NULL,
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    enumName: 'payment_method',
    nullable: false,
  })
  payment: PaymentMethod;
  // amount DECIMAL(7,2) NOT NULL,
  @Column({ type: 'decimal', precision: 7, scale: 2, nullable: false })
  amount: number;

  @Column({
    name: 'delivery_price',
    type: 'decimal',
    precision: 4,
    scale: 2,
    default: 0.0,
  })
  deliveryPrice: number;
  // enc_phone VARCHAR(255) NOT NULL,
  @Column({ name: 'enc_phone', type: 'varchar', length: 255, nullable: false })
  public phone: string;
  // customer_name VARCHAR(50) NOT NULL,
  @Column({
    name: 'customer_name',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  public customerName: string;
  // delivery BOOLEAN NOT NULL,
  @Column({ type: 'boolean', nullable: false })
  delivery: boolean;
  // street VARCHAR(100) NOT NULL,
  @Column({ type: 'varchar', length: 100, nullable: true })
  street: string | null;
  // status order_status NOT NULL DEFAULT 'pending',
  @Column({
    type: 'enum',
    enum: OrderStatus,
    enumName: 'order_status',
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;
  // enc_address_full VARCHAR(255),
  @Column({
    name: 'enc_address_full',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public addressFull: string | null;
  // enc_address_clarification
  @Column({
    name: 'enc_address_clarification',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public addressClarification: string | null;
  // description TEXT,
  @Column({ type: 'text', nullable: true })
  description: string | null;
  // enc_email VARCHAR(255) DEFAULT NULL
  @Column({
    name: 'enc_email',
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  public email: string | null;

  @OneToMany(() => MenuItemInOrder, (menuItem) => menuItem.order, {
    cascade: true,
  })
  selections: MenuItemInOrder[];

  @AfterLoad()
  priceToNumber() {
    this.amount = Number.parseFloat(this.amount as unknown as string);
    this.deliveryPrice = Number.parseFloat(
      this.deliveryPrice as unknown as string,
    );
  }
}
