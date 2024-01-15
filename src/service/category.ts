import { AppDataSource } from "../data-source";
import { logger } from "../createServer";
import ServiceError from "../core/serviceError";
import { Category } from "../entity/category";
import { Painting } from "../entity/painting";

const debugLog = (message: any) => {
  logger.debug(message);
};

const categoryRepository = AppDataSource.getRepository(Category);
const paintingRepository = AppDataSource.getRepository(Painting);

const checkCategoryEndpoint = async () => {
  debugLog("GET category endpoint called");
  return "Category endpoint works";
};

const getCategories = async () => {
  debugLog("GET categories called");
  return await categoryRepository.find();
};

const getCategoryById = async (categoryId: number) => {
  debugLog("GET category with id " + categoryId + " endpoint called");
  const category: Category = await categoryRepository.findOne({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw ServiceError.notFound(
      "Category not found with id " + categoryId,
      categoryId
    );
  }
  return category;
};

const putCategory = async (ctx: any) => {
  debugLog("PUT category with id " + ctx.params.id + " endpoint called");

  const updatedCategory: any = {};

  if (ctx.request.body.name) {
    updatedCategory.name = String(ctx.request.body.name);
  }

  await categoryRepository.update(ctx.params.id, updatedCategory);
  const category: Category = await categoryRepository.findOne({
    where: {
      id: ctx.params.id,
    },
  });

  if (!category) {
    throw ServiceError.notFound(
      "Category not found with id " + ctx.params.id,
      ctx.params.id
    );
  }
  return category;
};

const postCategory = async (ctx: any) => {
  debugLog("POST category endpoint called");

  const newCategory: Category = new Category();
  newCategory.name = ctx.request.body.name;

  const category: Category = await categoryRepository.save(newCategory);
  return category;
};

const deleteCategory = async (categoryId: number) => {
  debugLog("DELETE category with id " + categoryId + " endpoint called");

  const category: Category = await categoryRepository.findOne({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw ServiceError.notFound(
      "Category not found with id " + categoryId,
      categoryId
    );
  }

  await categoryRepository.delete(categoryId);
  return category;
};

const postCategoryPainting = async (ctx: any) => {
  debugLog(
    "POST category painting endpoint called with categoryId " +
      ctx.params.categoryId +
      " and paintingId " +
      ctx.params.paintingId
  );

  const category: Category = await categoryRepository.findOne({
    where: {
      id: ctx.params.categoryId,
    },
    relations: ["paintings"],
  });

  const painting: Painting = await paintingRepository.findOne({
    where: {
      id: ctx.params.paintingId,
    },
  });

  if (!category) {
    throw ServiceError.notFound(
      "Category not found with id " + ctx.params.categoryId,
      ctx.params.categoryId
    );
  }

  if (!painting) {
    throw ServiceError.notFound(
      "Painting not found with id " + ctx.params.paintingId,
      ctx.params.paintingId
    );
  }

  category.paintings.push(painting);
  await categoryRepository.save(category);
  return category;
};

export const categoryService = {
  checkCategoryEndpoint,
  getCategories,
  getCategoryById,
  putCategory,
  postCategory,
  deleteCategory,
  postCategoryPainting,
};
