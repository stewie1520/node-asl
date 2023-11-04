import { UserModel } from "@/database";
import { createUserTokens } from "@/packages/security";
import { Validation } from "@/packages/validation";
import { UserAuthenticationService } from "@/services/user-authentication";
import {
  Body,
  Controller,
  Get,
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
  @Validation(sendOTPToRegisterValidation)
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
  @Validation(verifyOTPValidation)
  public async verifyOTP(
    @Body() { sessionId, otp }: z.infer<typeof verifyOTPValidation>["body"],
  ) {
    return UserAuthenticationService.verifySignUpOTP(sessionId, otp);
  }

  @Post("register-account")
  @Response<TokensDto>("200")
  @Validation(registerAccountValidation)
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
  @Validation(loginValidation)
  public async login(
    @Body() { phone, password }: z.infer<typeof loginValidation>["body"],
  ): Promise<TokensDto> {
    return UserAuthenticationService.loginByPhone(phone, password);
  }
}
