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
import { Personnel } from './modules/personnel/entities/personnel.entity';
import Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { Password } from './modules/personnel/entities/password.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'prewiev')
          .required(),
        [envVars.DB_DATABASE]: Joi.string().required(),
        [envVars.DB_USERNAME]: Joi.string().required(),
        [envVars.DB_PASSWORD]: Joi.string().required(),
        [envVars.DB_HOST]: Joi.string().required(),
        [envVars.DB_PORT]: Joi.string().required(),
        [envVars.CIPER_SALT]: Joi.string().required(),
        [envVars.PASSWORD_PEPPER]: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envVarValue[envVars.DB_HOST],
      port: envVarValue[envVars.DB_PORT],
      username: envVarValue[envVars.DB_USERNAME],
      password: envVarValue[envVars.DB_PASSWORD],
      database: envVarValue[envVars.DB_DATABASE],
      entities: [Permit, Role, PermitInRole, Personnel, Password],
      synchronize: false,
    }),

    OwnerModule,
    ModulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
