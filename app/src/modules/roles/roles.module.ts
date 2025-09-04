import { Global, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { PermitInRole } from './entities/permitInRole.entity';
import { PermitsModule } from '../permits/permits.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Role, PermitInRole]), PermitsModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
