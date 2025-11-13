import { Test, TestingModule } from '@nestjs/testing';
import { CipherAndHashService } from '../CipherAndHash.service';

jest.mock('../../config/constants/env-constants', () => ({
  envVarValue: {
    PASSWORD_PEPPER: 'my-test-secret-pepper-for-tests',
    CIPER_SALT:
      '5a5248f30b9817ed7c16e86528754e1ddc0d4446cfeb015e2cb6f31bb11c27fd',
  },
  envVars: {
    PASSWORD_PEPPER: 'PASSWORD_PEPPER',
    CIPER_SALT: 'CIPER_SALT',
  },
}));

describe('paranoic', () => {
  let service: CipherAndHashService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CipherAndHashService],
    }).compile();
    service = module.get<CipherAndHashService>(CipherAndHashService);
  });

  describe('service defined', () => {
    it('should be defined', async () => {
      expect(service).toBeDefined();
      const hash = await service.createHash('lckquvdsivwiudnscoweidsm', 10);
      console.log(hash);
      console.log(hash.slice(-31));
      console.log(hash.slice(0, 29));
      console.log(service.generateSalt(32));
    });
  });

  describe('Password Hashing and Checking', () => {
    const password = 'testPAssword123';
    it('should create a valid hash and correctly verify it', async () => {
      const hash = await service.createHash(password, 10);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(60);
      const isMatch = await service.compareHash(password, hash);
      expect(isMatch).toBe(true);
    });
    it('should create random bites expectly length', () => {
      const random = service.generateSalt(5);
      expect(typeof random).toBe('string');
      expect(random.length).toBe(10);
      expect(service.generateSalt(12).length).toBe(24);
      expect(service.generateSalt(16).length).toBe(32);
    });

    it('should create a valid hash and correctly verify it', async () => {
      const storedHash = await service.createPasswordHashPair(password);
      expect(storedHash).toBeDefined();
      expect(typeof storedHash).toBe('object');
      expect(storedHash.password).toBeDefined();
      expect(typeof storedHash.password).toBe('string');
      expect(storedHash.salt).toBeDefined();
      expect(typeof storedHash.salt).toBe('string');
      expect(storedHash.password.length).toBe(60);
      expect(storedHash.salt.length).toBe(29);

      const isMatch = await service.checkPassword(password, storedHash);
      expect(isMatch).toBe(true);
    });
    it('should return false for an incorrect password', async () => {
      const incorrectPassword = 'wrongPassword';
      const hashedPassword = await service.createPasswordHashPair(password);
      const isMatch = await service.checkPassword(
        incorrectPassword,
        hashedPassword,
      );
      expect(isMatch).toBe(false);
    });
  });

  describe('text encrypting and decrypting', () => {
    const text = 'some text';

    it('encrypt text', () => {
      const encryptText = service.encryptText(text);

      expect(typeof encryptText).toBe('string');
      const decryptText = service.decryptText(encryptText);

      expect(typeof decryptText).toBe('string');

      expect(decryptText === text).toBe(true);
    });
  });
});
