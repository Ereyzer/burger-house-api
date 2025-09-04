import { TokenPayloadEnum } from '../../enum/token-payload.enum';
import { ForbiddenException } from '@nestjs/common';
import { TokenJob } from '../tokenJob';

jest.mock('../../config/constants/env-constants', () => ({
  envVarValue: {
    JWT_SECRET_KEY: 'werylongjwtkeyforcreatetken',
  },
  envVars: {
    JWT_SECRET_KEY: 'JWT_SECRET_KEY',
  },
}));

describe('token job service', () => {
  let instance: TokenJob;

  beforeAll(() => {
    instance = TokenJob.instance;
  });

  describe('Singleton Pattern', () => {
    it('should always return the same instance', () => {
      expect(instance).toBeDefined();
      const second = TokenJob.instance;
      expect(instance).toBe(second);
    });
  });
  describe('create and test token', () => {
    let token: string;
    const userId = 1;
    const secret = '7f53e8554478a2e242d95a33f05650d5';
    it('create token', () => {
      token = instance.createJwtToken({
        sub: userId,
        secret,
        tokenType: TokenPayloadEnum.TEST,
      });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('check token', () => {
      const payload = instance.check(token);

      expect(payload).toBeDefined();
      expect(typeof payload).toBe('object');
      expect(payload.s).toBe(secret);
      expect(typeof payload.sub).toBe('string');
    });

    it('expired token', async () => {
      const promise: Promise<string> = new Promise(function (resolve) {
        setTimeout(() => {
          return resolve(token);
        }, 4000);
      });
      const expiredToken = await promise.then((res) => {
        return res;
      });
      expect(() => instance.check(expiredToken)).toThrow(ForbiddenException);
      expect(instance.decode(token)).toBeDefined();
    });

    const expiredToken =
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6IiIsIdQiOiJhdCIsInMiOiI3ZjUzZTg1NTQ0NzhhMmUyNDJkOTVhMzNmMDU2NTBkNSIsImlhdCI6MTc1NjgyNDU3MSwiZXhwIjoxNzU2ODI1NDcxfQ.idzf0P0eAzklvCDnJ0gOc5BKjGNJvVyt-UcX6Q8IGQZbn-6uLQXuo7yv0-5kf0cukUHhb3-3CZuvw9D6ydyM-w';

    it('forbidden token', () => {
      expect(() => instance.check(expiredToken)).toThrow('token forbidden');
      expect(() => instance.decode(expiredToken)).toThrow(ForbiddenException);
    });
  });
});
