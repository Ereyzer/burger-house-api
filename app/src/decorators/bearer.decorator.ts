import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import Express from 'express';

export const Bearer = createParamDecorator(
  (data: string, ctx: ExecutionContext): string => {
    const req: Express.Request = ctx.switchToHttp().getRequest();
    const bearer = req.headers.authorization;
    if (!bearer) throw new UnauthorizedException('Bearer is required');
    return bearer.split(' ')[1];
  },
);
