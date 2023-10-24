import { Handler } from "express";
import z from "zod";

import { ProductModel } from "@/database";
import { zParse } from "@/utils";

const zodSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(255),
    price: z.number().positive(),
    description: z.string().min(3).max(255),
    image: z.string().url(),
  }),
});

export const createProduct: Handler = async (req, res, next) => {
  try {
    const { body } = await zParse(zodSchema, req);
    const { name, price, description, image } = body;

    const product = new ProductModel({
      name,
      price,
      description,
      image,
    });

    await product.save();
    res.json(product);
  } catch (error: any) {
    next(error);
  }
};
