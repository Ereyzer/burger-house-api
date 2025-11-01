import { Column, Entity, PrimaryColumn } from 'typeorm';

//  id SMALLSERIAL PRIMARY KEY, maby better jast char(1);
//   facebook VARCHAR(255),
//   instagram VARCHAR(255),
//   email VARCHAR(255),
//     phone CHAR(9),
//         about_description TEXT
@Entity('about')
export class About {
  @PrimaryColumn({ type: 'smallint', default: 1 })
  id: number = 1;
  @Column({ type: 'varchar', length: 255, nullable: true })
  facebook: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true })
  instagram: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;
  @Column({ type: 'char', length: 9, nullable: true })
  phone: string | null;
  @Column({ type: 'text', nullable: true })
  about_description: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;
}
