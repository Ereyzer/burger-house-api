import { Entity, PrimaryColumn } from 'typeorm';

//   category_id VARCHAR(20) NOT NULL,
//   menu_id INTEGER NOT NULL,
//   PRIMARY KEY (category_id, menu_id),

//   CONSTRAINT fk_category
//   FOREIGN KEY (category_id)
//   REFERENCES categories (id)
//   ON DELETE CASCADE ON UPDATE CASCADE,

//   CONSTRAINT fk_menu
//   FOREIGN KEY (menu_id)
//   REFERENCES menu (id)
//   ON DELETE CASCADE ON UPDATE CASCADE
@Entity('menu_in_category')
export class MenuInCategory {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  category_id: string;
  @PrimaryColumn('uuid')
  menu_id: string;
}
