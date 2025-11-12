import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envVars, envVarValue } from './config/constants/env-constants';
import { Permit } from './admin/permits/entities/permit.entity';
import { Role } from './admin/roles/entities/role.entity';
import { PermitInRole } from './admin/roles/entities/permitInRole.entity';
import { Personnel } from './admin/personnel/entities/personnel.entity';
import Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { Password } from './admin/personnel/entities/password.entity';
import { Session } from './admin/auth/entities/session.entity';
import { About } from './admin/about/entities/about.entity';
import { Drink } from './admin/drink/entities/drink.entity';
import { Dish } from './admin/dish/entities/dish.entity';
import { Category } from './admin/categories/entities/category.entity';
import { Menu } from './admin/menu/entities/menu.entity';
import { MenuInCategory } from './admin/menu/entities/menu-in-category.entity';
import { DrinkInMenu } from './admin/menu/entities/drink-in-menu.entity';
import { DishInMenu } from './admin/menu/entities/dish-in-menu.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ClientModule } from './client/client.module';
import { ClientMenu } from './client/entities/clientMenu.entity';
import { AdminModule } from './admin/admin.module';
import { Order } from './modules/orders/entities/order.entity';
import { MenuItemInOrder } from './modules/orders/entities/menuItemInOrder.entity';
import { CustomerOrderPhoneEntity } from './modules/orders/entities/customerOrderPhone.entity';
import { ModulesModule } from './modules/modules.module';
import { OpeningHour } from './admin/about/entities/openingTime.entity';
import { DeliveryPrices } from './admin/about/entities/deliveryPrices.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'prewiev')
          .required(),
        [envVars.DB_DATABASE]: Joi.string().required(),
        [envVars.DB_USERNAME]: Joi.string().required(),
        ...(envVarValue.NODE_ENV !== 'development'
          ? {
              [envVars.DB_PASSWORD]: Joi.string().required(),
            }
          : {}),
        [envVars.DB_HOST]: Joi.string().required(),
        [envVars.DB_PORT]: Joi.string().required(),
        [envVars.CIPER_SALT]: Joi.string().required(),
        [envVars.PASSWORD_PEPPER]: Joi.string().required(),
        [envVars.JWT_SECRET_KEY]: Joi.string().required(),
        [envVars.MAILER_SEND_TOKEN]: Joi.string().required(),
        [envVars.GOOGLE_MAPS_KEY]: Joi.string().required(),
        [envVars.PHONE_SALT]: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'cockroachdb',
      host: envVarValue[envVars.DB_HOST],
      port: envVarValue[envVars.DB_PORT],
      username: envVarValue[envVars.DB_USERNAME],
      password: envVarValue[envVars.DB_PASSWORD],
      database: envVarValue[envVars.DB_DATABASE],
      ssl:
        envVarValue[envVars.NODE_ENV] !== 'development'
          ? { rejectUnauthorized: true }
          : false,
      entities: [
        Permit,
        Role,
        PermitInRole,
        Personnel,
        Password,
        Session,
        About,
        Drink,
        Dish,
        Category,
        Menu,
        MenuInCategory,
        DrinkInMenu,
        DishInMenu,
        ClientMenu,
        Order,
        MenuItemInOrder,
        CustomerOrderPhoneEntity,
        OpeningHour,
        DeliveryPrices,
      ],
      synchronize: false,
      retryAttempts: 10,
      retryDelay: 5000,
    }),
    AdminModule,
    CloudinaryModule,
    ClientModule,
    ModulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
