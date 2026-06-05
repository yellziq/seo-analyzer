import { Body, Controller, Post } from '@nestjs/common';
import { SeoService } from './seo.service';

export type AnalyzeSeoDto = {
  url?: string;
  html?: string;
};

@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Post('analyze')
  analyze(@Body() body: AnalyzeSeoDto) {
    return this.seoService.analyze(body);
  }
}
