import { envVars, envVarValue } from './env-constants';

export const domains = () => {
  const domains: {
    ADMIN: string;
    CLIENT: string;
    API: string;
  } = {
    ADMIN: '',
    CLIENT: '',
    API: '',
  };
  switch (envVarValue[envVars.NODE_ENV]) {
    case 'development':
      domains.ADMIN = 'http://localhost:3001';
      domains.CLIENT = 'http://localhost:3002';
      domains.API = 'http://localhost:3000';
      break;
    case 'preprod':
      domains.ADMIN = 'http://localhost:3001';
      domains.CLIENT = 'http://localhost:3002';
      domains.API = '';
      break;
    case 'prod':
      domains.ADMIN = '';
      domains.CLIENT = '';
      domains.API = '';
      break;

    default:
      break;
  }
  return domains;
};
