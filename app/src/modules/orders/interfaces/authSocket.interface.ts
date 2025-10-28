import { Socket } from 'socket.io';
import { BaseTokenPayload } from '../../../interface/base-token-payload.interface';
import { PermissionsEnum } from '../../../enum/permissions.enum';

export interface AuthenticatedSocket extends Socket {
  user: { permits: PermissionsEnum[]; exp?: string } & BaseTokenPayload;
}
