import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { getLogger, initializeLogger } from "./core/logging";
import config from "../config/config";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import installRestRoutes from "./rest";
import * as emoji from "node-emoji";
import { serializeError } from "serialize-error";
import ServiceError from "./core/serviceError";

initializeLogger({
  level: config.logger.level, //"debug",
  defaultMeta: {},
});

const logger = getLogger();

async function createServer() {
  logger.info("Starting server...");

  const app: Koa = new Koa();

  app.use(async (ctx, next) => {
    const logger = getLogger();
    logger.info(
      `${emoji.get("fast_forward")} Request: ${ctx.method} ${ctx.url}`
    );

    const getStatusEmoji = () => {
      if (ctx.status >= 500) return emoji.get("skull");
      if (ctx.status >= 400) return emoji.get("x");
      if (ctx.status >= 300) return emoji.get("rocket");
      if (ctx.status >= 200) return emoji.get("white_check_mark");
      return emoji.get("rewind");
    };

    try {
      await next();
      logger.info(
        `${getStatusEmoji()} Request: ${ctx.method} ${ctx.status} ${ctx.url}`
      );
    } catch (error) {
      logger.error(
        `${getStatusEmoji()} ${ctx.method} ${ctx.status} ${ctx.url}`,
        {
          error,
        }
      );

      throw error;
    }
  });

  app.use(async (ctx, next) => {
    try {
      await next();

      if (ctx.status === 404) {
        ctx.body = {
          code: "NOT_FOUND",
          message: `Unknown resource: ${ctx.url}`,
        };
        ctx.status = 404;
      }
    } catch (error: any) {
      const logger = getLogger();
      logger.error("Error occured while handling a request", {
        error: serializeError(error),
      });

      let statusCode = error.status || 500;
      const errorBody = {
        code: error.code || "INTERNAL_SERVER_ERROR",
        message: error.message,
        details: error.details || {},
      };
      if (error instanceof ServiceError) {
        if (error.isNotFound) {
          statusCode = 404;
        }

        if (error.isValidationFailed) {
          statusCode = 400;
        }

        if (error.isUnauthorized) {
          statusCode = 401;
        }

        if (error.isForbidden) {
          statusCode = 403;
        }
      }

      ctx.status = statusCode;
      ctx.body = errorBody;
    }
  });

  app.use(bodyParser());
  logger.debug("Body parser initialized");

  app.use(
    cors({
      origin: config.cors.origin,
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "X-Requested-With",
      ],
      allowMethods: ["GET", "POST", "DELETE", "PUT"],
      maxAge: 3600,
    })
  );

  logger.debug("CORS initialized");

  installRestRoutes(app);

  await AppDataSource.initialize();

  return {
    getApp() {
      return app;
    },

    start() {
      return new Promise<void>((resolve) => {
        app.listen(config.PORT, () => {
          logger.info(`Server started on port ${config.PORT}`);

          resolve();
        });
      });
    },

    async stop() {
      app.removeAllListeners();
      await AppDataSource.destroy();
      getLogger().info("Server stopped");
    },
  };
}

export { createServer, logger };
