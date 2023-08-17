import * as jwksrsa from "jwks-rsa";
import config from "../../config/config";
import jwt from "koa-jwt";
import axios from "axios";
import { getLogger } from "./logging";
import Koa from "koa";

const AUTH_USER_INFO = config.auth.userInfo;

function getJwtSecret() {
  const logger = getLogger();
  try {
    const secretFuntcion = jwksrsa.koaJwtSecret({
      jwksUri: config.auth.jwksUri,
      cache: true,
      cacheMaxEntries: 5,
    });
    return secretFuntcion;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

function checkJwtToken() {
  const logger = getLogger();
  try {
    // eslint-disable-next-line prefer-const
    let secretFuntcion = getJwtSecret();
    return jwt({
      secret: secretFuntcion,
      audience: config.auth.audience,
      issuer: config.auth.issuer,
      algorithms: ["RS256"],
      passthrough: true,
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function addUserInfo(ctx: any) {
  const logger = getLogger();
  try {
    const token = ctx.headers.authorization;
    const url = AUTH_USER_INFO;

    if (token && url && ctx.state.user) {
      logger.debug(`addUserInfo: ${url}, ${JSON.stringify(token)}`);

      const userInfo = await axios.get(url, {
        headers: {
          Authorization: token,
        },
      });

      ctx.state.user = {
        ...ctx.state.user,
        ...userInfo.data,
      };
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

const permissions = Object.freeze({
  loggedIn: "loggedIn",
  read: "read",
  write: "write",
});

function hasPermissions(permission: string) {
  return async (ctx: Koa.Context, next: any) => {
    const logger = getLogger();
    const user = ctx.state.user;
    logger.debug(`hasPermissions: ${JSON.stringify(user)}`);

    if (user && permission === permissions.loggedIn) {
      await next();
    } else if (
      user &&
      user.permissions &&
      user.permissions.includes(permission)
    ) {
      await next();
    } else {
      ctx.throw(
        403,
        "You are not allowed to view this part of the application",
        {
          code: "FORBIDDEN",
        }
      );
    }
  };
}

export { checkJwtToken, addUserInfo, hasPermissions, permissions };
