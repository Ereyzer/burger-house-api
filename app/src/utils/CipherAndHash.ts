import bcrypt, { compare, genSalt } from 'bcrypt';
import { envVars, envVarValue } from '../config/constants/env-constants';
import { randomBytes } from 'crypto';

export class CipherAndHash {
  static #inctance: CipherAndHash | null = null;
  readonly #WORCK_FACTOR = 10;

  private constructor() {}

  public static get instance(): CipherAndHash {
    if (!CipherAndHash.#inctance) {
      CipherAndHash.#inctance = new CipherAndHash();
    }

    return CipherAndHash.#inctance;
  }

  public async createPasswordHashPair(
    newPassword: string,
  ): Promise<{ password: string; salt: string }> {
    const salt = await genSalt(12);
    const preparePassword = await this.preHash(newPassword, salt);

    const password = await CipherAndHash.instance.createHash(
      preparePassword,
      this.#WORCK_FACTOR,
    );
    return { password, salt };
  }

  private async preHash(password: string, salt: string): Promise<string> {
    return this.createHash(this.pepperingPassword(password), salt).then(
      (result) => result.slice(-31),
    );
  }

  private pepperingPassword(password: string) {
    return password + envVarValue[envVars.PASSWORD_PEPPER];
  }

  public async checkPassword(
    openPassword: string,
    closepassword: { password: string; salt: string },
  ): Promise<boolean> {
    const preparePassword = await this.preHash(
      openPassword,
      closepassword.salt,
    );

    return this.compareHash(preparePassword, closepassword.password);
  }

  public async createHash(
    text: string,
    workFactor: number | string,
  ): Promise<string> {
    return await bcrypt.hash(text, workFactor);
  }

  public async compareHash(text: string, hash: string): Promise<boolean> {
    return compare(text, hash);
  }

  public generateSalt(length: number): string {
    return randomBytes(length).toString('hex');
  }
}
