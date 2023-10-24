import { Express, Router } from "express";
import { createProduct } from "./create-product";
import { listProducts } from "./list-product";

export const initProductController = (app: Express) => {
  const router = Router();
  app.use("/products", router);

  router.post("/", createProduct);
  router.get("/", listProducts);
};
