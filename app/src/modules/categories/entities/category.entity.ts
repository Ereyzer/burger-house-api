import { Column, Entity, PrimaryColumn } from 'typeorm';

//   id VARCHAR(20) PRIMARY KEY,
//   display_name VARCHAR(20) NOT NULL,
//   description TEXT

@Entity('categories')
export class Category {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;
  @Column({ type: 'varchar', length: 20, nullable: false })
  display_name: string;
  @Column({ type: 'text' })
  description: string;
}
