import "./path";

import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

import { asl } from "./asl";
import { initControllers } from "./controllers";
import { connectToDatabase } from "./database/connect";
import { handleError } from "./utils";
import logger from "./logger";

const app = express();
connectToDatabase();

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(bodyParser.json());

app.use((req, res, next) => {
  asl.run({}, () => next());
});

initControllers(app);

handleError(app);

process.on("uncaughtException", (err) => {
  // log the exception
  logger.fatal(err, "uncaught exception detected");
});

app.listen(3000, () => {
  logger.info("Server is running on port 3000");
});
