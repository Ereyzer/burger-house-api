import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'permits' })
export class Permit {
  // id VARCHAR(50) PRIMARY KEY,
  @PrimaryColumn({
    name: 'id',
    type: 'varchar',
    length: 50,
    update: false,
    unique: true,
  })
  id: string;

  //display_name VARCHAR(50) NOT NULL,
  @Column({ type: 'varchar', length: 50, nullable: false })
  display_name: string;

  //description VARCHAR(150)
  @Column('varchar', { length: 150, nullable: true, default: null })
  description: string;
}
