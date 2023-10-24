import logger from "@/logger";
import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      maxConnecting: 10,
      maxPoolSize: 10,
      minPoolSize: 0,
      maxIdleTimeMS: 10000,
    });

    logger.info("📀 Connected to MongoDB");
  } catch (error) {
    logger.fatal("😱 Failed to connect to MongoDB", error);
  }
};
