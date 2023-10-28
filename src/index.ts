import "./init";
import swaggerUi from "swagger-ui-express";
import { connectToDatabase } from "./database/connect";
import logger from "./packages/logger";
import { handleError } from "./utils";
import { createApp } from "./app";
import { useJwtStrategy } from "./packages/passport";
import { connectToRedis } from "./packages/redis";
import { RegisterRoutes } from "./controllers/routes";

const main = async () => {
  await Promise.all([connectToDatabase(), connectToRedis()]);
  const app = createApp();

  if (process.env.ENV !== "production") {
    app.use(
      "/docs",
      swaggerUi.serve,
      swaggerUi.setup(undefined, {
        swaggerOptions: {
          url: "/swagger.json",
        },
      }),
    );
  }

  useJwtStrategy();

  RegisterRoutes(app);

  handleError(app);

  process.on("uncaughtException", (err) => {
    logger.fatal(err, "uncaught exception detected");
    process.exit(1);
  });

  app.listen(3000, () => {
    logger.info("🎧 Server is running on port 3000");
  });
};

main();
