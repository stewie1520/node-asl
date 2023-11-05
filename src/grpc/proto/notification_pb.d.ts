// package: notification
// file: notification.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class NotificationRequest extends jspb.Message { 
    getNotificationid(): string;
    setNotificationid(value: string): NotificationRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NotificationRequest.AsObject;
    static toObject(includeInstance: boolean, msg: NotificationRequest): NotificationRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: NotificationRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NotificationRequest;
    static deserializeBinaryFromReader(message: NotificationRequest, reader: jspb.BinaryReader): NotificationRequest;
}

export namespace NotificationRequest {
    export type AsObject = {
        notificationid: string,
    }
}
