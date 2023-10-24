import { ProductModel } from "@/database";
import { zPagination, zParse } from "@/utils";
import { Handler } from "express";
import { z } from "zod";

const zodSchema = z.object({
  query: zPagination(),
});

export const listProducts: Handler = async (req, res, next) => {
  try {
    const { query } = await zParse(zodSchema, req);
    const { limit, offset, order } = query;

    const results = await ProductModel.paginate(
      {},
      { limit, offset, sort: order },
    );

    res.json(results);
  } catch (error: any) {
    next(error);
  }
};
