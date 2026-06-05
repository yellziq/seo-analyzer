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
export declare class SeoService {
    private readonly scraperService;
    private readonly parserService;
    private readonly scorerService;
    private readonly aiService;
    constructor(scraperService: ScraperService, parserService: ParserService, scorerService: ScorerService, aiService: AiService);
    analyze(payload: AnalyzeSeoDto): Promise<SeoAnalyzeResult>;
}
