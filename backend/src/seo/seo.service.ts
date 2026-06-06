import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
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
      throw new BadRequestException('Передайте URL или HTML.');
    }

    let html: string | undefined;

    if (payload.url) {
      try {
        html = await this.scraperService.fetchHtml(payload.url);
      } catch (error: unknown) {
        return this.createUrlFetchFailureResult(payload.url, error);
      }
    } else {
      html = payload.html;
    }

    if (!html) {
      throw new BadRequestException('HTML-контент пустой.');
    }

    const parsedData = this.parserService.parse(html, payload.url);

    if (payload.url) {
      const [robotsTxt, sitemapXml, brokenLinks, largeImagesCount] =
        await Promise.all([
          this.scraperService.checkTechnicalFile(payload.url, 'robots.txt'),
          this.scraperService.checkTechnicalFile(payload.url, 'sitemap.xml'),
          this.scraperService.checkLinks(parsedData.links.urls),
          this.scraperService.countLargeImages(parsedData.imageSize.urls),
        ]);

      parsedData.technicalFiles = {
        robotsTxt,
        sitemapXml,
      };
      parsedData.brokenLinks = brokenLinks;
      parsedData.imageSize.oversizedCount += largeImagesCount;
    }

    const { score, checks } = this.scorerService.score(parsedData);
    const aiReview = await this.aiService.generateReview(checks);

    return {
      score,
      checks,
      aiReview,
    };
  }

  private async createUrlFetchFailureResult(
    url: string,
    error: unknown,
  ): Promise<SeoAnalyzeResult> {
    const reason = this.extractErrorMessage(error);
    const checks: SeoCheck[] = [
      {
        tag: 'URL Fetch',
        status: 'Failed',
        description: `Не удалось загрузить HTML по адресу ${url}. Причина: ${reason}. Вставьте HTML-код страницы вручную или попробуйте другой URL.`,
      },
    ];
    const aiReview = await this.aiService.generateReview(checks);

    return {
      score: 0,
      checks,
      aiReview,
    };
  }

  private extractErrorMessage(error: unknown): string {
    if (!(error instanceof HttpException)) {
      return 'Неизвестная ошибка загрузки.';
    }

    const response = error.getResponse();

    if (typeof response === 'string') {
      return response;
    }

    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      const message = response.message;

      if (Array.isArray(message)) {
        return message.join(', ');
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    return error.message;
  }
}
