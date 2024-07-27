import config from 'config'; // 👈 1
import argon2 from 'argon2'; // 👈 2

const ARGON_SALT_LENGTH = config.get('auth.argon.saltLength'); // 👈 1
const ARGON_HASH_LENGTH = config.get('auth.argon.hashLength'); // 👈 1
const ARGON_TIME_COST = config.get('auth.argon.timeCost'); // 👈 1
const ARGON_MEMORY_COST = config.get('auth.argon.memoryCost'); // 👈 1

// 👇 3
const hashPassword = async (password) => {
  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    saltLength: ARGON_SALT_LENGTH,
    hashLength: ARGON_HASH_LENGTH,
    timeCost: ARGON_TIME_COST,
    memoryCost: ARGON_MEMORY_COST,
  }); // 👈 4

  return passwordHash;
};

// 👇 3
const verifyPassword = async (password, passwordHash) => {
  const valid = await argon2.verify(passwordHash, password, {
    type: argon2.argon2id,
    saltLength: ARGON_SALT_LENGTH,
    hashLength: ARGON_HASH_LENGTH,
    timeCost: ARGON_TIME_COST,
    memoryCost: ARGON_MEMORY_COST,
  }); // 👈 5

  return valid;
};

// 👇 3
export default {
  hashPassword,
  verifyPassword,
};
