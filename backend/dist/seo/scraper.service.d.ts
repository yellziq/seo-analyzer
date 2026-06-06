export type LinkCheckResult = {
    checkedCount: number;
    brokenCount: number;
};
export declare class ScraperService {
    fetchHtml(url: string): Promise<string>;
    checkTechnicalFile(url: string, fileName: string): Promise<boolean>;
    checkLinks(urls: string[], limit?: number): Promise<LinkCheckResult>;
    countLargeImages(urls: string[], limit?: number): Promise<number>;
    private checkResource;
    private getContentLength;
}
