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
      GRPC_DNS: string;

      S3_REGION: string;
      S3_ACCESS_SECRET: string;
      S3_ACCESS_KEY: string;
      S3_BUCKET_NAME: string;
      S3_ENDPOINT: string;
    }
  }
}

export {};
