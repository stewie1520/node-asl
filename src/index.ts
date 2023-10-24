import "./init";

import { initControllers } from "./controllers";
import { connectToDatabase } from "./database/connect";
import logger from "./packages/logger";
import { handleError } from "./utils";
import { createApp } from "./app";
import { useJwtStrategy } from "./packages/passport";

connectToDatabase();
const app = createApp();

useJwtStrategy();

initControllers(app);
handleError(app);

process.on("uncaughtException", (err) => {
  logger.fatal(err, "uncaught exception detected");
  process.exit(1);
});

app.listen(3000, () => {
  logger.info("🎧 Server is running on port 3000");
});
