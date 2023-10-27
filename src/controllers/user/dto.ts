export class GetCurrentUserDto {
  name: string;
  phone: string;
  email: string;
}

export class TokensDto {
  accessToken: string;
  refreshToken: string;
}
