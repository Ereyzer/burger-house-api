import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenJob } from './tokenJob';
import { Socket } from 'socket.io';
import { BaseTokenPayload } from '../interface/base-token-payload.interface';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly tokenJob: TokenJob = TokenJob.instance;

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>();

    const token = this.extractTikenFromHeader(client);
    if (!token) throw new UnauthorizedException('No token provided');
    try {
      const payload = this.tokenJob.check(token);

      (client as { user: BaseTokenPayload } & Socket)['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTikenFromHeader(client: Socket): string | undefined {
    const [type, token] =
      client.handshake.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
