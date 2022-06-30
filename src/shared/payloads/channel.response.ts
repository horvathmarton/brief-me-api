import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class Channel {
  @Expose()
  @ApiProperty()
  public id: number;

  @Expose()
  @ApiProperty()
  public title: string;

  public keywords: string[];

  constructor(partial: Partial<Channel>) {
    Object.assign(this, partial);
  }
}
