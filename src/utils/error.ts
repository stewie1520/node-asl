import { Boom, internal } from "@hapi/boom";
import { Express, NextFunction, Response } from "express";
import { omit } from "lodash";

export const handleError = (app: Express) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _: any, res: Response, next: NextFunction) => {
    let boomErr: Boom = err;

    if (!err.isBoom) {
      boomErr = internal(err);
    }

    res
      .status(boomErr.output.statusCode)
      .header(boomErr.output.headers)
      .json({
        ...boomErr.output.payload,
        ...(boomErr.data?.isZod && {
          data: JSON.parse(boomErr.output.payload.message),
          ...lookup(CODES.VALIDATION),
        }),
        ...(boomErr.data?.code && {
          ...lookup(boomErr.data.code),
          data: omit(boomErr.data, "code"),
        }),
      });
  });
};

export const CODES = {
  VALIDATION: "validation",
  NOT_FOUND: "not_found",
  UNAUTHORIZED: "unauthorized",
  FORBIDDEN: "forbidden",
  CONFLICT: "conflict",
  INTERNAL: "internal",
  UNAVAILABLE: "unavailable",
  UNKNOWN: "unknown",
};

const messages = {
  [CODES.VALIDATION]: "Validation error",
  [CODES.NOT_FOUND]: "Not found",
  [CODES.UNAUTHORIZED]: "Unauthorized",
  [CODES.FORBIDDEN]: "Forbidden",
  [CODES.CONFLICT]: "Conflict",
  [CODES.INTERNAL]: "Internal server error",
  [CODES.UNAVAILABLE]: "Service unavailable",
  [CODES.UNKNOWN]: "Unknown error",
};

const lookup = (code: string, fallbackMessage?: string) => {
  return {
    code,
    message:
      messages[code as keyof typeof CODES] ||
      fallbackMessage ||
      messages.UNKNOWN,
  };
};
