import authService from './auth/auth.service';
import userService from './user/user.service';

const services = {
  authService,
  userService,
};

export type IServices = typeof services;
export { authService, services, userService };
