import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SeoModule } from './seo/seo.module';

@Module({
  imports: [ConfigModule.forRoot(), SeoModule],
})
export class AppModule {}
