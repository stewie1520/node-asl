import { Express } from "express";
import { initProductController } from "./product";

export const initControllers = (app: Express) => {
  initProductController(app);
};
