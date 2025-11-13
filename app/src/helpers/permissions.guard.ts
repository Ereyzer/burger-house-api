import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/requiredPermission.decorator';
import { PermissionsEnum } from '../enum/permissions.enum';
import Express from 'express';
import { BaseTokenPayload } from '../interface/base-token-payload.interface';
import { RolesService } from '../admin/roles/roles.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission =
      this.reflector.getAllAndOverride<PermissionsEnum>(PERMISSION_KEY, [
        context.getClass(),
        context.getHandler(),
      ]);

    if (!requiredPermission) return true;
    const { user }: { user: BaseTokenPayload } & Express.Request = context
      .switchToHttp()
      .getRequest();

    if (!user.role)
      throw new ForbiddenException('plese ask yor manager about your role');

    if (!user.role)
      throw new ForbiddenException('your role does not have prmits');
    const isPermit = await this.roleService.checkPermitInRole(
      user.role,
      requiredPermission,
    );
    if (!isPermit) throw new ForbiddenException();

    return true;
  }
}
