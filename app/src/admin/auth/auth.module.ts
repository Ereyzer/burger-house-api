import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PersonnelModule } from '../personnel/personnel.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { CipherAndHashService } from '../../services/CipherAndHash.service';
import { MailerSendService } from '../../services/mailerSendService.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), PersonnelModule],
  controllers: [AuthController],
  providers: [AuthService, CipherAndHashService, MailerSendService],
})
export class AuthModule {}
