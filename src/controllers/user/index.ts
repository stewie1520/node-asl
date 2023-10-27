import { UserModel } from "@/database";
import { createUserTokens } from "@/packages/security/jwt";
import { UserAuthenticationService } from "@/services/user-authentication";
import { zMiddleware } from "@/utils";
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

    return UserAuthenticationService.generateOTPForSignUp(phone);
  }

  @Post("verify-otp")
  @Middlewares(zMiddleware(verifyOTPValidation))
  public async verifyOTP(
    @Body() { sessionId, otp }: z.infer<typeof verifyOTPValidation>["body"],
  ) {
    return UserAuthenticationService.verifySignUpOTP(sessionId, otp);
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
    const user = await UserAuthenticationService.createNewUserWithSessionId(
      sessionId,
      {
        name,
        password,
      },
    );

    return await createUserTokens(user);
  }

  @Get("me")
  @Security("api_key")
  @Response<GetCurrentUserDto>("200")
  public async me(): Promise<GetCurrentUserDto> {
    const user = await UserAuthenticationService.getCurrentUser();
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
    return UserAuthenticationService.loginByPhone(phone, password);
  }
}
