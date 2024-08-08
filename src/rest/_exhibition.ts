import Koa from "koa";
import { exhibitionService } from "../service/exhibition";
import { logger } from "../createServer";
import Router from "koa-router";
import validate from "./_validation";
import BaseJoi from "joi";
import JoiDate from "@joi/date";
import { requireAuthentication } from "../core/auth";
const Joi = BaseJoi.extend(JoiDate);

const checkExhibitionEndpoint = async (ctx: Koa.Context) => {
  ctx.body = await exhibitionService.checkExhibitionEndpoint();
};

const getExhibitions = async (ctx: Koa.Context) => {
  ctx.body = await exhibitionService.getExhibitions();
};

const getExhibitionById = async (ctx: Koa.Context) => {
  ctx.body = await exhibitionService.getExhibitionById(ctx.params.id);
};

getExhibitionById.validationSceme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const putExhibition = async (ctx: Koa.Context) => {
  ctx.body = await exhibitionService.putExhibition(ctx);
};

putExhibition.validationSceme = {
  params: Joi.object({ id: Joi.number().integer().positive().required() }),
  body: Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    startDate: Joi.date().format("YYYY-MM-DD"),
    endDate: Joi.date().format("YYYY-MM-DD").min(Joi.ref("startDate")),
  }),
};

const postExhibition = async (ctx: Koa.Context) => {
  ctx.body = await exhibitionService.postExhibition(ctx);
};

postExhibition.validationSceme = {
  body: Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    startDate: Joi.date().format("YYYY-MM-DD"),
    endDate: Joi.date().format("YYYY-MM-DD").min(Joi.ref("startDate")),
  }),
};

const deleteExhibition = async (ctx: Koa.Context) => {
  ctx.body = await exhibitionService.deleteExhibition(ctx.params.id);
};

deleteExhibition.validationSceme = {
  params: Joi.object({ id: Joi.number().integer().positive().required() }),
};

/**
 * Install the exhibition route
 * @param {Router} app - router instance
 */

export default function installExhibitionRoute(app: any) {
  const router = new Router({
    prefix: "/exhibition",
  });

  router.get("/test", checkExhibitionEndpoint);

  router.get("/", getExhibitions);

  router.get(
    "/:id",
    validate(getExhibitionById.validationSceme),
    getExhibitionById
  );

  router.post(
    "/",
    // requireAuthentication,
    validate(postExhibition.validationSceme),
    postExhibition
  );

  router.put(
    "/:id",
    validate(putExhibition.validationSceme),
    putExhibition
  );

  router.delete(
    "/:id",
    validate(deleteExhibition.validationSceme),
    deleteExhibition
  );

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug("Exhibitions routes installed");
}
