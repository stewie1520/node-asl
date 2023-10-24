import { Handler } from "express";
import z from "zod";

import { UserModel } from "@/database";
import logger from "@/packages/logger";
import { createUserTokens } from "@/packages/security/jwt";
import { hashPassword } from "@/packages/security/password";
import { UserExistedError, zParse } from "@/utils";

const zodSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    password: z.string().min(8).max(255),
  }),
});

export const registerAccount: Handler = async (req, res, next) => {
  try {
    const { body } = await zParse(zodSchema, req);
    const { name, email, password } = body;

    const isExisted = await UserModel.exists({ email });
    if (isExisted) {
      throw new UserExistedError("Email is already existed", { email });
    }

    const user = await UserModel.create({
      name,
      email,
      password: await hashPassword(password),
    });

    res.json(await createUserTokens(user));
  } catch (error: any) {
    logger.debug(error);
    next(error);
  }
};
