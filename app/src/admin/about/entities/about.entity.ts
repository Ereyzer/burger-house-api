import { Column, Entity, PrimaryColumn } from 'typeorm';

//  id SMALLSERIAL PRIMARY KEY, maby better jast char(1);
//   facebook VARCHAR(255),
//   instagram VARCHAR(255),
//   email VARCHAR(255),
//     phone CHAR(9),
//         about_description TEXT
@Entity('about')
export class About {
  @PrimaryColumn({ type: 'smallint' })
  id: number;
  @Column({ type: 'varchar', length: 255 })
  facebook: string;
  @Column({ type: 'varchar', length: 255 })
  instagram: string;
  @Column({ type: 'varchar', length: 255 })
  email: string;
  @Column({ type: 'char', length: 9 })
  phone: string;
  @Column({ type: 'text' })
  about_description: string;
}
