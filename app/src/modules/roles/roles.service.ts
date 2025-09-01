import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { DataSource, Repository } from 'typeorm';
import { defaultConstants } from '../../config/constants/default-constants';
import { PermitInRole } from './entities/permitInRole.entity';
import { Permit } from '../permits/entities/permit.entity';
import { PermitsService } from '../permits/permits.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly permitService: PermitsService,
    @InjectRepository(PermitInRole)
    private readonly permitInRoleRepository: Repository<PermitInRole>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { permits: permitIds = [], ...payload } = createRoleDto;
    const role = await this.findOne(payload.id);
    if (!role) {
      return this.dataSource.transaction(async (manger) => {
        const roleRepo = manger.getRepository(Role);
        const permitInRoleRepo = manger.getRepository(PermitInRole);
        let newRole = roleRepo.create(payload);
        newRole = await roleRepo.save(newRole);
        let savedPermitInRoles: PermitInRole[] = [];
        if (permitIds.length > 0) {
          const permitInRoles = permitIds.map((permit_id) => {
            return permitInRoleRepo.create({ permit_id, role_id: newRole.id });
          });
          savedPermitInRoles = await permitInRoleRepo.save(permitInRoles);
          savedPermitInRoles = await permitInRoleRepo.find({
            relations: {
              permit: true,
            },
            select: {
              permit_id: true,
              permit: {
                display_name: true,
                description: true,
              },
            },
            where: {
              role_id: newRole.id,
            },
          });
        }

        return { ...newRole, permits: savedPermitInRoles };
      });
    } else {
      throw new ConflictException('role is exist');
    }
  }

  findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: {
        permits: {
          permit: true,
        },
      },
      select: {
        permits: {
          permit_id: true,
          permit: {
            display_name: true,
            description: true,
          },
        },
      },
    });
  }

  findOneById(id: string): Promise<Role | null> {
    return this.roleRepository.findOneBy({ id });
  }

  async findOne(
    id: string,
  ): Promise<({ permits: string[] } & Omit<Role, 'permits'>) | undefined> {
    const response = (await this.roleRepository
      .createQueryBuilder('role')
      .innerJoin('role.permits', 'permit', 'permit.role_id = role.id')
      .select(['id', 'display_name', 'description'])
      .addSelect("STRING_AGG(permit.permit_id::text, ',')", 'permits')
      .where('role.id = :id', { id })
      .groupBy('role.id')
      .addGroupBy('role.display_name')
      .addGroupBy('role.description')
      .getRawOne()) as unknown as
      | ({
          permits: string;
        } & Omit<Role, 'permits'>)
      | undefined;
    if (!response) return response;
    return { ...response, permits: response.permits.split(',') };
  }

  // TODO:
  async update(
    id: string,
    { description, permits: newPermits = [] }: UpdateRoleDto,
  ) {
    if (id === defaultConstants.roles.OWNER)
      throw new BadRequestException('you can`t update owner');
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: { permits: true },
    });
    if (!role) throw new NotFoundException(`${id} not exist`);
    let permits: Permit[];
    if (newPermits.length > 0) {
      const isNew = newPermits.filter((permitId) => {
        for (let i = 0; i < role.permits.length; i++) {
          const element = role.permits[i].permit_id;
          if (permitId === element) return false;
        }
        return true;
      });
      if (isNew.length < 1)
        throw new ConflictException('All permissions is added before');

      permits = await this.permitService.findMany(isNew);
      if (permits.length < newPermits.length)
        throw new NotFoundException('some permits not exist');
      let permitsInRole = permits.map((permit) =>
        this.permitInRoleRepository.create({
          permit_id: permit.id,
          role_id: id,
        }),
      );
      permitsInRole = await this.permitInRoleRepository.save(permitsInRole);
      role.permits = [...role.permits, ...permitsInRole];
    }
    if (description) {
      role.description = description;
    }

    return this.roleRepository.save(role);
  }

  remove(id: string) {
    if (id === defaultConstants.roles.OWNER)
      throw new BadRequestException('you can`t delete owner');
    return this.roleRepository.delete(id);
  }
}
