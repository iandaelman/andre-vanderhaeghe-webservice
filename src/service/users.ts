import { AppDataSource } from "../data-source";
import { logger } from "../createServer";
import { User } from "../entity/user";
import { Painting } from "../entity/painting";
import Koa from "koa";
import { addUserInfo } from "../core/auth";
import ServiceError from "../core/serviceError";

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

const getUserByAuth0Id = async (ctx: Koa.Context) => {
  let user = null;
  try {
    const auth0Id = ctx.state.user.sub;
    debugLog(
      "GET user with auth0Id " + auth0Id + " endpoint called in service layer"
    );
    user = await userRepository.findOne({
      where: {
        auth0Id: auth0Id,
      },
      relations: ["paintings"],
    });

    if (!user) {
      logger.info("User not found with auth0Id " + auth0Id + " in DB");
      logger.info("Trying to add user with auth0Id " + auth0Id + " in DB");
      user = postUser(ctx);
    }

    return user;
  } catch (err) {
    logger.error(err);
    throw ServiceError.forbidden("Incorrect authentication token provided");
  }
};

const postUser = async (ctx: Koa.Context) => {
  debugLog("POST user endpoint called");

  await addUserInfo(ctx);
  const user = new User();
  user.name = ctx.state.user.name;
  user.auth0Id = ctx.state.user.sub;
  user.paintings = [];

  const checkUser = await userRepository.findOne({
    where: {
      auth0Id: user.auth0Id,
    },
  });

  if (checkUser) {
    logger.info("User already exists in DB with auth0Id " + user.auth0Id);
    throw ServiceError.forbidden(
      "User already exists in DB with auth0Id " + user.auth0Id,
      user.auth0Id
    );
  } else {
    logger.info("User with auth0Id " + user.auth0Id + " is being added in DB");
    const savedUser: User = await userRepository.save(user);
    return savedUser;
  }
};

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

export const usersService = {
  checkUserEndpoint,
  getAllUsers,
  getUserById,
  getUserByAuth0Id,
  postUser,
  putUser,
  deleteUser,
  saveUserPainting,
  removeUserPainting,
};
