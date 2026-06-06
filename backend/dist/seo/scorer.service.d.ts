import { ParsedSeoData } from './parser.service';
export type SeoCheckStatus = 'Passed' | 'Warning' | 'Failed';
export type SeoCheck = {
    tag: string;
    status: SeoCheckStatus;
    description: string;
};
export type SeoScoreResult = {
    score: number;
    checks: SeoCheck[];
};
export declare class ScorerService {
    score(data: ParsedSeoData): SeoScoreResult;
    private scoreTitle;
    private scoreMetaDescription;
    private scoreH1;
    private scoreHeadings;
    private scoreCanonical;
    private scoreRobotsMeta;
    private scoreOpenGraph;
    private scoreImagesAlt;
    private scoreHttps;
    private scoreUrlLength;
    private scoreHtmlLang;
    private scoreTextContent;
    private scoreViewport;
    private scoreFavicon;
    private scoreRobotsTxt;
    private scoreSitemapXml;
    private scoreSchemaOrg;
    private scoreBrokenLinks;
    private scoreLinkBalance;
    private scoreHtmlSize;
    private scoreWordCount;
    private scoreHreflang;
    private scoreDuplicateHeadings;
    private scoreLargeImages;
}
