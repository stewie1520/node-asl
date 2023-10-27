import { RedisClientType, createClient } from "redis";
import logger from "../logger";

let client: RedisClientType;

const connectToRedis = async () => {
  if (client) return;

  client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on("error", (err) => {
    logger.fatal("redis error " + err);
  });

  client.on("ready", () => {
    logger.info("🚀 redis ready");
  });

  await client.connect();
};

export { client, connectToRedis };
