import { UnauthenticatedError } from "@/packages/error";
import express from "express";
import passport from "passport";
import asl from "../asl";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scopes?: string[],
) {
  if (securityName === "api_key") {
    return extractUser(request);
  }

  return Promise.reject(new UnauthenticatedError());
}

const extractUser = (request: express.Request) =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      function callback(err?: Error, user?: Express.User) {
        if (err || !user) {
          return reject(new UnauthenticatedError(err?.message));
        }

        asl.setCurrentUser(user);
        return resolve(user);
      },
    )(request);
  });

export * from "./jwt.strategy";
