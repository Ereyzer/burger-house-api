import { Entity } from 'typeorm';
import { About } from '../../admin/about/entities/about.entity';

@Entity('about')
export class ClientAboutPlace extends About {}
