import bodyParser from "body-parser";
import express from "express";
import { asl } from "./asl";

import { Express } from "express";

export const createApp: () => Express = () => {
  const app = express();

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
