import { AppDataSource } from "../data-source";
import { logger } from "../createServer";
import { User } from "../entity/user";
import { Painting } from "../entity/painting";
import Koa from "koa";
import ServiceError from "../core/serviceError";
import { generateJWt } from "../core/jwt";
import { getLogger } from "../core/logging";
import { verifyJWT } from "../core/jwt";


const debugLog = (message: any) => {
  logger.debug(message);
};

const userRepository = AppDataSource.getRepository(User);
const paintingRepository = AppDataSource.getRepository(Painting);

const checkUserEndpoint = async () => {
  debugLog("GET user endpoint called");
  return "User endpoint works";
};

const getAllUsers = async () => {
  debugLog("GET all users endpoint called");
  return await userRepository.find();
};

const getUserById = async (id: number) => {
  debugLog("GET user with id " + id + " endpoint called");
  const user: User = await userRepository.findOne({
    where: {
      id: id,
    },
  });

  if (!user) {
    throw ServiceError.notFound("User not found with id " + id, id);
  }
  return user;
};

const getUserByEmail = async (email: string) => {
  debugLog("GET user with email " + email + " endpoint called");
  const user: User = await userRepository.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw ServiceError.notFound("User not found with email " + email, email);
  }
  return user;
}

const registerUser = async ({ name, email, password }: { name: string, email: string, password: string }) => {
  const password_hash = password;

  const user = await userRepository.save({
    name,
    email,
    password_hash,
    roles: JSON.stringify(["ROLES.USER"]) as any,
    paintings: [],
  });

  return await makeLoginData(user);
}
const putUser = async (ctx: any) => {
  debugLog("PUT user with id " + ctx.params.id + " endpoint called");

  const user: User = new User();

  if (ctx.request.body.name) {
    user.name = String(ctx.request.body.name);
  }

  await userRepository.update(Number(ctx.params.id), user);

  const updatedUser: User = await userRepository.findOne({
    where: {
      id: Number(ctx.params.id),
    },
    relations: ["paintings"],
  });

  if (!updatedUser) {
    throw ServiceError.notFound(
      "User not found with id and not updated" + Number(ctx.params.id),
      Number(ctx.params.id)
    );
  }

  return updatedUser;
};

const deleteUser = async (ctx: Koa.Context) => {
  debugLog("DELETE user with id " + ctx.params.id + " endpoint called");

  const user = await userRepository.findOne({
    where: {
      id: Number(ctx.params.id),
    },
  });

  if (!user) {
    throw ServiceError.notFound(
      "User not found with id " +
      Number(ctx.params.id) +
      " and thus not deleted",
      Number(ctx.params.id)
    );
  }

  await userRepository.delete(Number(ctx.params.id));
  return user;
};

const saveUserPainting = async (ctx: Koa.Context, userId: number) => {
  debugLog("POST user painting endpoint called");

  const user: User = await userRepository.findOne({
    where: {
      id: userId,
    },
    relations: ["paintings"],
  });

  const painting = await paintingRepository.findOne({
    where: {
      id: Number(ctx.params.paintingId),
    },
  });

  if (!user) {
    throw ServiceError.notFound(
      "User not found with auth0Id " + ctx.state.user.sub,
      ctx.state.user.sub
    );
  }

  if (!painting) {
    throw ServiceError.notFound(
      "Painting not found with id " + Number(ctx.params.paintingId),
      Number(ctx.params.paintingId)
    );
  }

  user.paintings.push(painting);
  await userRepository.save(user);
  return user;
};

const removeUserPainting = async (ctx: Koa.Context) => {
  debugLog("DELETE user painting endpoint called");

  const user: User = await userRepository.findOne({
    where: {
      id: Number(ctx.params.userId),
    },
    relations: ["paintings"],
  });

  if (!user) {
    throw ServiceError.notFound(
      "User not found with id " + Number(ctx.params.userId),
      Number(ctx.params.userId)
    );
  }

  const userPaintingIds = user.paintings.map((painting) => painting.id);
  if (!userPaintingIds.includes(Number(ctx.params.paintingId))) {
    throw ServiceError.forbidden(
      "User with id " +
      Number(ctx.params.userId) +
      " does not have painting with id " +
      Number(ctx.params.paintingId),
      Number(ctx.params.userId)
    );
  }

  user.paintings = user.paintings.filter(
    (painting) => painting.id !== Number(ctx.params.paintingId)
  );

  await userRepository.save(user);
  return user;
};

const makeExposedUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  roles: user.roles,
});

const makeLoginData = async (user: User) => {
  const token = await generateJWt(user);
  return {
    user: makeExposedUser(user),
    token,
  };
}

const login = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw ServiceError.unauthorized('The given email and password do not match', email);
  }
  if (user.password_hash !== password) {
    throw ServiceError.unauthorized('The given email and password do not match', email);
  }
  return await makeLoginData(user);
}

const checkAndParseSession = async (authHeader: string) => {
  if (!authHeader) {
    throw ServiceError.unauthorized('No authorization header provided');
  }
  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authorization header provided');
  }
  const authToken: string = authHeader.substring(7);

  try {
    const { roles, userId }: { roles: string[], userId: number } = await verifyJWT(authToken);

    return { authToken, roles, userId };
  } catch (error) {
    getLogger().error('Error generating JWT', error);
    ServiceError.unauthorized('Invalid token provided');
  }
}

const checkRole = (role: string, roles: string[]) => {
  const hasPermission = roles.includes(role);
  if (!hasPermission) {
    throw ServiceError.forbidden('User does not have the required role');
  }
}


export const usersService = {
  checkUserEndpoint,
  getAllUsers,
  getUserById,
  getUserByEmail,
  login,
  registerUser,
  putUser,
  deleteUser,
  saveUserPainting,
  removeUserPainting,
  checkAndParseSession,
  checkRole,
};

