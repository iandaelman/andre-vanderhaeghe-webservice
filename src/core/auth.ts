import Koa from 'koa';
import { usersService } from '../service/users';

export const requireAuthentication = async (ctx: Koa.Context, next: any) => {
  const { authorization } = ctx.headers;

  const { authToken, ...session } = await usersService.checkAndParseSession(authorization);

  ctx.state.session = session;
  ctx.state.authToken = authToken;

  return next();

}

export const makeRequireRole = (role: any) => async (ctx: Koa.Context, next: any) => {
  const { roles = [] } = ctx.state.session; // 👈 8

  usersService.checkRole(role, roles); // 👈 9
  return next(); // 👈 10
};