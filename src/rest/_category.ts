import Koa from "koa";
import { logger } from "../createServer";
import Router from "koa-router";
import { hasPermissions, permissions } from "../core/auth";
import Joi from "joi";
import validate from "./_validation";
import { categoryService } from "../service/category";

const checkCategoryEndpoint = async (ctx: Koa.Context) => {
  ctx.body = await categoryService.checkCategoryEndpoint();
};

const getCategories = async (ctx: Koa.Context) => {
  ctx.body = await categoryService.getCategories();
};

const getCategoryById = async (ctx: Koa.Context) => {
  ctx.body = await categoryService.getCategoryById(ctx.params.id);
};

getCategoryById.validationSceme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const putCategory = async (ctx: Koa.Context) => {
  ctx.body = await categoryService.putCategory(ctx);
};

putCategory.validationSceme = {
  params: Joi.object({ id: Joi.number().integer().positive().required() }),
  body: Joi.object({
    name: Joi.string(),
  }),
};

const postCategory = async (ctx: Koa.Context) => {
  ctx.body = await categoryService.postCategory(ctx);
};

postCategory.validationSceme = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
};

const deleteCategoryById = async (ctx: Koa.Context) => {
  ctx.body = await categoryService.deleteCategory(ctx.params.id);
};

deleteCategoryById.validationSceme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const postCategoryPainting = async (ctx: Koa.Context) => {
  ctx.body = await categoryService.postCategoryPainting(ctx);
};

postCategoryPainting.validationSceme = {
  params: Joi.object({
    categoryId: Joi.number().integer().positive(),
    paintingId: Joi.number().integer().positive(),
  }),
};

/**
 * Install the category route
 * @param {Router} app - router instance
 */

export default function installCategoryRoute(app: any) {
  const router = new Router({
    prefix: "/category",
  });

  router.get("/test", checkCategoryEndpoint);

  router.get("/", getCategories);

  router.get(
    "/:id",
    validate(getCategoryById.validationSceme),
    getCategoryById
  );

  router.put(
    "/:id",
    hasPermissions(permissions.write),
    validate(putCategory.validationSceme),
    putCategory
  );

  router.post(
    "/",
    hasPermissions(permissions.write),
    validate(postCategory.validationSceme),
    postCategory
  );

  router.post(
    "/:categoryId/:paintingId",
    hasPermissions(permissions.write),
    validate(postCategoryPainting.validationSceme),
    postCategoryPainting
  );

  router.delete(
    "/:id",
    hasPermissions(permissions.write),
    validate(deleteCategoryById.validationSceme),
    deleteCategoryById
  );

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug("Category routes installed");
}
