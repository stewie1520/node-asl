import { Boom, boomify, internal } from "@hapi/boom";
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
        ...(boomErr.data?.code
          ? {
              ...lookup(boomErr.data.code),
              data: omit(boomErr.data, "code"),
            }
          : {
              code: CODES.UNKNOWN,
              message: boomErr.message,
              data: boomErr.data,
            }),
        ...(boomErr.data?.isZod && {
          data: JSON.parse(boomErr.output.payload.message),
          ...lookup(CODES.VALIDATION),
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

export class AppError {
  constructor(
    public code: keyof typeof CODES,
    public message?: string,
    public data: Record<string, unknown> = {},
  ) {
    return boomify(new Error(message), {
      data: { code: CODES[code], ...data },
      statusCode: 500,
    });
  }
}

export class UnauthenticatedError {
  constructor(message?: string) {
    return boomify(new Error(message), {
      data: { code: CODES.UNAUTHORIZED },
      statusCode: 401,
    });
  }
}

export class UserExistedError {
  constructor(message?: string, data: Record<string, unknown> = {}) {
    return boomify(new Error(message), {
      data: { code: "user_existed", ...data },
      statusCode: 400,
    });
  }
}
