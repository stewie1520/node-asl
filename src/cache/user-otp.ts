import { client } from "@/packages/redis";
import { Repository, Schema } from "redis-om";

const schema = new Schema("user-otp", {
  sessionId: { type: "string", indexed: true },
  phone: { type: "string", indexed: true },
  otp: { type: "string" },
  issuedAt: { type: "date" },
  verified: { type: "boolean" },
});

let userOTPRepository: Repository;

export const getUserOTPRepository = async () => {
  if (userOTPRepository) {
    return userOTPRepository;
  }

  userOTPRepository = new Repository(schema, client);
  await userOTPRepository.createIndex();
  return userOTPRepository;
};
