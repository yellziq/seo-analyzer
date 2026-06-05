import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { ParserService } from './parser.service';
import { ScorerService } from './scorer.service';
import { ScraperService } from './scraper.service';
import { SeoController } from './seo.controller';
import { SeoService } from './seo.service';

@Module({
  imports: [ConfigModule],
  controllers: [SeoController],
  providers: [
    SeoService,
    ScraperService,
    ParserService,
    ScorerService,
    AiService,
  ],
})
export class SeoModule {}
