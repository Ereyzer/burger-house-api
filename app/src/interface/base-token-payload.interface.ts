import { TokenPayloadEnum } from '../enum/token-payload.enum';

export interface BaseTokenPayload {
  sub: string;
  role: string;
  t: TokenPayloadEnum;
  s: string;
}
