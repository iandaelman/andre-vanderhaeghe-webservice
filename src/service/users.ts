import { AppDataSource } from "../data-source";
import { logger } from "../createServer";
import { UserAccount } from "../entity/useraccount";
import { Painting } from "../entity/painting";
import Koa from "koa";
import ServiceError from "../core/serviceError";
import { generateJWt } from "../core/jwt";
import { getLogger } from "../core/logging";
import { verifyJWT } from "../core/jwt";


const debugLog = (message: any) => {
  logger.debug(message);
};

const userRepository = AppDataSource.getRepository(UserAccount);
const paintingRepository = AppDataSource.getRepository(Painting);

const checkUserEndpoint = async () => {
  debugLog("GET useraccount endpoint called");
  return "UserAccount endpoint works";
};

const getAllUsers = async () => {
  debugLog("GET all users endpoint called");
  return await userRepository.find();
};

const getUserById = async (id: number) => {
  debugLog("GET useraccount with id " + id + " endpoint called");
  const useraccount: UserAccount = await userRepository.findOne({
    where: {
      id: id,
    },
  });

  if (!useraccount) {
    throw ServiceError.notFound("UserAccount not found with id " + id, id);
  }
  return useraccount;
};

const getUserByEmail = async (email: string) => {
  debugLog("GET useraccount with email " + email + " endpoint called");
  const useraccount: UserAccount = await userRepository.findOne({
    where: {
      email: email,
    },
  });

  if (!useraccount) {
    throw ServiceError.notFound("UserAccount not found with email " + email, email);
  }
  return useraccount;
}

const registerUser = async ({ name, email, password }: { name: string, email: string, password: string }) => {
  const password_hash = password;

  const useraccount = await userRepository.save({
    name,
    email,
    password_hash,
    roles: JSON.stringify(["ROLES.USER"]) as any,
    paintings: [],
  });

  return await makeLoginData(useraccount);
}
const putUser = async (ctx: any) => {
  debugLog("PUT useraccount with id " + ctx.params.id + " endpoint called");

  const useraccount: UserAccount = new UserAccount();

  if (ctx.request.body.name) {
    useraccount.name = String(ctx.request.body.name);
  }

  await userRepository.update(Number(ctx.params.id), useraccount);

  const updatedUser: UserAccount = await userRepository.findOne({
    where: {
      id: Number(ctx.params.id),
    },
    relations: ["paintings"],
  });

  if (!updatedUser) {
    throw ServiceError.notFound(
      "UserAccount not found with id and not updated" + Number(ctx.params.id),
      Number(ctx.params.id)
    );
  }

  return updatedUser;
};

const deleteUser = async (ctx: Koa.Context) => {
  debugLog("DELETE useraccount with id " + ctx.params.id + " endpoint called");

  const useraccount = await userRepository.findOne({
    where: {
      id: Number(ctx.params.id),
    },
  });

  if (!useraccount) {
    throw ServiceError.notFound(
      "UserAccount not found with id " +
      Number(ctx.params.id) +
      " and thus not deleted",
      Number(ctx.params.id)
    );
  }

  await userRepository.delete(Number(ctx.params.id));
  return useraccount;
};

const saveUserPainting = async (ctx: Koa.Context, userid: number) => {
  debugLog("POST useraccount painting endpoint called");

  const useraccount: UserAccount = await userRepository.findOne({
    where: {
      id: userid,
    },
    relations: ["paintings"],
  });

  const painting = await paintingRepository.findOne({
    where: {
      id: Number(ctx.params.paintingid),
    },
  });

  if (!useraccount) {
    throw ServiceError.notFound(
      "UserAccount not found with auth0Id " + ctx.state.useraccount.sub,
      ctx.state.useraccount.sub
    );
  }

  if (!painting) {
    throw ServiceError.notFound(
      "Painting not found with id " + Number(ctx.params.paintingid),
      Number(ctx.params.paintingid)
    );
  }

  useraccount.paintings.push(painting);
  await userRepository.save(useraccount);
  return useraccount;
};

const removeUserPainting = async (ctx: Koa.Context) => {
  debugLog("DELETE useraccount painting endpoint called");

  const useraccount: UserAccount = await userRepository.findOne({
    where: {
      id: Number(ctx.params.userid),
    },
    relations: ["paintings"],
  });

  if (!useraccount) {
    throw ServiceError.notFound(
      "UserAccount not found with id " + Number(ctx.params.userid),
      Number(ctx.params.userid)
    );
  }

  const userPaintingIds = useraccount.paintings.map((painting) => painting.id);
  if (!userPaintingIds.includes(Number(ctx.params.paintingid))) {
    throw ServiceError.forbidden(
      "UserAccount with id " +
      Number(ctx.params.userid) +
      " does not have painting with id " +
      Number(ctx.params.paintingid),
      Number(ctx.params.userid)
    );
  }

  useraccount.paintings = useraccount.paintings.filter(
    (painting) => painting.id !== Number(ctx.params.paintingid)
  );

  await userRepository.save(useraccount);
  return useraccount;
};

const makeExposedUser = (useraccount: UserAccount) => ({
  id: useraccount.id,
  name: useraccount.name,
  email: useraccount.email,
  roles: useraccount.roles,
});

const makeLoginData = async (useraccount: UserAccount) => {
  const token = await generateJWt(useraccount);
  return {
    useraccount: makeExposedUser(useraccount),
    token,
  };
}

const login = async (email: string, password: string) => {
  const useraccount = await getUserByEmail(email);
  if (!useraccount) {
    throw ServiceError.unauthorized('The given email and password do not match', email);
  }
  if (useraccount.password_hash !== password) {
    throw ServiceError.unauthorized('The given email and password do not match', email);
  }
  return await makeLoginData(useraccount);
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
    const { roles, userid }: { roles: string[], userid: number } = await verifyJWT(authToken);

    return { authToken, roles, userid };
  } catch (error) {
    getLogger().error('Error generating JWT', error);
    ServiceError.unauthorized('Invalid token provided');
  }
}

const checkRole = (role: string, roles: string[]) => {
  const hasPermission = roles.includes(role);
  if (!hasPermission) {
    throw ServiceError.forbidden('UserAccount does not have the required role');
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

