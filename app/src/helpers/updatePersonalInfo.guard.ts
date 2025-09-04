import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import Express from 'express';
import { BaseTokenPayload } from '../interface/base-token-payload.interface';

@Injectable()
export class UpdatePersonalInfoGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { params, user }: { user: BaseTokenPayload } & Express.Request =
      context.switchToHttp().getRequest();

    if (user.sub !== params.id) return false;

    return true;
  }
}
