// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var notification_pb = require('./notification_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_notification_NotificationRequest(arg) {
  if (!(arg instanceof notification_pb.NotificationRequest)) {
    throw new Error('Expected argument of type notification.NotificationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_notification_NotificationRequest(buffer_arg) {
  return notification_pb.NotificationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var NotificationService = exports.NotificationService = {
  push: {
    path: '/notification.Notification/push',
    requestStream: false,
    responseStream: false,
    requestType: notification_pb.NotificationRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_notification_NotificationRequest,
    requestDeserialize: deserialize_notification_NotificationRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
};

exports.NotificationClient = grpc.makeGenericClientConstructor(NotificationService);
