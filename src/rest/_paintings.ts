import Koa from "koa";
import { logger } from "../createServer";
import Router from "koa-router";
import { paintingsService } from "../service/paintings";
import Joi from "joi";
import validate from "./_validation";
import { makeRequireRole, requireAuthentication } from "../core/auth";
import { ROLES } from "../core/roles";

const checkPaintingEndpoint = async (ctx: Koa.Context) => {
  ctx.body = await paintingsService.checkPaintingEndpoint();
};

const getPaintings = async (ctx: Koa.Context) => {
  ctx.body = await paintingsService.getPaintings();
};

const getPaintingById = async (ctx: Koa.Context) => {
  ctx.body = await paintingsService.getPaintingById(ctx.params.id);
};

getPaintingById.validationSceme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const putPainting = async (ctx: Koa.Context) => {
  ctx.body = await paintingsService.putPainting(ctx);
};

putPainting.validationSceme = {
  params: Joi.object({ id: Joi.number().integer().positive().required() }),
  body: Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    imageFilepath: Joi.string(),
    price: Joi.number().positive(),
  }),
};

/**
 * Install the paintings route
 * @param {Router} app - router instance
 */

export default function installPaintingsRoute(app: any) {
  const router = new Router({
    prefix: "/paintings",
  });

  router.get("/test", checkPaintingEndpoint);

  router.get("/", getPaintings);

  router.get(
    "/:id",
    validate(getPaintingById.validationSceme),
    getPaintingById
  );

  router.put(
    "/:id",
    validate(putPainting.validationSceme),
    putPainting
  );

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug("Paintings routes installed");
}
