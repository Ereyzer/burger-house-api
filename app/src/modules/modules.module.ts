import { Module } from '@nestjs/common';
import { PersonnelModule } from './personnel/personnel.module';
import { RouterModule } from '@nestjs/core';
import { PermitsModule } from './permits/permits.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    PersonnelModule,
    PermitsModule,
    RolesModule,
    RouterModule.register([
      {
        path: 'admin',
        module: PersonnelModule,
      },
      {
        path: 'admin',
        module: PermitsModule,
      },
      {
        path: 'admin',
        module: RolesModule,
      },
    ]),
  ],
})
export class ModulesModule {}
