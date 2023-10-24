import { Express, Router } from "express";
import { createProduct } from "./create-product";
import { listProducts } from "./list-product";
import { passportJwtApiMiddleware } from "@/packages/passport";

export const initProductController = (app: Express) => {
  const router = Router();
  router.use(passportJwtApiMiddleware());

  app.use("/products", router);
  router.post("/", createProduct);
  router.get("/", listProducts);
};
