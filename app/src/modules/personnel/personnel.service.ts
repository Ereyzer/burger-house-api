import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import {
  UpdatePersonnelDto,
  UpdatePersonnelEmailDto,
  UpdatePersonnelRoleDto,
} from './dto/update-personnel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Personnel } from './entities/personnel.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { RolesService } from '../roles/roles.service';
import { Password } from './entities/password.entity';
import { defaultConstants } from '../../config/constants/default-constants';
import { CipherAndHashService } from '../../services/CipherAndHash.service';

@Injectable()
export class PersonnelService {
  constructor(
    @InjectRepository(Personnel)
    private readonly persnnelRepository: Repository<Personnel>,
    @InjectRepository(Password)
    private readonly passwordRepository: Repository<Password>,
    private readonly roleService: RolesService,
    private readonly cipher: CipherAndHashService,
  ) {}

  async create({ email, password }: CreatePersonnelDto): Promise<Personnel> {
    const userNotExist = !(await this.finOneByEmail(email));

    if (!userNotExist) throw new ConflictException('user already exist');
    const passwordPair = await this.cipher.createPasswordHashPair(password);

    let passwordStorage = this.passwordRepository.create(passwordPair);
    passwordStorage = await this.passwordRepository.save(passwordStorage);

    const newUser = this.persnnelRepository.create({
      email,
      password: passwordStorage,
    });
    try {
      const user = await this.persnnelRepository.save(newUser);
      // TODO: add sending email
      return user;
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findAll() {
    return await this.persnnelRepository.find();
  }

  findOne(id: number) {
    // TODO: next step
    return this.persnnelRepository.findOneBy({ id });
  }

  finOneByEmail(email: string, options: FindOneOptions<Personnel> = {}) {
    return this.persnnelRepository.findOne({ ...options, where: { email } });
  }

  async update(
    id: number,
    { ...updatePersonnel }: UpdatePersonnelDto,
  ): Promise<Personnel> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('user not exist');
    Object.assign(user, updatePersonnel);
    return await this.persnnelRepository.save(user);
  }

  async updateRole(
    id: number,
    { role }: UpdatePersonnelRoleDto,
  ): Promise<void> {
    try {
      await this.persnnelRepository.update(id, { role_id: role });
      return;
    } catch (error) {
      const { code, detail } = error as {
        code: string;
        detail: string;
      } & Error;

      if (
        code === '23505' &&
        detail === 'Key (role_id)=(owner) already exists.'
      ) {
        throw new BadRequestException('can be only one');
      } else throw new InternalServerErrorException('error save');
    }
  }

  updateImage() {}

  async updateEmail({
    email,
    newEmail,
  }: UpdatePersonnelEmailDto): Promise<{ message: string }> {
    const user = await this.finOneByEmail(email);
    if (!user) throw new NotFoundException('email not exist');
    try {
      await this.persnnelRepository.update(
        { id: user.id },
        { email: newEmail },
      );
      return { message: `check your email: ${newEmail}` };
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  updatePassword() {}

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException('user not exist');

    if (user.role_id === defaultConstants.roles.OWNER)
      throw new BadRequestException('you can`t delete owner first change role');

    await this.persnnelRepository.delete(id);

    return `This action removes a #${id} personnel`;
  }
}
