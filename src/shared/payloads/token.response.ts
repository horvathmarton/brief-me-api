import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TokenResponse {
  @Expose()
  public token: string;

  constructor(partial: Partial<TokenResponse>) {
    Object.assign(this, partial);
  }
}
