import { logger } from "../createServer";
import Koa from "koa";
import Router from "koa-router";
import installUsersRoute from "./_users";
import installPaintingsRoute from "./_paintings";
import installExhibitionRoute from "./_exhibition";
import installCategoryRoute from "./_category";

/**
 * Install all routes
 */

export default function installRestRoutes(app: Koa) {
  logger.debug("Installing REST routes");
  const router = new Router({
    prefix: "/api",
  });

  installUsersRoute(router);
  installPaintingsRoute(router);
  installExhibitionRoute(router);
  installCategoryRoute(router);

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug("REST routes installed");
}
