import bcrypt, { compare, genSalt } from 'bcrypt';
import { envVars, envVarValue } from '../config/constants/env-constants';
import crypto from 'node:crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CipherAndHashService {
  readonly #WORCK_FACTOR = 10;

  public async createPasswordHashPair(
    newPassword: string,
  ): Promise<{ password: string; salt: string }> {
    const salt = await genSalt(12);
    const preparePassword = await this.preHash(newPassword, salt);

    const password = await this.createHash(preparePassword, this.#WORCK_FACTOR);
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
    workFactor: number | string, // SALT CHAR(31)
  ): Promise<string> {
    return await bcrypt.hash(text, workFactor);
  }

  public async compareHash(text: string, hash: string): Promise<boolean> {
    return compare(text, hash);
  }

  public generateSalt(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  }

  public encryptText(text: string): string {
    const iv = crypto.randomBytes(16);

    const key = Buffer.from(envVarValue[envVars.CIPER_SALT], 'hex');

    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
    const encriypted = Buffer.concat([
      cipher.update(text, 'utf8') as unknown as Uint8Array,
      cipher.final() as unknown as Uint8Array,
    ]);
    return [iv.toString('base64'), encriypted.toString('base64')].join(':');
  }

  public decryptText(encriypted: string): string {
    const [encryptIv, encryptText] = encriypted.split(':');
    const iv = Buffer.from(encryptIv, 'base64');
    const key = Buffer.from(envVarValue[envVars.CIPER_SALT], 'hex');
    const encriypt = Buffer.from(encryptText, 'base64');
    const cipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
    const text = Buffer.concat([
      cipher.update(encriypt) as unknown as Uint8Array,
      cipher.final() as unknown as Uint8Array,
    ]);

    return text.toString('utf8');
  }
}
