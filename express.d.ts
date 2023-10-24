import { UserDocument } from "@/database";

declare global {
  namespace Express {
    interface User extends Omit<UserDocument, "password"> {}

    interface Request {
      user?: User;
    }
  }
}

export {};
