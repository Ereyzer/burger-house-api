import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAuthDto } from './dto/signIn-auth.dto';
import { PersonnelService } from '../personnel/personnel.service';
import { CipherAndHashService } from '../../services/CipherAndHash.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { LessThan, Repository } from 'typeorm';
import { TokenPayloadEnum } from '../../enum/token-payload.enum';
import { defaultConstants } from '../../config/constants/default-constants';
import { TokenJob } from '../../helpers/tokenJob';
import { MailerSendService } from '../../services/mailerSendService.service';
import { BaseTokenPayload } from '../../interface/base-token-payload.interface';

@Injectable()
export class AuthService {
  private readonly tokenJob: TokenJob = TokenJob.instance;
  constructor(
    private readonly personnelService: PersonnelService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly cipher: CipherAndHashService,
    private readonly mailerSend: MailerSendService,
  ) {}

  async signIn({ email, password }: LoginAuthDto) {
    const user = await this.personnelService.finOneByEmail(email, {
      relations: {
        password: true,
      },
      select: {
        id: true,
        password: true,
        role_id: true,
        name: true,
        surname: true,
        father_name: true,
        picture: true,
      },
    });
    if (!user) throw new UnauthorizedException();
    if (!(await this.cipher.checkPassword(password, user.password)))
      throw new UnauthorizedException();

    const sas = this.cipher.generateSalt(16);
    const at = this.tokenJob.createJwtToken({
      sub: user.id,
      tokenType: TokenPayloadEnum.ACCESS,
      role: user.role_id || undefined,
      secret: sas,
    });
    const srs = this.cipher.generateSalt(16);
    const rt = this.tokenJob.createJwtToken({
      sub: user.id,
      tokenType: TokenPayloadEnum.REFRESH,
      role: user.role_id || undefined,
      secret: srs,
    });

    const session = this.sessionRepository.create({
      sas,
      srs,
      personnel_id: user.id,
    });

    try {
      await this.sessionRepository.save(session);

      return {
        at,
        rt,
        user: {
          firstName: user.name,
          fatherName: user.father_name,
          LastName: user.surname,
          picture: user.picture,
        },
      };
    } catch {
      throw new InternalServerErrorException('no here');
    }
  }

  async getLoggetUser(id: number) {
    const user = await this.personnelService.findOne(id);
    if (!user) throw new UnauthorizedException();
    return {
      firstName: user.name,
      fatherName: user.father_name,
      LastName: user.surname,
      picture: user.picture,
    };
  }
  async refresh(at: string, rt: string) {
    const refresh = this.tokenJob.check(rt);

    const access = this.tokenJob.decode(at);

    const session = await this.sessionRepository.findOne({
      where: {
        sas: access.s,
        srs: refresh.s,
      },
      relations: {
        personnel: true,
      },
    });
    if (!session) throw new ForbiddenException('token forbidden');

    const sas = this.cipher.generateSalt(16);
    at = this.tokenJob.createJwtToken({
      sub: refresh.sub,
      tokenType: TokenPayloadEnum.ACCESS,
      secret: sas,
      role: session.personnel.role_id || undefined,
    });
    const srs = this.cipher.generateSalt(16);
    rt = this.tokenJob.createJwtToken({
      sub: refresh.sub,
      tokenType: TokenPayloadEnum.REFRESH,
      secret: srs,
      role: session.personnel.role_id || undefined,
    });

    try {
      await this.sessionRepository.update(session.id, { sas, srs });

      return {
        at,
        rt,
        user: {
          firstName: session.personnel.name,
          fatherName: session.personnel.father_name,
          LastName: session.personnel.surname,
          picture: session.personnel.picture,
        },
      };
    } catch {
      throw new ForbiddenException();
    }
  }

  clearExpired(): void {
    this.sessionRepository
      .delete({
        updated_at: LessThan(
          new Date(Date.now() - defaultConstants.time.ONE_DAY),
        ),
      })
      .catch(() => {});
  }

  async logout(at: string, rt: string): Promise<void> {
    try {
      const { s: sas, sub } = this.tokenJob.decode(at);
      const { s: srs } = this.tokenJob.decode(rt);
      await this.sessionRepository.delete({
        sas,
        srs,
        personnel_id: Number(sub),
      });

      return;
    } catch {
      return;
    }
  }

  async checkIfFirstTime(): Promise<boolean> {
    const users = await this.personnelService.findAll();
    if (!users || users.length === 0) return true;
    return false;
  }

  async createOwner({ email, password }: LoginAuthDto): Promise<string> {
    const user = await this.personnelService.create({ email, password });
    if (!user) throw new InternalServerErrorException();
    console.log(user);
    const secret = this.cipher.generateSalt(16);
    const token = this.tokenJob.createJwtToken({
      sub: user.id,
      secret,
      role: defaultConstants.roles.OWNER,
      tokenType: TokenPayloadEnum.VERIFY,
    });

    try {
      await this.personnelService.updateRole(user.id, {
        role: defaultConstants.roles.OWNER,
      });

      await this.mailerSend.sendVereficationEmail(email, token);

      return 'You is owner now, check your email';
    } catch {
      await this.personnelService.remove(user.id);
      throw new InternalServerErrorException();
    }
  }

  removeUserSessions(id: number) {
    return this.sessionRepository.delete({ personnel_id: id });
  }

  async verifyEmail(payload: BaseTokenPayload) {
    const isVerified = await this.personnelService.findOne(+payload.sub);

    if (isVerified?.verified)
      throw new BadRequestException('Your verefication is succes');

    try {
      await this.personnelService.update(+payload.sub, {
        verified: true,
      });
      return true;
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
