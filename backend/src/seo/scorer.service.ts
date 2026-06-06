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
        description: 'Тег title отсутствует.',
      };
    }

    if (length > 70) {
      return {
        tag: 'Title',
        status: 'Failed',
        description: `Длина title составляет ${length} символов. Это слишком много для поисковой выдачи.`,
      };
    }

    if (length >= 10 && length <= 60) {
      return {
        tag: 'Title',
        status: 'Passed',
        description: `Длина title составляет ${length} символов, это в рекомендуемом диапазоне.`,
      };
    }

    if (length >= 61 && length <= 70) {
      return {
        tag: 'Title',
        status: 'Warning',
        description: `Длина title составляет ${length} символов. Он может обрезаться в поисковой выдаче.`,
      };
    }

    return {
      tag: 'Title',
      status: 'Warning',
      description: `Длина title составляет ${length} символов, это меньше рекомендуемого минимума.`,
    };
  }

  private scoreMetaDescription(data: ParsedSeoData): SeoCheck {
    const length = data.metaDescription.length;

    if (!data.metaDescription.text) {
      return {
        tag: 'Meta Description',
        status: 'Failed',
        description: 'Meta description отсутствует.',
      };
    }

    if (length >= 50 && length <= 160) {
      return {
        tag: 'Meta Description',
        status: 'Passed',
        description: `Длина meta description составляет ${length} символов.`,
      };
    }

    if (length < 50) {
      return {
        tag: 'Meta Description',
        status: 'Warning',
        description: `Meta description слишком короткий: ${length} символов. Добавьте более полезное описание страницы.`,
      };
    }

    return {
      tag: 'Meta Description',
      status: 'Warning',
      description: `Meta description слишком длинный: ${length} символов, он может обрезаться.`,
    };
  }

  private scoreH1(data: ParsedSeoData): SeoCheck {
    if (data.h1.count === 1) {
      return {
        tag: 'H1',
        status: 'Passed',
        description: `На странице найден один H1: "${data.h1.firstValue}".`,
      };
    }

    if (data.h1.count > 1) {
      return {
        tag: 'H1',
        status: 'Warning',
        description: `Найдено ${data.h1.count} тегов H1. Лучше использовать один основной H1.`,
      };
    }

    return {
      tag: 'H1',
      status: 'Failed',
      description: 'Тег H1 не найден.',
    };
  }

  private scoreHeadings(data: ParsedSeoData): SeoCheck {
    if (data.headings.count >= 1) {
      return {
        tag: 'H2-H6',
        status: 'Passed',
        description: `Найдено дополнительных заголовков H2-H6: ${data.headings.count}.`,
      };
    }

    return {
      tag: 'H2-H6',
      status: 'Warning',
      description: 'Заголовки H2-H6 не найдены.',
    };
  }

  private scoreCanonical(data: ParsedSeoData): SeoCheck {
    if (data.canonical.href) {
      return {
        tag: 'Canonical',
        status: 'Passed',
        description: `Canonical URL установлен: ${data.canonical.href}.`,
      };
    }

    return {
      tag: 'Canonical',
      status: 'Failed',
      description: 'Тег canonical отсутствует.',
    };
  }

  private scoreRobotsMeta(data: ParsedSeoData): SeoCheck {
    const content = data.robotsMeta.content?.toLowerCase();

    if (!content) {
      return {
        tag: 'Robots Meta',
        status: 'Warning',
        description: 'Meta-тег robots отсутствует.',
      };
    }

    if (content.includes('noindex')) {
      return {
        tag: 'Robots Meta',
        status: 'Failed',
        description: 'Meta-тег robots содержит noindex.',
      };
    }

    if (content.includes('index')) {
      return {
        tag: 'Robots Meta',
        status: 'Passed',
        description: `Meta-тег robots разрешает индексацию: "${data.robotsMeta.content}".`,
      };
    }

    return {
      tag: 'Robots Meta',
      status: 'Warning',
      description: `Meta-тег robots есть, но намерение индексации неясно: "${data.robotsMeta.content}".`,
    };
  }

  private scoreOpenGraph(data: ParsedSeoData): SeoCheck {
    const values = Object.values(data.openGraph);
    const presentCount = values.filter(Boolean).length;

    if (presentCount === values.length) {
      return {
        tag: 'Open Graph',
        status: 'Passed',
        description: 'og:title, og:description и og:image присутствуют.',
      };
    }

    if (presentCount > 0) {
      return {
        tag: 'Open Graph',
        status: 'Warning',
        description: `Найдено ${presentCount} из 3 обязательных Open Graph тегов.`,
      };
    }

    return {
      tag: 'Open Graph',
      status: 'Failed',
      description: 'Обязательные Open Graph теги не найдены.',
    };
  }

  private scoreImagesAlt(data: ParsedSeoData): SeoCheck {
    const { totalCount, withoutAltCount } = data.images;

    if (totalCount === 0) {
      return {
        tag: 'Images Alt',
        status: 'Passed',
        description: 'Изображения не найдены, поэтому проверка alt не применяется.',
      };
    }

    if (withoutAltCount === 0) {
      return {
        tag: 'Images Alt',
        status: 'Passed',
        description: 'У всех изображений есть атрибут alt.',
      };
    }

    if (withoutAltCount > totalCount / 2) {
      return {
        tag: 'Images Alt',
        status: 'Failed',
        description: `${withoutAltCount} из ${totalCount} изображений не имеют атрибута alt.`,
      };
    }

    return {
      tag: 'Images Alt',
      status: 'Warning',
      description: `${withoutAltCount} из ${totalCount} изображений не имеют атрибута alt.`,
    };
  }

  private scoreHttps(data: ParsedSeoData): SeoCheck {
    if (data.isHttps) {
      return {
        tag: 'HTTPS',
        status: 'Passed',
        description: 'Анализируемый URL использует HTTPS.',
      };
    }

    return {
      tag: 'HTTPS',
      status: 'Failed',
      description: 'Анализируемый URL не использует HTTPS.',
    };
  }

  private scoreUrlLength(data: ParsedSeoData): SeoCheck {
    const { value, length } = data.url;

    if (!value) {
      return {
        tag: 'URL Length',
        status: 'Passed',
        description: 'URL не был передан, поэтому проверка длины URL не применяется.',
      };
    }

    if (length <= 75) {
      return {
        tag: 'URL Length',
        status: 'Passed',
        description: `Длина URL составляет ${length} символов. URL достаточно краткий для пользователей и поисковых систем.`,
      };
    }

    if (length <= 115) {
      return {
        tag: 'URL Length',
        status: 'Warning',
        description: `Длина URL составляет ${length} символов. Более короткие URL обычно легче читать и передавать.`,
      };
    }

    return {
      tag: 'URL Length',
      status: 'Failed',
      description: `Длина URL составляет ${length} символов. Это слишком длинно для чистого SEO-friendly URL.`,
    };
  }

  private scoreHtmlLang(data: ParsedSeoData): SeoCheck {
    if (data.htmlLang.value) {
      return {
        tag: 'HTML Lang',
        status: 'Passed',
        description: `Атрибут html lang установлен: "${data.htmlLang.value}".`,
      };
    }

    return {
      tag: 'HTML Lang',
      status: 'Warning',
      description:
        'Атрибут html lang отсутствует. Добавьте его, чтобы поисковые системы и вспомогательные технологии понимали язык страницы.',
    };
  }

  private scoreTextContent(data: ParsedSeoData): SeoCheck {
    const { length, ratio } = data.textContent;
    const ratioPercent = Math.round(ratio * 100);

    if (length === 0) {
      return {
        tag: 'Text Content',
        status: 'Failed',
        description: 'На странице не найден видимый текстовый контент.',
      };
    }

    if (length < 300 || ratio < 0.1) {
      return {
        tag: 'Text Content',
        status: 'Warning',
        description: `Длина видимого текста: ${length} символов, соотношение текста к коду: ${ratioPercent}%. Добавьте больше полезного индексируемого контента.`,
      };
    }

    return {
      tag: 'Text Content',
      status: 'Passed',
      description: `Длина видимого текста: ${length} символов, соотношение текста к коду: ${ratioPercent}%.`,
    };
  }
}
