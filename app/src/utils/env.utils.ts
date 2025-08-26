import { ValueIsKey } from '../types/constants';

export const createEnvVars = <T extends Record<string, string>>(
  obj: T & ValueIsKey<T>,
): T => obj;

export function getEnvVars(varName: string): string | never {
  const variable = process.env[varName];
  if (!variable) throw new Error('check Environment vars!');
  return variable;
}
