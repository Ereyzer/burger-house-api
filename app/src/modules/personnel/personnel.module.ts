import { Module } from '@nestjs/common';
import { PersonnelService } from './personnel.service';
import { PersonnelController } from './personnel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Personnel } from './entities/personnel.entity';
import { RolesModule } from '../roles/roles.module';
import { Password } from './entities/password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Personnel, Password]), RolesModule],
  controllers: [PersonnelController],
  providers: [PersonnelService],
})
export class PersonnelModule {}
