import { Test, TestingModule } from '@nestjs/testing';
import { PersonnelService } from '../personnel.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Personnel } from '../entities/personnel.entity';
import { MockReposytory } from '../../../../test/mock/reposytory';

describe('PersonnelService', () => {
  let service: PersonnelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonnelService,
        {
          provide: getRepositoryToken(Personnel),
          useValue: MockReposytory,
        },
      ],
    }).compile();

    service = module.get<PersonnelService>(PersonnelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
