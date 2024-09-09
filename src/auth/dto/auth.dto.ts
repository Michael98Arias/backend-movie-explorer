import { IsNotEmpty, IsString, IsOptional, ValidateIf, IsDefined } from 'class-validator';

export class AuthDto {
  @ValidateIf(o => !o.email)
  @IsString()
  @IsOptional()
  username?: string;

  @ValidateIf(o => !o.username)
  @IsString()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
