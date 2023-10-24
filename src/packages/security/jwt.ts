import { UserDocument } from "@/database";
import jwt from "jsonwebtoken";

export const createToken = async (payload: any, expiresIn: string) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });

  return token;
};

export const createUserTokens = async (user: UserDocument) => {
  const payload = {
    id: user._id,
  };

  const accessToken = await createToken(payload, process.env.JWT_EXPIRES_IN);
  const refreshToken = await createToken(payload, process.env.JWT_EXPIRES_IN);

  return { accessToken, refreshToken };
};
