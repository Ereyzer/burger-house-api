import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockReposytory } from '../../../../test/mock/reposytory';
import { PermitsService } from '../permits.service';
import { Permit } from '../entities/permit.entity';
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
