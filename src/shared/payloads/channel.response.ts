import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class Channel {
  @Expose()
  public id: number;

  @Expose()
  public title: string;

  public keywords: string[];

  constructor(partial: Partial<Channel>) {
    Object.assign(this, partial);
  }
}
