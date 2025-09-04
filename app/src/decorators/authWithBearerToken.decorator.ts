import {
  applyDecorators,
  ForbiddenException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../helpers/token.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PermissionsGuard } from '../helpers/permissions.guard';

export function AuthWithBearerToken() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'UNAUTHORIZED',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: ForbiddenException.name,
    }),
    UseGuards(AuthGuard),
    UseGuards(PermissionsGuard),
  );
}
