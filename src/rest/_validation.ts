import Joi from "joi";
import Koa from "koa";

const JOI_OPTIONS = {
  abortEarly: true,
  allowUnknown: false,
  context: true,
  convert: true,
  presence: "required",
};

const cleanupJoiError = (error: any) =>
  error.details.reduce((resultObj: any, { message, path, type }: any) => {
    const joinedPath = path.join(".") || "value";
    if (!resultObj[joinedPath]) {
      resultObj[joinedPath] = [];
    }
    resultObj[joinedPath].push({
      type,
      message,
    });

    return resultObj;
  }, {});

const validate = (schema: any) => {
  if (!schema) {
    schema = {
      params: {},
      query: {},
      body: {},
    };
  }

  return (ctx: Koa.Context, next: any) => {
    const errors: any = {};
    if (!Joi.isSchema(schema.params)) {
      schema.params = Joi.object(schema.params);
    }

    const { value: paramsValue, error: paramsError } = schema.params.validate(
      ctx.params,
      JOI_OPTIONS
    );

    if (paramsError) {
      errors.params = cleanupJoiError(paramsError);
    } else {
      ctx.params = paramsValue;
    }

    if (!Joi.isSchema(schema.body)) {
      schema.body = Joi.object(schema.body);
    }

    const { value: bodyValue, error: bodyError } = schema.body.validate(
      ctx.request.body,
      JOI_OPTIONS
    );

    if (bodyError) {
      errors.body = cleanupJoiError(bodyError);
    } else {
      ctx.request.body = bodyValue;
    }

    if (!Joi.isSchema(schema.query)) {
      schema.query = Joi.object(schema.query);
    }

    const { value: queryValue, error: queryError } = schema.query.validate(
      ctx.query,
      JOI_OPTIONS
    );

    if (queryError) {
      errors.query = cleanupJoiError(queryError);
    } else {
      ctx.query = queryValue;
    }

    if (Object.keys(errors).length) {
      ctx.throw(400, "Validation failed, check details for information", {
        code: "VALIDATION_FAILED",
        details: errors,
      });
    }
    return next();
  };
};

export default validate;
