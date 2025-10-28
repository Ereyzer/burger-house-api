import { Module } from '@nestjs/common';
import { PersonnelModule } from './personnel/personnel.module';
import { RouterModule } from '@nestjs/core';
import { PermitsModule } from './permits/permits.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { AboutModule } from './about/about.module';
import { DrinkModule } from './drink/drink.module';
import { DishModule } from './dish/dish.module';
import { CategoriesModule } from './categories/categories.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'admin',
        children: [
          PersonnelModule,
          PermitsModule,
          RolesModule,
          AuthModule,
          AboutModule,
          DrinkModule,
          DishModule,
          CategoriesModule,
          MenuModule,
        ],
      },
    ]),
    PersonnelModule,
    PermitsModule,
    RolesModule,
    AuthModule,
    AboutModule,
    DrinkModule,
    DishModule,
    CategoriesModule,
    MenuModule,
  ],
})
export class AdminModule {}
