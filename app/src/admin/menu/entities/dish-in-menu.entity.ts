import { Entity, PrimaryColumn } from 'typeorm';

@Entity('dishes_in_menu')
export class DishInMenu {
  @PrimaryColumn('integer')
  menu_id: number;
  @PrimaryColumn('integer')
  dish_id: number;
}
