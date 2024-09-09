import { UserStatus } from '../enums/user-status.enum';

export class SetUserStateDto {
  state!: UserStatus;
}
