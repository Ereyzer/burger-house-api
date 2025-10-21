import { Entity } from 'typeorm';
import { Menu } from '../../admin/menu/entities/menu.entity';

@Entity('menu')
export class ClientMenu extends Menu {}
