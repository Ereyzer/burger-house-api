import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { CategoriesModule } from '../categories/categories.module';
import { MenuInCategory } from './entities/menu-in-category.entity';
import { DrinkInMenu } from './entities/drink-in-menu.entity';
import { DrinkModule } from '../drink/drink.module';
import { DishInMenu } from './entities/dish-in-menu.entity';
import { DishModule } from '../dish/dish.module';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu, MenuInCategory, DrinkInMenu, DishInMenu]),
    CategoriesModule,
    DrinkModule,
    DishModule,
    CloudinaryModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
