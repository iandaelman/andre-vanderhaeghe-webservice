import { AppDataSource } from "../data-source";
import { logger } from "../createServer";
import { Painting } from "../entity/painting";
import ServiceError from "../core/serviceError";

const debugLog = (message: any) => {
  logger.debug(message);
};

const paintingRepository = AppDataSource.getRepository(Painting);

const checkPaintingEndpoint = async () => {
  debugLog("GET painting endpoint called");
  return "Painting endpoint works";
};

const getPaintings = async () => {
  debugLog("GET paintings called");
  return await paintingRepository.find({
    relations: ["category"]
  });
};

const getPaintingById = async (paintingId: number) => {
  debugLog("GET painting with id " + paintingId + " endpoint called");
  const painting: Painting = await paintingRepository.findOne({
    where: {
      id: paintingId,
    },
    relations: ["users", "category"],
  });

  if (!painting) {
    throw ServiceError.notFound(
      "Painting not found with id " + paintingId,
      paintingId
    );
  }
  return painting;
};

const putPainting = async (ctx: any) => {
  debugLog("PUT painting with id " + ctx.params.id + " endpoint called");

  const updatedPainting: any = {};

  if (ctx.request.body.title) {
    updatedPainting.title = String(ctx.request.body.title);
  }

  if (ctx.request.body.category) {
    updatedPainting.category = String(ctx.request.body.category);
  }

  if (ctx.request.body.description) {
    updatedPainting.description = String(ctx.request.body.description);
  }

  if (ctx.request.body.imageFilepath) {
    updatedPainting.imageFilepath = String(ctx.request.body.imageFilepath);
  }

  if (ctx.request.body.price) {
    updatedPainting.price = Number(ctx.request.body.price);
  }

  await paintingRepository.update(Number(ctx.params.id), updatedPainting);

  const painting: Painting = await paintingRepository.findOne({
    where: {
      id: Number(ctx.params.id),
    },
    relations: ["users"],
  });

  if (!painting) {
    throw ServiceError.notFound(
      "Painting not found with id " + ctx.params.id,
      ctx.params.id
    );
  }

  return painting;
};

export const paintingsService = {
  checkPaintingEndpoint,
  getPaintings,
  getPaintingById,
  putPainting,
};
