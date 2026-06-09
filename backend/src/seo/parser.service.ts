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
    wordCount: number;
  };
  viewport: {
    content: string | null;
  };
  favicon: {
    href: string | null;
  };
  schemaOrg: {
    count: number;
  };
  hreflang: {
    count: number;
  };
  links: {
    totalCount: number;
    internalCount: number;
    externalCount: number;
    urls: string[];
  };
  duplicateHeadings: {
    count: number;
    values: string[];
  };
  imageSize: {
    oversizedCount: number;
    urls: string[];
  };
  technicalFiles: {
    robotsTxt: boolean | null;
    sitemapXml: boolean | null;
  };
  brokenLinks: {
    checkedCount: number;
    brokenCount: number;
  };
  isHttps: boolean;
};

@Injectable()
export class ParserService {
  parse(html: string, url?: string): ParsedSeoData {
    const $ = cheerio.load(html);
    const normalizedUrl = this.normalizeUrl(url);
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
    const baseUrl = normalizedUrl ? new URL(normalizedUrl) : null;
    const links = this.extractLinks($, baseUrl);
    const imageUrls = this.extractImageUrls($, baseUrl);
    const duplicateHeadings = this.extractDuplicateHeadings($);
    const oversizedImagesByAttributes = this.countOversizedImagesByAttributes($);

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
        value: normalizedUrl,
        length: normalizedUrl?.length ?? 0,
      },
      htmlLang: {
        value: htmlLang,
      },
      textContent: {
        length: textContent.length,
        htmlLength,
        ratio: Number(textToHtmlRatio.toFixed(3)),
        wordCount: this.countWords(textContent),
      },
      viewport: {
        content: this.cleanText($('meta[name="viewport"]').attr('content')),
      },
      favicon: {
        href: this.cleanText(
          $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]')
            .first()
            .attr('href'),
        ),
      },
      schemaOrg: {
        count: $('script[type="application/ld+json"]').length,
      },
      hreflang: {
        count: $('link[rel="alternate"][hreflang]').length,
      },
      links,
      duplicateHeadings,
      imageSize: {
        oversizedCount: oversizedImagesByAttributes,
        urls: imageUrls,
      },
      technicalFiles: {
        robotsTxt: null,
        sitemapXml: null,
      },
      brokenLinks: {
        checkedCount: 0,
        brokenCount: 0,
      },
      isHttps: normalizedUrl ? new URL(normalizedUrl).protocol === 'https:' : false,
    };
  }

  private cleanText(value?: string): string | null {
    const text = value?.trim().replace(/\s+/g, ' ');
    return text ? text : null;
  }

  private normalizeUrl(value?: string): string | null {
    if (!value) {
      return null;
    }

    try {
      return new URL(value).toString();
    } catch {
      return null;
    }
  }

  private extractTextContent($: cheerio.CheerioAPI): string {
    const body = $('body').clone();
    body.find('script, style, noscript, svg').remove();

    return body.text().trim().replace(/\s+/g, ' ');
  }

  private countWords(text: string): number {
    if (!text) {
      return 0;
    }

    return text.split(/\s+/).filter(Boolean).length;
  }

  private extractLinks(
    $: cheerio.CheerioAPI,
    baseUrl: URL | null,
  ): ParsedSeoData['links'] {
    const urls = $('a[href]')
      .toArray()
      .map((link) => $(link).attr('href'))
      .filter((href): href is string => Boolean(href))
      .filter((href) => !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:'))
      .map((href) => this.resolveUrl(href, baseUrl))
      .filter((href): href is string => Boolean(href));

    const internalCount = urls.filter((href) => {
      if (!baseUrl) {
        return href.startsWith('/') || !/^[a-z][a-z\d+\-.]*:/i.test(href);
      }

      return new URL(href).hostname === baseUrl.hostname;
    }).length;

    return {
      totalCount: urls.length,
      internalCount,
      externalCount: urls.length - internalCount,
      urls,
    };
  }

  private resolveUrl(href: string, baseUrl: URL | null): string | null {
    try {
      return baseUrl ? new URL(href, baseUrl).toString() : href;
    } catch {
      return null;
    }
  }

  private extractDuplicateHeadings(
    $: cheerio.CheerioAPI,
  ): ParsedSeoData['duplicateHeadings'] {
    const headings = $('h1, h2, h3, h4, h5, h6')
      .toArray()
      .map((heading) => this.cleanText($(heading).text())?.toLowerCase())
      .filter((heading): heading is string => Boolean(heading));
    const counts = new Map<string, number>();

    headings.forEach((heading) => {
      counts.set(heading, (counts.get(heading) ?? 0) + 1);
    });

    const values = Array.from(counts.entries())
      .filter(([, count]) => count > 1)
      .map(([heading]) => heading);

    return {
      count: values.length,
      values,
    };
  }

  private countOversizedImagesByAttributes($: cheerio.CheerioAPI): number {
    return $('img')
      .toArray()
      .filter((image) => {
        const width = Number($(image).attr('width') ?? 0);
        const height = Number($(image).attr('height') ?? 0);

        return width > 2000 || height > 2000;
      }).length;
  }

  private extractImageUrls($: cheerio.CheerioAPI, baseUrl: URL | null): string[] {
    return $('img[src]')
      .toArray()
      .map((image) => $(image).attr('src'))
      .filter((src): src is string => Boolean(src))
      .map((src) => this.resolveUrl(src, baseUrl))
      .filter((src): src is string => Boolean(src));
  }
}
