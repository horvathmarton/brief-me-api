import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TokenResponse {
  @Expose()
  @ApiProperty()
  public token: string;

  constructor(partial: Partial<TokenResponse>) {
    Object.assign(this, partial);
  }
}
