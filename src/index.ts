import "./init";

import { initControllers } from "./controllers";
import { connectToDatabase } from "./database/connect";
import logger from "./packages/logger";
import { handleError } from "./utils";
import { createApp } from "./app";

connectToDatabase();
const app = createApp();

initControllers(app);
handleError(app);

process.on("uncaughtException", (err) => {
  logger.fatal(err, "uncaught exception detected");
});

app.listen(3000, () => {
  logger.info("🎧 Server is running on port 3000");
});
