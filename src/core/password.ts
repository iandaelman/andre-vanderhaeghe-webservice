import config from '../../config/config';
import * as argon2 from 'argon2';

const ARGON_SALT_LENGTH = config.auth.argon.saltLength;
const ARGON_HASH_LENGTH = config.auth.argon.hashLength;
const ARGON_TIME_COST = config.auth.argon.timeCost;
const ARGON_MEMORY_COST = config.auth.argon.memoryCost;

// 👇 3
export const hashPassword = async (password: string) => {
  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    saltLength: ARGON_SALT_LENGTH,
    hashLength: ARGON_HASH_LENGTH,
    timeCost: ARGON_TIME_COST,
    memoryCost: ARGON_MEMORY_COST,
  } as argon2.Options);

  return passwordHash;
};


export const verifyPassword = async (password: string, passwordHash: string) => {
  const valid = await argon2.verify(passwordHash, password, {
    type: argon2.argon2id,
    saltLength: ARGON_SALT_LENGTH,
    hashLength: ARGON_HASH_LENGTH,
    timeCost: ARGON_TIME_COST,
    memoryCost: ARGON_MEMORY_COST,
  } as argon2.Options); // 👈 5

  return valid;
};

