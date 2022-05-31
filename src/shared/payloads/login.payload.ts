import { IsString } from 'class-validator';

export class LoginPayload {
  @IsString()
  public username: string;

  @IsString()
  public password: string;
}
