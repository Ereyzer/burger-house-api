import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import Express from 'express';

export const Cookie = createParamDecorator(
  (data: string, ctx: ExecutionContext): Record<string, string> | string => {
    const req: Express.Request = ctx.switchToHttp().getRequest();
    return data ? (req.cookies?.[data] as string) : req.cookies;
  },
);
