import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import { asl } from "./packages/asl";

import { Express } from "express";

export const createApp: () => Express = () => {
  const app = express();

  app.disable("x-powered-by");
  app.use(
    helmet({
      xPoweredBy: false,
    }),
  );

  app.use(express.static("public"));

  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );

  app.use(bodyParser.json());

  app.use((req, res, next) => {
    asl.run({}, () => next());
  });

  return app;
};
