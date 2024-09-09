import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '../enums/user-status.enum';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(UserStatus)
  state?: UserStatus;

  constructor(username: string, email: string, password: string, state?: UserStatus) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.state = state;
  }
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  state?: UserStatus;
}

export class SetUserStateDto {
  @IsEnum(UserStatus)
  state: UserStatus;

  constructor(state: UserStatus) {
    this.state = state;
  }
}
