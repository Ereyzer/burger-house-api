import { Test, TestingModule } from '@nestjs/testing';
import { PersonnelController } from '../personnel.controller';
import { PersonnelService } from '../personnel.service';
import { Personnel } from '../entities/personnel.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockReposytory } from '../../../../test/mock/reposytory';

describe('PersonnelController', () => {
  let controller: PersonnelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonnelController],
      providers: [
        PersonnelService,
        {
          provide: getRepositoryToken(Personnel),
          useValue: MockReposytory,
        },
      ],
    }).compile();

    controller = module.get<PersonnelController>(PersonnelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
