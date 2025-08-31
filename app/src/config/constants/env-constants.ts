import { createEnvVars, getEnvVars } from '../../utils/env.utils';

export const envVars = createEnvVars({
  DB_HOST: 'DB_HOST',
  DB_PORT: 'DB_PORT',
  DB_USERNAME: 'DB_USERNAME',
  DB_PASSWORD: 'DB_PASSWORD',
  DB_DATABASE: 'DB_DATABASE',
  APP_PORT: 'APP_PORT',
  SALT_ROUNDS: 'SALT_ROUNDS',
  CIPER_SALT: 'CIPER_SALT',
  CIPER_BITES: 'CIPER_BITES',
  CIPER_ALGORITHM: 'CIPER_ALGORITHM',
  PASSWORD_PEPPER: 'PASSWORD_PEPPER',
});

export const envVarValue = {
  [envVars.APP_PORT]: Number(getEnvVars(envVars.APP_PORT)),
  [envVars.DB_HOST]: getEnvVars(envVars.DB_HOST),
  [envVars.DB_PORT]: Number(getEnvVars(envVars.DB_PORT)),
  [envVars.DB_USERNAME]: getEnvVars(envVars.DB_USERNAME),
  [envVars.DB_PASSWORD]: getEnvVars(envVars.DB_PASSWORD),
  [envVars.DB_DATABASE]: getEnvVars(envVars.DB_DATABASE),
  [envVars.SALT_ROUNDS]: Number(getEnvVars(envVars.SALT_ROUNDS)),
  [envVars.PASSWORD_PEPPER]: getEnvVars(envVars.PASSWORD_PEPPER),
};
