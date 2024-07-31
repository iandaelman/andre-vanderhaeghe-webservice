import Koa from "koa";
import { usersService } from "../service/users";
import { logger } from "../createServer";
import Router from "koa-router";
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

const login = async (ctx: Koa.Context) => {
  const { email, password } = ctx.request.body as { email: string, password: string };
  const response = await usersService.login(email, password);
  ctx.body = { token: response.token, user: response.user };
}

login.validationSceme = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })
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

const postUser = async (ctx: Koa.Context) => {
  ctx.body = await usersService.postUser(ctx);
};

const registerUser = async (ctx: Koa.Context) => {
  const requestBody = ctx.request.body as { name: string, email: string, password: string };
  const token = await usersService.registerUser(requestBody);
  ctx.body = { token };
  ctx.status = 201;
};

registerUser.validationSceme = {
  body: Joi.object({
    name: Joi.string().max(255),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(255),
  }),
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
  const user = await usersService.getUserById(ctx.params.id);
  ctx.body = await usersService.saveUserPainting(ctx, user.id);
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

    validate(getUserById.validationSceme),
    getUserById
  );


  router.post("/register", postUser);

  router.post("/login", validate(login.validationSceme), login);

  router.put(
    "/:id",
    validate(putUser.validationSceme),
    putUser
  );

  router.delete(
    "/:id",
    validate(deleteUser.validationSceme),
    deleteUser
  );

  router.post(
    "/:paintingId",
    validate(saveUserPainting.validationSceme),
    saveUserPainting
  );

  router.delete(
    "/:userId/:paintingId",
    validate(removeUserPainting.validationSceme),
    removeUserPainting
  );

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug("Users routes installed");
}
