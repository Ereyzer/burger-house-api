import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { DataSource, Repository } from 'typeorm';
import { defaultConstants } from '../../config/constants/default-constants';
import { PermitInRole } from './entities/permitInRole.entity';

@Injectable()
export class RolesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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
      throw new InternalServerErrorException();
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
  async update(id: string, { description, permits }: UpdateRoleDto) {
    if (id === defaultConstants.roles.OWNER)
      throw new BadRequestException('you can`t update owner');
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException(`${id} not exist`);
    if (permits) {
      console.log(permits);
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
