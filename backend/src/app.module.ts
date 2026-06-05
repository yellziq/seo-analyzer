import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeoModule } from './seo/seo.module';

@Module({
  imports: [ConfigModule.forRoot(), SeoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
