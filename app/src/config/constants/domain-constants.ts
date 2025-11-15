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
    case 'preprod':
      domains.ADMIN = ['https://burger-house-admin-prew.vercel.app'];
      domains.CLIENT = ['http://localhost:3002'];
      domains.API = 'https://burger-house-api.onrender.com';
      break;
    case 'prod':
      domains.ADMIN = [];
      domains.CLIENT = [];
      domains.API = '';
      break;

    default:
      break;
  }
  return domains;
};
