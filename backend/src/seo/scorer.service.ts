import { Injectable } from '@nestjs/common';
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

@Injectable()
export class ScorerService {
  score(data: ParsedSeoData): SeoScoreResult {
    const checks: SeoCheck[] = [
      this.scoreTitle(data),
      this.scoreMetaDescription(data),
      this.scoreH1(data),
      this.scoreHeadings(data),
      this.scoreCanonical(data),
      this.scoreRobotsMeta(data),
      this.scoreOpenGraph(data),
      this.scoreImagesAlt(data),
      this.scoreHttps(data),
      this.scoreUrlLength(data),
      this.scoreHtmlLang(data),
      this.scoreTextContent(data),
    ];

    const penalty = checks.reduce((total, check) => {
      if (check.status === 'Warning') {
        return total + 5;
      }

      if (check.status === 'Failed') {
        return total + 15;
      }

      return total;
    }, 0);

    return {
      score: Math.max(0, 100 - penalty),
      checks,
    };
  }

  private scoreTitle(data: ParsedSeoData): SeoCheck {
    const length = data.title.length;

    if (!data.title.text) {
      return {
        tag: 'Title',
        status: 'Failed',
        description: 'Title is missing.',
      };
    }

    if (length > 70) {
      return {
        tag: 'Title',
        status: 'Failed',
        description: `Title length is ${length} characters, which is too long for search results.`,
      };
    }

    if (length >= 10 && length <= 60) {
      return {
        tag: 'Title',
        status: 'Passed',
        description: `Title length is ${length} characters, which is within the recommended range.`,
      };
    }

    if (length >= 61 && length <= 70) {
      return {
        tag: 'Title',
        status: 'Warning',
        description: `Title length is ${length} characters. It may be truncated in search results.`,
      };
    }

    return {
      tag: 'Title',
      status: 'Warning',
      description: `Title length is ${length} characters, which is shorter than the recommended minimum.`,
    };
  }

  private scoreMetaDescription(data: ParsedSeoData): SeoCheck {
    const length = data.metaDescription.length;

    if (!data.metaDescription.text) {
      return {
        tag: 'Meta Description',
        status: 'Failed',
        description: 'Meta description is missing.',
      };
    }

    if (length >= 50 && length <= 160) {
      return {
        tag: 'Meta Description',
        status: 'Passed',
        description: `Meta description length is ${length} characters.`,
      };
    }

    if (length < 50) {
      return {
        tag: 'Meta Description',
        status: 'Warning',
        description: `Meta description is too short at ${length} characters. Add more useful summary text.`,
      };
    }

    return {
      tag: 'Meta Description',
      status: 'Warning',
      description: `Meta description is too long at ${length} characters and may be truncated.`,
    };
  }

  private scoreH1(data: ParsedSeoData): SeoCheck {
    if (data.h1.count === 1) {
      return {
        tag: 'H1',
        status: 'Passed',
        description: `One H1 is present: "${data.h1.firstValue}".`,
      };
    }

    if (data.h1.count > 1) {
      return {
        tag: 'H1',
        status: 'Warning',
        description: `${data.h1.count} H1 tags were found. Use one primary H1.`,
      };
    }

    return {
      tag: 'H1',
      status: 'Failed',
      description: 'No H1 tag was found.',
    };
  }

  private scoreHeadings(data: ParsedSeoData): SeoCheck {
    if (data.headings.count >= 1) {
      return {
        tag: 'H2-H6',
        status: 'Passed',
        description: `${data.headings.count} secondary heading tags were found.`,
      };
    }

    return {
      tag: 'H2-H6',
      status: 'Warning',
      description: 'No H2-H6 heading tags were found.',
    };
  }

  private scoreCanonical(data: ParsedSeoData): SeoCheck {
    if (data.canonical.href) {
      return {
        tag: 'Canonical',
        status: 'Passed',
        description: `Canonical URL is set to ${data.canonical.href}.`,
      };
    }

    return {
      tag: 'Canonical',
      status: 'Failed',
      description: 'Canonical tag is missing.',
    };
  }

