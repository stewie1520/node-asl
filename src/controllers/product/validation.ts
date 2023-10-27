import { zPagination } from "@/utils";
import { z } from "zod";

export const createProductValidation = z.object({
  body: z.object({
    name: z.string().min(3).max(255),
    price: z.number().positive(),
    description: z.string().min(3).max(255),
    image: z.string().url(),
  }),
});

export const listProductsValidation = z.object({
  query: zPagination(),
});

export class ListProductsDTO {
  constructor(
    public readonly limit: number,
    public readonly offset: number,
    public readonly order:
      | "updatedAt-ASC"
      | "updatedAt-DESC"
      | "createdAt-ASC"
      | "createdAt-DESC",
  ) {}
}
