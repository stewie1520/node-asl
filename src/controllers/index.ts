import { Express } from "express";
import { initProductController } from "./product";
import { initUserController } from "./user";

export const initControllers = (app: Express) => {
  initProductController(app);
  initUserController(app);
};
