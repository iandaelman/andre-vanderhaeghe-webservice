import config from "../../config/config";
import { User } from "../entity/user";
import * as jwt from "jsonwebtoken";

const JWT_AUDIENCE = config.jwt.audience;
const JWT_ISSUER = config.jwt.issuer
const JWT_SECRET = config.jwt.secret;
const JWT_EXPIRATION_INTERVAL = config.jwt.expiration;


export const generateJWt = (user: User) => {
  const tokenData = {
    userId: user.id,
    roles: user.roles,
  }

  const signOptions = {
    expiresIn: Math.floor(JWT_EXPIRATION_INTERVAL / 1000),
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: 'auth',
  }

  return new Promise((resolve, reject) => {
    jwt.sign(tokenData, JWT_SECRET, signOptions, (err, token) => {
      if (err || !token) {
        return reject(err);
      }
      resolve(token);
    });
  });
}

export const verifyJWT = (token: string): Promise<any> => {
  const verifyOptions = {
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: 'auth',
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, verifyOptions, (err, decoded) => {
      if (err || !decoded) {
        return reject(err || new Error('Invalid token'));
      }
      resolve(decoded);
    });
  });
}