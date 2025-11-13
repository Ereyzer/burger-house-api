import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import Express from 'express';
import { TokenJob } from './tokenJob';
import { Observable } from 'rxjs';
import { BaseTokenPayload } from '../interface/base-token-payload.interface';

@Injectable()
export class VerifyTokenGuard implements CanActivate {
  private readonly tokenJob: TokenJob;

  constructor() {
    this.tokenJob = TokenJob.instance;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Express.Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromParam(request);

    if (!token) throw new BadRequestException('Wrong url');

    try {
      const payload = this.tokenJob.check(token);
      (request as { user: BaseTokenPayload } & Express.Request)['user'] =
        payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromParam(request: Express.Request): string | undefined {
    const token = request.params.token;
    return token;
  }
}
