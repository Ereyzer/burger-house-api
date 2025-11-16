import { Entity, PrimaryColumn } from 'typeorm';

// CREATE TABLE IF NOT EXISTS drinks_in_menu (
//   drink_id INTEGER NOT NULL,
//   menu_id INTEGER NOT NULL,
//   PRIMARY KEY (drink_id, menu_id),

//   CONSTRAINT fk_drink
//   FOREIGN KEY (drink_id)
//   REFERENCES drinks (id)
//   ON DELETE CASCADE ON UPDATE CASCADE,

//   CONSTRAINT fk_menu
//   FOREIGN KEY (menu_id)
//   REFERENCES menu (id)
//   ON DELETE CASCADE ON UPDATE CASCADE
// );
@Entity('drinks_in_menu')
export class DrinkInMenu {
  @PrimaryColumn('uuid')
  drink_id: string;

  @PrimaryColumn('uuid')
  menu_id: string;
}