  private scoreRobotsMeta(data: ParsedSeoData): SeoCheck {
    const content = data.robotsMeta.content?.toLowerCase();

    if (!content) {
      return {
        tag: 'Robots Meta',
        status: 'Warning',
        description: 'Robots meta tag is missing.',
      };
    }

    if (content.includes('noindex')) {
      return {
        tag: 'Robots Meta',
        status: 'Failed',
        description: 'Robots meta tag contains noindex.',
      };
    }

    if (content.includes('index')) {
      return {
        tag: 'Robots Meta',
        status: 'Passed',
        description: `Robots meta tag allows indexing: "${data.robotsMeta.content}".`,
      };
    }

    return {
      tag: 'Robots Meta',
      status: 'Warning',
      description: `Robots meta tag exists, but indexing intent is unclear: "${data.robotsMeta.content}".`,
    };
  }

  private scoreOpenGraph(data: ParsedSeoData): SeoCheck {
    const values = Object.values(data.openGraph);
    const presentCount = values.filter(Boolean).length;

    if (presentCount === values.length) {
      return {
        tag: 'Open Graph',
        status: 'Passed',
        description: 'og:title, og:description, and og:image are present.',
      };
    }

    if (presentCount > 0) {
      return {
        tag: 'Open Graph',
        status: 'Warning',
        description: `${presentCount} of 3 required Open Graph tags are present.`,
      };
    }

    return {
      tag: 'Open Graph',
      status: 'Failed',
      description: 'No required Open Graph tags were found.',
    };
  }

  private scoreImagesAlt(data: ParsedSeoData): SeoCheck {
    const { totalCount, withoutAltCount } = data.images;

    if (totalCount === 0) {
      return {
        tag: 'Images Alt',
        status: 'Passed',
        description: 'No images found, so the image alt check is not applicable.',
      };
    }

    if (withoutAltCount === 0) {
      return {
        tag: 'Images Alt',
        status: 'Passed',
        description: 'All images have alt attributes.',
      };
    }

    if (withoutAltCount > totalCount / 2) {
      return {
        tag: 'Images Alt',
        status: 'Failed',
        description: `${withoutAltCount} of ${totalCount} images are missing alt attributes.`,
      };
    }

    return {
      tag: 'Images Alt',
      status: 'Warning',
      description: `${withoutAltCount} of ${totalCount} images are missing alt attributes.`,
    };
  }

  private scoreHttps(data: ParsedSeoData): SeoCheck {
    if (data.isHttps) {
      return {
        tag: 'HTTPS',
        status: 'Passed',
        description: 'The analyzed URL uses HTTPS.',
      };
    }

    return {
      tag: 'HTTPS',
      status: 'Failed',
      description: 'The analyzed URL does not use HTTPS.',
    };
  }

  private scoreUrlLength(data: ParsedSeoData): SeoCheck {
    const { value, length } = data.url;

    if (!value) {
      return {
        tag: 'URL Length',
        status: 'Passed',
        description: 'No URL was provided, so the URL length check is not applicable.',
      };
    }

    if (length <= 75) {
      return {
        tag: 'URL Length',
        status: 'Passed',
        description: `URL length is ${length} characters, which is concise for users and search engines.`,
      };
    }

    if (length <= 115) {
      return {
        tag: 'URL Length',
        status: 'Warning',
        description: `URL length is ${length} characters. Shorter URLs are usually easier to read and share.`,
      };
    }

    return {
      tag: 'URL Length',
      status: 'Failed',
      description: `URL length is ${length} characters, which is too long for a clean SEO-friendly URL.`,
    };
  }

  private scoreHtmlLang(data: ParsedSeoData): SeoCheck {
    if (data.htmlLang.value) {
      return {
        tag: 'HTML Lang',
        status: 'Passed',
        description: `The html lang attribute is set to "${data.htmlLang.value}".`,
      };
    }

    return {
      tag: 'HTML Lang',
      status: 'Warning',
      description:
        'The html lang attribute is missing. Add it to help search engines and assistive technologies understand the page language.',
    };
  }

  private scoreTextContent(data: ParsedSeoData): SeoCheck {
    const { length, ratio } = data.textContent;
    const ratioPercent = Math.round(ratio * 100);

    if (length === 0) {
      return {
        tag: 'Text Content',
        status: 'Failed',
        description: 'No visible text content was found on the page.',
      };
    }

    if (length < 300 || ratio < 0.1) {
      return {
        tag: 'Text Content',
        status: 'Warning',
        description: `Visible text length is ${length} characters and text-to-code ratio is ${ratioPercent}%. Add more useful indexable content.`,
      };
    }

    return {
      tag: 'Text Content',
      status: 'Passed',
      description: `Visible text length is ${length} characters with a ${ratioPercent}% text-to-code ratio.`,
    };
  }
}
