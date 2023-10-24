import { Express, Router } from "express";
import { registerAccount } from "./register-accout";
import { me } from "./get-current-user";
import { passportJwtApiMiddleware } from "@/packages/passport";

export const initUserController = (app: Express) => {
  const router = Router();

  app.use("/users", router);
  router.post("/register", registerAccount);

  router.use(passportJwtApiMiddleware());

  router.get("/me", me);
};
