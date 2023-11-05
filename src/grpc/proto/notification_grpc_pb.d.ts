// package: notification
// file: notification.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as notification_pb from "./notification_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface INotificationService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    push: INotificationService_Ipush;
}

interface INotificationService_Ipush extends grpc.MethodDefinition<notification_pb.NotificationRequest, google_protobuf_empty_pb.Empty> {
    path: "/notification.Notification/push";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<notification_pb.NotificationRequest>;
    requestDeserialize: grpc.deserialize<notification_pb.NotificationRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}

export const NotificationService: INotificationService;

export interface INotificationServer extends grpc.UntypedServiceImplementation {
    push: grpc.handleUnaryCall<notification_pb.NotificationRequest, google_protobuf_empty_pb.Empty>;
}

export interface INotificationClient {
    push(request: notification_pb.NotificationRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    push(request: notification_pb.NotificationRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    push(request: notification_pb.NotificationRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class NotificationClient extends grpc.Client implements INotificationClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public push(request: notification_pb.NotificationRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public push(request: notification_pb.NotificationRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public push(request: notification_pb.NotificationRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}
