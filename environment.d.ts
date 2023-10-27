declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URL: string;
      PINO_LOG_LEVEL: string;
      ENV: "development" | "staging" | "production";
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      JWT_REFRESH_EXPIRES_IN: string;
      REDIS_URL: string;
    }
  }
}

export {};
