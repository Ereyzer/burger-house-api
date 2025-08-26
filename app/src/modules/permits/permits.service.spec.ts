import { Test, TestingModule } from '@nestjs/testing';
import { PermitsService } from './permits.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permit } from './entities/permit.entity';
import { MockReposytory } from '../../../test/mock/reposytory';

describe('PermitsService', () => {
  let service: PermitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermitsService,
        {
          provide: getRepositoryToken(Permit),
          useValue: MockReposytory,
        },
      ],
    }).compile();

    service = module.get<PermitsService>(PermitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
