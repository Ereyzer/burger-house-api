import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Personnel } from './entities/personnel.entity';
import { Repository } from 'typeorm';
import { RolesService } from '../roles/roles.service';
import { Password } from './entities/password.entity';
import { CipherAndHash } from '../../utils/CipherAndHash';

@Injectable()
export class PersonnelService {
  constructor(
    @InjectRepository(Personnel)
    private readonly persnnelRepository: Repository<Personnel>,
    @InjectRepository(Password)
    private readonly passwordRepository: Repository<Password>,
    private readonly roleService: RolesService,
  ) {}

  async create({
    email,
    password,
  }: CreatePersonnelDto): Promise<{ message: string }> {
    const userNotExist = !(await this.persnnelRepository.findOneBy({ email }));

    if (!userNotExist) throw new ConflictException('user already exist');
    const passwordPair =
      await CipherAndHash.instance.createPasswordHashPair(password);

    let passwordStorage = this.passwordRepository.create(passwordPair);
    passwordStorage = await this.passwordRepository.save(passwordStorage);

    const newUser = this.persnnelRepository.create({
      email,
      password: passwordStorage,
    });

    await this.persnnelRepository.save(newUser);
    // TODO: add sending email
    return { message: `please check email: ${email}` };
  }

  findAll() {
    return this.persnnelRepository.find();
  }

  findOne(id: number) {
    return this.persnnelRepository.findOneBy({ id });
  }

  finOneByEmail(email: string) {
    return this.persnnelRepository.findOneBy({ email });
  }

  async update(
    id: number,
    {
      name,
      surname,
      father_name,
      address,
      phone,
      birthday,
      role,
    }: UpdatePersonnelDto,
  ): Promise<Personnel> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('user not exist');
    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (father_name) user.father_name = father_name;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    if (birthday) user.birthday = birthday;
    if (role) {
      const isRole = await this.roleService.findOneById(role);
      if (!isRole) throw new NotFoundException('role not exist');
      user.role = isRole;
    }
    return this.persnnelRepository.save(user);
  }

  updateImage() {}

  updateEmail() {}

  updatePassword() {}

  async remove(id: number) {
    const user = await this.findOne(id);
    console.log(user);

    // if (user?.role === ) throw new BadRequestException('you can`t delete owner');
    return `This action removes a #${id} personnel`;
  }
}
