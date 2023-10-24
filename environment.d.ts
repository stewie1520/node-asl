declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URL: string;
      PINO_LOG_LEVEL: string;
      ENV: "development" | "staging" | "production";
    }
  }
}

export {};
