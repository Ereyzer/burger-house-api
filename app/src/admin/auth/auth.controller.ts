import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/signIn-auth.dto';
import Express from 'express';
import { Cookie } from '../../decorators/cookie.decorator';
import { defaultConstants } from '../../config/constants/default-constants';
import { envVars, envVarValue } from '../../config/constants/env-constants';
import { Bearer } from '../../decorators/bearer.decorator';
import { ApiCookieAuth } from '@nestjs/swagger';
import { AuthWithBearerToken } from '../../decorators/authWithBearerToken.decorator';
import { BaseTokenPayload } from '../../interface/base-token-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(
    @Body() loginDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Express.Response,
  ) {
    const { at, rt, user } = await this.authService.signIn(loginDto);
    res.cookie('rt', rt, {
      httpOnly: true,
      secure: true,
      maxAge: defaultConstants.time.ONE_DAY,
      sameSite: envVarValue[envVars.NODE_ENV] ? 'none' : 'lax',
    });
    return { at, user };
  }

  @Get('login')
  @AuthWithBearerToken()
  getLoggetUser(@Req() req: { user: BaseTokenPayload } & Express.Request) {
    return this.authService.getLoggetUser(+req.user.sub);
  }

  @ApiCookieAuth()
  @Get('refresh')
  async refresh(
    @Bearer('at') oldAt: string,
    @Cookie('rt') oldRt: string,
    @Res({ passthrough: true }) res: Express.Response,
  ) {
    const { at, rt, user } = await this.authService.refresh(oldAt, oldRt);

    res.cookie('rt', rt, {
      httpOnly: true,
      secure: true,
      maxAge: defaultConstants.time.ONE_DAY,
      sameSite: envVarValue[envVars.NODE_ENV] ? 'none' : 'lax',
    });
    return { at, user };
  }

  @ApiCookieAuth()
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Bearer('at') at: string,
    @Cookie('rt') rt: string,
    @Res({ passthrough: true }) req: Express.Response,
  ) {
    req.clearCookie('rt');
    await this.authService.logout(at, rt);

    return;
  }

  @Get('register/owner')
  async registerOwnerPage(@Res() res: Express.Response) {
    const root = './src/public';
    if (await this.authService.checkIfFirstTime())
      return res.sendFile('register-owner.html', { root });
    return res.sendFile('nice-try.html', { root });
  }

  @Get('register/create/owner')
  createOwner(@Query() query: LoginAuthDto) {
    return this.authService.createOwner(query);
  }
}
