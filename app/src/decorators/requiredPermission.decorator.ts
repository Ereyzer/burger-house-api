import { SetMetadata } from '@nestjs/common';
import { PermissionsEnum } from '../enum/permissions.enum';

export const PERMISSION_KEY = 'permissions';

export const RequirePermission = (permission: PermissionsEnum) =>
  SetMetadata(PERMISSION_KEY, permission);
