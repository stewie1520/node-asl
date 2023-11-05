import { Server, ServerCredentials } from "@grpc/grpc-js";
import { NotificationService } from "./proto/notification_grpc_pb";
import { NotificationServer } from "./notification";
import logger from "@/packages/logger";

export const startGrpcServer = async () => {
  const server = new Server();
  server.addService(NotificationService, new NotificationServer());

  const grpcPort = await new Promise((resolve, reject) => {
    server.bindAsync(
      process.env.GRPC_DNS,
      ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          reject(error);
        }

        resolve(port);
      },
    );
  });

  logger.info(`🚀 gRPC server is running on port ${grpcPort}`);
  server.start();
};
