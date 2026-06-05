import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

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

@Injectable()
export class ParserService {
  parse(html: string, url?: string): ParsedSeoData {
    const $ = cheerio.load(html);
    const titleText = this.cleanText($('title').first().text());
    const metaDescription = this.cleanText(
      $('meta[name="description"]').attr('content'),
    );
    const h1Elements = $('h1');
    const firstH1 = this.cleanText(h1Elements.first().text());
    const canonicalHref = this.cleanText(
      $('link[rel="canonical"]').attr('href'),
    );
    const robotsContent = this.cleanText($('meta[name="robots"]').attr('content'));
    const htmlLang = this.cleanText($('html').attr('lang'));
    const textContent = this.extractTextContent($);
    const htmlLength = html.length;
    const textToHtmlRatio = htmlLength > 0 ? textContent.length / htmlLength : 0;

    const totalImages = $('img').length;
    const imagesWithoutAlt = $('img')
      .toArray()
      .filter((image) => {
        const alt = $(image).attr('alt');
        return alt === undefined || alt.trim().length === 0;
      }).length;

    return {
      title: {
        text: titleText,
        length: titleText?.length ?? 0,
      },
      metaDescription: {
        text: metaDescription,
        length: metaDescription?.length ?? 0,
      },
      h1: {
        count: h1Elements.length,
        firstValue: firstH1,
      },
      headings: {
        count: $('h2, h3, h4, h5, h6').length,
      },
      canonical: {
        href: canonicalHref,
      },
      robotsMeta: {
        content: robotsContent,
      },
      openGraph: {
        ogTitle: Boolean(this.cleanText($('meta[property="og:title"]').attr('content'))),
        ogDescription: Boolean(
          this.cleanText($('meta[property="og:description"]').attr('content')),
        ),
        ogImage: Boolean(this.cleanText($('meta[property="og:image"]').attr('content'))),
      },
      images: {
        totalCount: totalImages,
        withoutAltCount: imagesWithoutAlt,
      },
      url: {
        value: url ?? null,
        length: url?.length ?? 0,
      },
      htmlLang: {
        value: htmlLang,
      },
      textContent: {
        length: textContent.length,
        htmlLength,
        ratio: Number(textToHtmlRatio.toFixed(3)),
      },
      isHttps: url ? new URL(url).protocol === 'https:' : false,
    };
  }

  private cleanText(value?: string): string | null {
    const text = value?.trim().replace(/\s+/g, ' ');
    return text ? text : null;
  }

  private extractTextContent($: cheerio.CheerioAPI): string {
    const body = $('body').clone();
    body.find('script, style, noscript, svg').remove();

    return body.text().trim().replace(/\s+/g, ' ');
  }
}
