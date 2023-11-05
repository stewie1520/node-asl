import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { handleUnaryCall } from "@grpc/grpc-js";
import { NotificationRequest } from "../proto/notification_pb";
import { INotificationServer } from "../proto/notification_grpc_pb";

export class NotificationServer implements INotificationServer {
  [name: string]: import("@grpc/grpc-js").UntypedHandleCall;

  push: handleUnaryCall<NotificationRequest, Empty> = (call, callback) => {
    const notificationId = call.request.getNotificationid();
    console.log(`Received notification ${notificationId}`);

    callback(null, new Empty());
  };
}
