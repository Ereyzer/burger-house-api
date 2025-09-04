import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenJob } from './tokenJob';
import Express from 'express';
import { BaseTokenPayload } from '../interface/base-token-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly tokenJob: TokenJob = TokenJob.instance;

  canActivate(context: ExecutionContext): boolean {
    const request: Express.Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();
    try {
      const payload = this.tokenJob.check(token);

      (request as { user: BaseTokenPayload } & Express.Request)['user'] =
        payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Express.Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
