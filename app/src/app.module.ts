import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OwnerModule } from './helpers/owner/owner.module';
import { ModulesModule } from './modules/modules.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envVars, envVarValue } from './config/constants/env-constants';
import { Permit } from './modules/permits/entities/permit.entity';
import { Role } from './modules/roles/entities/role.entity';
import { PermitInRole } from './modules/roles/entities/permitInRole.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envVarValue[envVars.DB_HOST],
      port: envVarValue[envVars.DB_PORT],
      username: envVarValue[envVars.DB_USERNAME],
      password: envVarValue[envVars.DB_PASSWORD],
      database: envVarValue[envVars.DB_DATABASE],
      entities: [Permit, Role, PermitInRole],
      synchronize: false,
    }),
    OwnerModule,
    ModulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
