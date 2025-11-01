import { ForbiddenException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

import { BaseTokenPayload } from '../interface/base-token-payload.interface';
import { TokenPayloadEnum } from '../enum/token-payload.enum';
import { envVars, envVarValue } from '../config/constants/env-constants';
import { defaultConstants } from '../config/constants/default-constants';

export class TokenJob {
  readonly #JWT_KEY: string = envVarValue[envVars.JWT_SECRET_KEY];
  static #instance: TokenJob | undefined;

  private constructor() {}

  public static get instance() {
    if (!TokenJob.#instance) {
      TokenJob.#instance = new TokenJob();
    }
    return TokenJob.#instance;
  }

  createJwtToken({
    sub,
    secret = '',
    tokenType = TokenPayloadEnum.ACCESS,
    role = '',
  }: {
    sub: number | string;
    secret?: string;
    tokenType?: TokenPayloadEnum;
    role?: string;
  }) {
    const tokenBody: BaseTokenPayload = {
      sub: sub.toString(),
      role,
      t: tokenType,
      s: secret,
    };

    let expiresIn: number | undefined;
    switch (tokenType) {
      case TokenPayloadEnum.ACCESS:
        // expiresIn = 120;
        expiresIn = defaultConstants.time.FIFTEEN_MINUTES / 1000;
        break;

      case TokenPayloadEnum.REFRESH:
        expiresIn = defaultConstants.time.ONE_DAY / 1000;
        break;

      case TokenPayloadEnum.TEST:
        expiresIn = 3;
        break;

      default:
        expiresIn = undefined;
        break;
    }

    return jwt.sign(tokenBody, this.#JWT_KEY, {
      algorithm: 'HS512',
      expiresIn,
    });
  }

  check(token: string): BaseTokenPayload {
    try {
      return jwt.verify(token, this.#JWT_KEY) as unknown as BaseTokenPayload;
    } catch (error) {
      const er = error as Error;
      if (er.name === jwt.TokenExpiredError.name) {
        throw new ForbiddenException(jwt.TokenExpiredError.name);
      } else {
        throw new ForbiddenException('token forbidden');
      }
    }
  }

  decode(token: string): BaseTokenPayload {
    try {
      return jwt.decode(token) as unknown as BaseTokenPayload;
    } catch {
      throw new ForbiddenException('token forbidden');
    }
  }
}
