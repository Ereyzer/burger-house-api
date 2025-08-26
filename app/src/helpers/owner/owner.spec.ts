import { Test, TestingModule } from '@nestjs/testing';
import { Owner } from './owner';

describe('Owner', () => {
  let provider: Owner;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Owner],
    }).compile();

    provider = module.get<Owner>(Owner);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
