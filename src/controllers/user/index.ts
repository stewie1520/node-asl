import { getUserOTPRepository } from "@/cache";
import { UserModel } from "@/database";
import { getCurrentUser } from "@/packages/asl";
import { createUserTokens } from "@/packages/security/jwt";
import { comparePassword, hashPassword } from "@/packages/security/password";
import { zMiddleware } from "@/utils";
import { EntityId } from "redis-om";
import {
  Body,
  Controller,
  Get,
  Middlewares,
  Post,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";
import { z } from "zod";
import { GetCurrentUserDto, TokensDto } from "./dto";
import {
  loginValidation,
  registerAccountValidation,
  sendOTPToRegisterValidation,
  verifyOTPValidation,
} from "./validation";

@Route("users")
@Tags("users")
export class UserController extends Controller {
  @Post("send-otp-phone")
  @Middlewares(zMiddleware(sendOTPToRegisterValidation))
  public async sendOTPToRegister(
    @Body() { phone }: z.infer<typeof sendOTPToRegisterValidation>["body"],
  ) {
    const user = await UserModel.findOne({ phone });
    if (user) {
      throw new Error("Phone is already existed");
    }

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

    await userOTPRepository.expire(entityId, 5 * 60);

    return {
      sessionId: userOTP.sessionId,
      issuedAt: userOTP.issuedAt,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000),
    };
  }

  @Post("verify-otp")
  @Middlewares(zMiddleware(verifyOTPValidation))
  public async verifyOTP(
    @Body() { sessionId, otp }: z.infer<typeof verifyOTPValidation>["body"],
  ) {
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
    await userOTPRepository.expire(entityId!, 30 * 60);

    userOTP.verified = true;
    await userOTPRepository.save(userOTP);

    return {
      sessionId: userOTP.sessionId,
      issuedAt: userOTP.issuedAt,
      expiredAt: new Date(Date.now() + 30 * 60 * 1000),
    };
  }

  @Post("register-account")
  @Response<TokensDto>("200")
  @Middlewares(zMiddleware(registerAccountValidation))
  public async registerAccount(
    @Body()
    {
      name,
      sessionId,
      password,
    }: z.infer<typeof registerAccountValidation>["body"],
  ): Promise<TokensDto> {
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
      name,
      phone,
      password: await hashPassword(password),
    });

    return await createUserTokens(user);
  }

  @Get("me")
  @Security("api_key")
  @Response<GetCurrentUserDto>("200")
  public async me(): Promise<GetCurrentUserDto> {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  @Post("login")
  @Response<TokensDto>("200")
  @Middlewares(zMiddleware(loginValidation))
  public async login(
    @Body() { phone, password }: z.infer<typeof loginValidation>["body"],
  ): Promise<TokensDto> {
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
}
