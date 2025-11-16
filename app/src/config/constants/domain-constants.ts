import { getEnvVars } from '../../utils/env.utils';
import { envVars, envVarValue } from './env-constants';

export const domains = () => {
  const domains: {
    ADMIN: string[];
    CLIENT: string[];
    API: string;
  } = {
    ADMIN: [],
    CLIENT: [],
    API: '',
  };
  switch (envVarValue[envVars.NODE_ENV]) {
    case 'development':
      domains.ADMIN = ['http://localhost:3001', 'http://192.168.0.106:3001'];
      domains.CLIENT = ['http://localhost:3002', 'http://192.168.0.106:3002'];
      domains.API = 'http://localhost:3000';
      break;
    case 'production':
      domains.ADMIN = [getEnvVars(envVars.DOMAIN_ADMIN)];
      domains.CLIENT = ['http://localhost:3002'];
      domains.API = getEnvVars(envVars.DOMAIN_API);
      break;

    default:
      break;
  }
  return domains;
};
