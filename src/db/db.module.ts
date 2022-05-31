import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as models from './models';

@Module({
  imports: [
    // TODO: Read DB creds from config.
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'news_app',
      synchronize: true,
      entities: [...Object.values(models)],
    }),
  ],
})
export class DbModule {}
