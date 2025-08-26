import { Module } from '@nestjs/common';
import { PersonnelModule } from './personnel/personnel.module';
import { RouterModule } from '@nestjs/core';
import { PermitsModule } from './permits/permits.module';

@Module({
  imports: [
    PersonnelModule,
    PermitsModule,
    RouterModule.register([
      {
        path: 'admin',
        module: PersonnelModule,
      },
      {
        path: 'admin',
        module: PermitsModule,
      },
    ]),
  ],
})
export class ModulesModule {}
