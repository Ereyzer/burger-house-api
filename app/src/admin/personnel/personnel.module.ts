import { Module } from '@nestjs/common';
import { PersonnelService } from './personnel.service';
import { PersonnelController } from './personnel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Personnel } from './entities/personnel.entity';
import { RolesModule } from '../roles/roles.module';
import { Password } from './entities/password.entity';
import { PersonnelSubscriber } from './subscriber/personnel.subscriber';
import { CipherAndHashService } from '../../services/CipherAndHash.service';

@Module({
  imports: [TypeOrmModule.forFeature([Personnel, Password]), RolesModule],
  controllers: [PersonnelController],
  providers: [PersonnelService, PersonnelSubscriber, CipherAndHashService],
  exports: [PersonnelService],
})
export class PersonnelModule {}
