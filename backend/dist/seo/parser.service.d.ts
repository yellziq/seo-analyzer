export type ParsedSeoData = {
    title: {
        text: string | null;
        length: number;
    };
    metaDescription: {
        text: string | null;
        length: number;
    };
    h1: {
        count: number;
        firstValue: string | null;
    };
    headings: {
        count: number;
    };
    canonical: {
        href: string | null;
    };
    robotsMeta: {
        content: string | null;
    };
    openGraph: {
        ogTitle: boolean;
        ogDescription: boolean;
        ogImage: boolean;
    };
    images: {
        totalCount: number;
        withoutAltCount: number;
    };
    url: {
        value: string | null;
        length: number;
    };
    htmlLang: {
        value: string | null;
    };
    textContent: {
        length: number;
        htmlLength: number;
        ratio: number;
    };
    isHttps: boolean;
};
export declare class ParserService {
    parse(html: string, url?: string): ParsedSeoData;
    private cleanText;
    private extractTextContent;
}
