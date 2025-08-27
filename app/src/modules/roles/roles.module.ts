import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { PermitInRole } from './entities/permitInRole.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, PermitInRole])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
