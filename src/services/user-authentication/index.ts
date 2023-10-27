import { getUserOTPRepository } from "@/cache";
import { UserModel } from "@/database";
import asl from "@/packages/asl";
import { client } from "@/packages/redis";
import { createUserTokens } from "@/packages/security/jwt";
import { comparePassword, hashPassword } from "@/packages/security/password";
import { EntityId } from "redis-om";

export class UserAuthenticationService {
  static readonly OTP_VERIFY_TTL = 5 * 60;
  static readonly SESSION_SIGNUP_TTL = 30 * 60;

  /**
   * Generate OTP for sign up. Will return the existing OTP if it is not expired.
   */
  static async generateOTPForSignUp(phone: string) {
    const userOTPRepository = await getUserOTPRepository();
    let userOTP = await userOTPRepository
      .search()
      .where("phone")
      .equals(phone)
      .and("verified")
      .is.false()
      .first();

    if (userOTP) {
      return {
        sessionId: userOTP.sessionId,
        issuedAt: userOTP.issuedAt,
        expiredAt: new Date(
          new Date().getTime() + (await client.ttl(userOTP[EntityId]!)) * 1000,
        ),
      };
    }

    userOTP = {
      sessionId: "user-otp-" + crypto.randomUUID(),
      phone,
      otp: Math.random().toString().slice(2, 8),
      issuedAt: new Date(),
      verified: false,
    };

    userOTP = await userOTPRepository.save(userOTP);
    const entityId = userOTP?.[EntityId];
    if (!entityId) {
      throw new Error("Cannot send user OTP");
    }

    await userOTPRepository.expire(entityId, this.OTP_VERIFY_TTL);

    return {
      sessionId: userOTP.sessionId,
      issuedAt: userOTP.issuedAt,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000),
    };
  }

  /**
   * Verify a otp against session, will make the session valid for next 30 mins, so user could enter password, name... to register
   * @param sessionId
   * @param otp
   * @returns
   */
  static async verifySignUpOTP(sessionId: string, otp: string) {
    const userOTPRepository = await getUserOTPRepository();
    const userOTP = await userOTPRepository
      .search()
      .where("sessionId")
      .equals(sessionId)
      .and("otp")
      .equals(otp)
      .and("verified")
      .is.false()
      .first();

    if (!userOTP) {
      throw new Error("Invalid OTP");
    }

    const entityId = userOTP[EntityId];
    await userOTPRepository.expire(entityId!, this.SESSION_SIGNUP_TTL);

    userOTP.verified = true;
    await userOTPRepository.save(userOTP);

    return {
      sessionId: userOTP.sessionId,
      issuedAt: userOTP.issuedAt,
      expiredAt: new Date(Date.now() + this.SESSION_SIGNUP_TTL * 1000),
    };
  }

  /**
   * Retrieve phone number from session id and create a new user
   */
  static async createNewUserWithSessionId(
    sessionId: string,
    createUserParams: {
      name: string;
      password: string;
    },
  ) {
    const userOTPRepository = await getUserOTPRepository();
    const userOTP = await userOTPRepository
      .search()
      .where("sessionId")
      .equals(sessionId)
      .and("verified")
      .is.true()
      .first();

    if (!userOTP) {
      throw new Error("Invalid sessionId");
    }

    const { phone } = userOTP;
    await userOTPRepository.remove(userOTP[EntityId]!);

    const user = await UserModel.create({
      name: createUserParams.name,
      phone,
      password: await hashPassword(createUserParams.password),
    });

    return user;
  }

  static async loginByPhone(phone: string, password: string) {
    const user = await UserModel.findOne({ phone });
    if (!user) {
      throw new Error("Credentials is not correct");
    }

    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Credentials is not correct");
    }

    return await createUserTokens(user);
  }

  static async getCurrentUser() {
    return asl.getCurrentUser();
  }
}
