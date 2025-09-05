import { Module } from '@nestjs/common';
import { PersonnelModule } from './personnel/personnel.module';
import { RouterModule } from '@nestjs/core';
import { PermitsModule } from './permits/permits.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { AboutModule } from './about/about.module';

@Module({
  imports: [
    PersonnelModule,
    PermitsModule,
    RolesModule,
    AuthModule,
    RouterModule.register([
      {
        path: 'admin',
        children: [
          PersonnelModule,
          PermitsModule,
          RolesModule,
          AuthModule,
          AboutModule,
        ],
      },
    ]),
    AboutModule,
  ],
})
export class ModulesModule {}
