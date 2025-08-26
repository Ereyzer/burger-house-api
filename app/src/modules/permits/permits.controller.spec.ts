import { Test, TestingModule } from '@nestjs/testing';
import { PermitsController } from './permits.controller';
import { PermitsService } from './permits.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { MockReposytory } from '../../../test/mock/reposytory';
import { Permit } from './entities/permit.entity';

describe('PermitsController', () => {
  let controller: PermitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule],
      controllers: [PermitsController],
      providers: [
        PermitsService,
        {
          provide: getRepositoryToken(Permit),
          useValue: MockReposytory,
        },
      ],
    }).compile();

    controller = module.get<PermitsController>(PermitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
