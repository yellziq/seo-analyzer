import { BadRequestException, Injectable } from '@nestjs/common';
import { AiService } from './ai.service';
import { AnalyzeSeoDto } from './seo.controller';
import { ParserService } from './parser.service';
import { ScorerService, SeoCheck } from './scorer.service';
import { ScraperService } from './scraper.service';

export type SeoAnalyzeResult = {
  score: number;
  checks: SeoCheck[];
  aiReview: string;
};

@Injectable()
export class SeoService {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly parserService: ParserService,
    private readonly scorerService: ScorerService,
    private readonly aiService: AiService,
  ) {}

  async analyze(payload: AnalyzeSeoDto): Promise<SeoAnalyzeResult> {
    if (!payload.url && !payload.html) {
      throw new BadRequestException('Provide either url or html.');
    }

    const html = payload.url
      ? await this.scraperService.fetchHtml(payload.url)
      : payload.html;

    if (!html) {
      throw new BadRequestException('HTML content is empty.');
    }

    const parsedData = this.parserService.parse(html, payload.url);
    const { score, checks } = this.scorerService.score(parsedData);
    const aiReview = await this.aiService.generateReview(checks);

    return {
      score,
      checks,
      aiReview,
    };
  }
}
