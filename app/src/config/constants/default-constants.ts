import { domains } from './domain-constants';
import time from './time-constants';

const roles = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

const CLOUDINARY = 'Cloudinary';

export const defaultConstants = {
  roles,
  time,
  domains: domains(),
  CLOUDINARY,
};
