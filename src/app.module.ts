import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth';
import { RolesGuard } from './auth/roles';
import { CategoriesModule } from './categories';
import { CoreModule } from './core';
import { DbModule } from './db';
import { NewsModule } from './news';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    DbModule,
    CoreModule,
    CategoriesModule,
    NewsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
