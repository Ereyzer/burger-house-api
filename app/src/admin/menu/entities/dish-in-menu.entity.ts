import { Entity, PrimaryColumn } from 'typeorm';

@Entity('dishes_in_menu')
export class DishInMenu {
  @PrimaryColumn('uuid')
  menu_id: string;
  @PrimaryColumn('uuid')
  dish_id: string;
}
