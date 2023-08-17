import Koa from "koa";
import { usersService } from "../service/users";
import { logger } from "../createServer";
import Router from "koa-router";
import { addUserInfo, hasPermissions, permissions } from "../core/auth";
import Joi from "joi";
import validate from "./_validation";

//Test endpoint
const checkUserEndpoint = async (ctx: Koa.Context) => {
  ctx.body = await usersService.checkUserEndpoint();
};

// GET all users endpoint
const getAllusers = async (ctx: Koa.Context) => {
  ctx.body = await usersService.getAllUsers();
};

// GET user with id endpoint
const getUserById = async (ctx: Koa.Context) => {
  ctx.body = await usersService.getUserById(ctx.params.id);
};

getUserById.validationSceme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const getUserByAuth0Id = async (ctx: Koa.Context) => {
  addUserInfo(ctx);
  const auth0Id = ctx.state.user.sub;
  logger.info(
    "GET user with auth0Id " + auth0Id + " endpoint called in REST layer"
  );
  ctx.body = await usersService.getUserByAuth0Id(ctx);
};

const postUser = async (ctx: Koa.Context) => {
  addUserInfo(ctx);
  ctx.body = await usersService.postUser(ctx);
};

const putUser = async (ctx: Koa.Context) => {
  ctx.body = await usersService.putUser(ctx);
};

putUser.validationSceme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
  body: Joi.object({
    name: Joi.string().required(),
  }),
};

const deleteUser = async (ctx: Koa.Context) => {
  ctx.body = await usersService.deleteUser(ctx);
};

deleteUser.validationSceme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const saveUserPainting = async (ctx: Koa.Context) => {
  let userId = 0;
  try {
    addUserInfo(ctx);
    const user = await usersService.getUserByAuth0Id(ctx);
    userId = user.id;
  } catch (err) {
    await addUserInfo(ctx);
    const user = await usersService.postUser(ctx);
    userId = user.id;
  }

  ctx.body = await usersService.saveUserPainting(ctx, userId);
};

saveUserPainting.validationSceme = {
  params: Joi.object({
    paintingId: Joi.number().integer().positive(),
  }),
};

const removeUserPainting = async (ctx: Koa.Context) => {
  ctx.body = await usersService.removeUserPainting(ctx);
};

removeUserPainting.validationSceme = {
  params: Joi.object({
    userId: Joi.number().integer().positive(),
    paintingId: Joi.number().integer().positive(),
  }),
};

/**
 * Install the users route
 * @param {Router} app - router instance
 */

export default function installUsersRoute(app: any) {
  const router = new Router({
    prefix: "/users",
  });

  /**
   * PUBLIC ROUTES
   *
   */

  router.get("/", getAllusers);

  router.get("/test", checkUserEndpoint);

  router.get(
    "/userId/:id",
    hasPermissions(permissions.read),
    validate(getUserById.validationSceme),
    getUserById
  );

  router.get("/auth0", hasPermissions(permissions.read), getUserByAuth0Id);

  router.post("/register", hasPermissions(permissions.write), postUser);

  router.put(
    "/:id",
    hasPermissions(permissions.write),
    validate(putUser.validationSceme),
    putUser
  );

  router.delete(
    "/:id",
    hasPermissions(permissions.write),
    validate(deleteUser.validationSceme),
    deleteUser
  );

  router.post(
    "/:paintingId",
    hasPermissions(permissions.loggedIn),
    validate(saveUserPainting.validationSceme),
    saveUserPainting
  );

  router.delete(
    "/:userId/:paintingId",
    hasPermissions(permissions.loggedIn),
    validate(removeUserPainting.validationSceme),
    removeUserPainting
  );

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug("Users routes installed");
}
