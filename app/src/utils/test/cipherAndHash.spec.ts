import { CipherAndHash } from '../CipherAndHash';

jest.mock('../../config/constants/env-constants', () => ({
  envVarValue: {
    PASSWORD_PEPPER: 'my-test-secret-pepper-for-tests',
  },
  envVars: { PASSWORD_PEPPER: 'PASSWORD_PEPPER' },
}));

describe('paranoic', () => {
  let instance: CipherAndHash;

  beforeAll(() => {
    instance = CipherAndHash.instance;
  });

  describe('Singleton Pattern', () => {
    it('should be defined', () => {
      expect(instance).toBeDefined();
    });

    it('should return a single instance', () => {
      // check if return the same instance
      const secondInstance = CipherAndHash.instance;
      expect(instance).toBe(secondInstance);
    });
  });

  describe('Password Hashing and Checking', () => {
    const password = 'testPAssword123';
    it('should create a valid hash and correctly verify it', async () => {
      const hash = await instance.createHash(password, 10);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(60);
      const isMatch = await instance.compareHash(password, hash);
      expect(isMatch).toBe(true);
    });
    it('should create random bites expectly length', () => {
      const random = instance.generateSalt(5);
      expect(typeof random).toBe('string');
      expect(random.length).toBe(10);
      expect(instance.generateSalt(12).length).toBe(24);
      expect(instance.generateSalt(16).length).toBe(32);
    });

    it('should create a valid hash and correctly verify it', async () => {
      const storedHash = await instance.createPasswordHashPair(password);
      expect(storedHash).toBeDefined();
      expect(typeof storedHash).toBe('object');
      expect(storedHash.password).toBeDefined();
      expect(typeof storedHash.password).toBe('string');
      expect(storedHash.salt).toBeDefined();
      expect(typeof storedHash.salt).toBe('string');
      expect(storedHash.password.length).toBe(60);
      expect(storedHash.salt.length).toBe(29);

      const isMatch = await instance.checkPassword(password, storedHash);
      expect(isMatch).toBe(true);
    });
    it('should return false for an incorrect password', async () => {
      const incorrectPassword = 'wrongPassword';
      const hashedPassword = await instance.createPasswordHashPair(password);
      const isMatch = await instance.checkPassword(
        incorrectPassword,
        hashedPassword,
      );
      expect(isMatch).toBe(false);
    });
  });
});
