import { AppDataSource } from "../data-source";
import { logger } from "../createServer";
import ServiceError from "../core/serviceError";
import { Exhibition } from "../entity/exhibition";

const debugLog = (message: any) => {
  logger.debug(message);
};

const exhibitionRepository = AppDataSource.getRepository(Exhibition);

const checkExhibitionEndpoint = async () => {
  debugLog("GET exhibition endpoint called");
  return "Exhibition endpoint works";
};

const getExhibitions = async () => {
  debugLog("GET exhibitions called");
  return await exhibitionRepository.find();
};

const getExhibitionById = async (exhibitionId: number) => {
  debugLog("GET exhibition with id " + exhibitionId + " endpoint called");
  const exhibition: Exhibition = await exhibitionRepository.findOne({
    where: {
      id: exhibitionId,
    },
  });

  if (!exhibition) {
    throw ServiceError.notFound(
      "Exhibition not found with id " + exhibitionId,
      exhibitionId
    );
  }
  return exhibition;
};

const putExhibition = async (ctx: any) => {
  debugLog("PUT exhibition with id " + ctx.params.id + " endpoint called");

  const updatedExhibition: any = {};

  if (ctx.request.body.title) {
    updatedExhibition.title = String(ctx.request.body.title);
  }

  if (ctx.request.body.description) {
    updatedExhibition.description = String(ctx.request.body.description);
  }

  if (ctx.request.body.startDate) {
    updatedExhibition.startDate = new Date(ctx.request.body.startDate);
  }

  if (ctx.request.body.endDate) {
    updatedExhibition.endDate = new Date(ctx.request.body.endDate);
  }

  await exhibitionRepository.update(ctx.params.id, updatedExhibition);
  const exhibition: Exhibition = await exhibitionRepository.findOne({
    where: {
      id: ctx.params.id,
    },
  });

  if (!exhibition) {
    throw ServiceError.notFound(
      "Exhibition not found with id " + ctx.params.id,
      ctx.params.id
    );
  }

  return exhibition;
};

const postExhibition = async (ctx: any) => {
  debugLog("POST exhibition endpoint called");

  const exhibition: Exhibition = new Exhibition();

  if (ctx.request.body.title) {
    exhibition.title = String(ctx.request.body.title);
  }

  if (ctx.request.body.description) {
    exhibition.description = String(ctx.request.body.description);
  }

  if (ctx.request.body.startDate) {
    exhibition.startDate = new Date(ctx.request.body.startDate);
  }

  if (ctx.request.body.endDate) {
    exhibition.endDate = new Date(ctx.request.body.endDate);
  }

  await exhibitionRepository.save(exhibition);
  return exhibition;
};

const deleteExhibition = async (exhibitionId: number) => {
  debugLog("DELETE exhibition with id " + exhibitionId + " endpoint called");
  const exhibition: Exhibition = await exhibitionRepository.findOne({
    where: {
      id: exhibitionId,
    },
  });

  if (!exhibition) {
    throw ServiceError.notFound(
      "Exhibition not found with id " + exhibitionId,
      exhibitionId
    );
  }

  await exhibitionRepository.delete(exhibitionId);
  return exhibition;
};

export const exhibitionService = {
  checkExhibitionEndpoint,
  getExhibitions,
  getExhibitionById,
  putExhibition,
  postExhibition,
  deleteExhibition,
};
