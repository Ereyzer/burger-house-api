import { Module } from '@nestjs/common';
import { PersonnelModule } from './personnel/personnel.module';
import { RouterModule } from '@nestjs/core';
import { PermitsModule } from './permits/permits.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { AboutModule } from './about/about.module';
import { DrinkModule } from './drink/drink.module';

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
        ],
      },
    ]),
    PersonnelModule,
    PermitsModule,
    RolesModule,
    AuthModule,
    AboutModule,
    DrinkModule,
  ],
})
export class ModulesModule {}
