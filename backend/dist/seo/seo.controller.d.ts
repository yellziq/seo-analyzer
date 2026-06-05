import { SeoService } from './seo.service';
export type AnalyzeSeoDto = {
    url?: string;
    html?: string;
};
export declare class SeoController {
    private readonly seoService;
    constructor(seoService: SeoService);
    analyze(body: AnalyzeSeoDto): Promise<import("./seo.service").SeoAnalyzeResult>;
}
