import { applyDecorators } from "@/packages/decorators";
import { badRequest } from "@hapi/boom";
import type { Handler, Request } from "express";
import { Middlewares } from "tsoa";
import { AnyZodObject, ZodError, z } from "zod";

async function zParseRequest<T extends AnyZodObject>(
  schema: T,
  req: Request,
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(req);
  } catch (error) {
    if (error instanceof ZodError) {
      throw badRequest(error, { isZod: true });
    }

    throw badRequest(error as Error);
  }
}

const zNumericString = (schema: z.ZodDefault<z.ZodNumber>) =>
  z.preprocess<z.ZodDefault<z.ZodNumber>>((a) => {
    if (typeof a === "string") {
      return parseInt(a, 10);
    } else if (typeof a === "number") {
      return a;
    } else {
      return undefined;
    }
  }, schema);

export const zPagination = (overwrite = {}) =>
  z.object({
    limit: zNumericString(
      z.number().int().min(1).max(100).default(10),
    ).describe("limit"),
    offset: zNumericString(z.number().int().min(0).default(0)).describe(
      "Pagination offset",
    ),
    order: z
      .enum([
        "updatedAt-ASC",
        "updatedAt-DESC",
        "createdAt-ASC",
        "createdAt-DESC",
      ])
      .default("createdAt-DESC")
      .describe("Pagination order"),
    ...overwrite,
  });

type TZMiddleware = <T extends AnyZodObject>(schema: T) => Handler;

const zMiddleware: TZMiddleware = (schema) => async (req, res, next) => {
  try {
    await zParseRequest(schema, req);
    next();
  } catch (error) {
    next(error);
  }
};

export const Validation = <T extends AnyZodObject>(schema: T) => {
  return applyDecorators(Middlewares(zMiddleware(schema)));
};
