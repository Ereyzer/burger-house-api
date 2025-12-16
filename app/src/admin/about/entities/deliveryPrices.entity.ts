import { AfterLoad, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('delivery_prices')
export class DeliveryPrices {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    name: 'delivery_price',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: false,
    default: 0.0,
  })
  deliveryPrice: number;

  // distance SMALLINT NOT NULL,
  @Column({ type: 'smallint', nullable: false })
  distance: number;
  // min_order SMALLINT NOT NULL,
  @Column({ name: 'min_order', nullable: false })
  minOrder: number;

  @AfterLoad()
  priceToNumber() {
    this.deliveryPrice = Number.parseFloat(
      this.deliveryPrice as unknown as string,
    );
  }
}
