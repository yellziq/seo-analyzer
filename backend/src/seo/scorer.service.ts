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
      this.scoreViewport(data),
      this.scoreFavicon(data),
      this.scoreRobotsTxt(data),
      this.scoreSitemapXml(data),
      this.scoreSchemaOrg(data),
      this.scoreBrokenLinks(data),
      this.scoreLinkBalance(data),
      this.scoreHtmlSize(data),
      this.scoreWordCount(data),
      this.scoreHreflang(data),
      this.scoreDuplicateHeadings(data),
      this.scoreLargeImages(data),
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
    if (!data.url.value) {
      return {
        tag: 'HTTPS',
        status: 'Warning',
        description: 'HTTPS не проверялся, потому что анализ выполнен по HTML без URL.',
      };
    }

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
        status: 'Warning',
        description: 'Длина URL не проверялась, потому что анализ выполнен по HTML без URL.',
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

  private scoreViewport(data: ParsedSeoData): SeoCheck {
    const content = data.viewport.content?.toLowerCase();

    if (!content) {
      return {
        tag: 'Viewport',
        status: 'Failed',
        description: 'Meta viewport отсутствует. Добавьте его для корректной мобильной индексации.',
      };
    }

    if (content.includes('width=device-width')) {
      return {
        tag: 'Viewport',
        status: 'Passed',
        description: `Meta viewport настроен: "${data.viewport.content}".`,
      };
    }

    return {
      tag: 'Viewport',
      status: 'Warning',
      description: `Meta viewport есть, но лучше добавить width=device-width: "${data.viewport.content}".`,
    };
  }

  private scoreFavicon(data: ParsedSeoData): SeoCheck {
    if (data.favicon.href) {
      return {
        tag: 'Favicon',
        status: 'Passed',
        description: `Favicon найден: ${data.favicon.href}.`,
      };
    }

    return {
      tag: 'Favicon',
      status: 'Warning',
      description: 'Favicon не найден. Добавьте иконку сайта для лучшего отображения во вкладках и выдаче.',
    };
  }

  private scoreRobotsTxt(data: ParsedSeoData): SeoCheck {
    if (data.technicalFiles.robotsTxt === null) {
      return {
        tag: 'Robots.txt',
        status: 'Warning',
        description: 'Robots.txt не проверялся, потому что анализ выполнен по HTML без URL.',
      };
    }

    if (data.technicalFiles.robotsTxt) {
      return {
        tag: 'Robots.txt',
        status: 'Passed',
        description: 'Файл robots.txt доступен.',
      };
    }

    return {
      tag: 'Robots.txt',
      status: 'Warning',
      description: 'Файл robots.txt не найден или недоступен.',
    };
  }

  private scoreSitemapXml(data: ParsedSeoData): SeoCheck {
    if (data.technicalFiles.sitemapXml === null) {
      return {
        tag: 'Sitemap.xml',
        status: 'Warning',
        description: 'Sitemap.xml не проверялся, потому что анализ выполнен по HTML без URL.',
      };
    }

    if (data.technicalFiles.sitemapXml) {
      return {
        tag: 'Sitemap.xml',
        status: 'Passed',
        description: 'Файл sitemap.xml доступен.',
      };
    }

    return {
      tag: 'Sitemap.xml',
      status: 'Warning',
      description: 'Файл sitemap.xml не найден или недоступен. Добавьте карту сайта для ускорения индексации.',
    };
  }

  private scoreSchemaOrg(data: ParsedSeoData): SeoCheck {
    if (data.schemaOrg.count > 0) {
      return {
        tag: 'Schema.org',
        status: 'Passed',
        description: `Найдено JSON-LD Schema.org блоков: ${data.schemaOrg.count}.`,
      };
    }

    return {
      tag: 'Schema.org',
      status: 'Warning',
      description: 'Schema.org JSON-LD разметка не найдена. Добавьте структурированные данные для расширенных сниппетов.',
    };
  }

  private scoreBrokenLinks(data: ParsedSeoData): SeoCheck {
    const { checkedCount, brokenCount } = data.brokenLinks;

    if (checkedCount === 0) {
      return {
        tag: 'Broken Links',
        status: data.links.totalCount === 0 ? 'Passed' : 'Warning',
        description:
          data.links.totalCount === 0
            ? 'На странице нет ссылок, поэтому битые ссылки не проверялись.'
            : 'Битые ссылки не проверялись, потому что анализ выполнен по HTML без URL.',
      };
    }

    if (brokenCount === 0) {
      return {
        tag: 'Broken Links',
        status: 'Passed',
        description: `Проверено ссылок: ${checkedCount}. Битые ссылки не найдены.`,
      };
    }

    if (brokenCount <= 2) {
      return {
        tag: 'Broken Links',
        status: 'Warning',
        description: `Проверено ссылок: ${checkedCount}. Найдено битых ссылок: ${brokenCount}. Исправьте или удалите их.`,
      };
    }

    return {
      tag: 'Broken Links',
      status: 'Failed',
      description: `Проверено ссылок: ${checkedCount}. Найдено много битых ссылок: ${brokenCount}. Это ухудшает UX и SEO.`,
    };
  }

  private scoreLinkBalance(data: ParsedSeoData): SeoCheck {
    const { totalCount, internalCount, externalCount } = data.links;

    if (totalCount === 0) {
      return {
        tag: 'Links',
        status: 'Warning',
        description: 'На странице не найдено ссылок. Добавьте внутренние ссылки для улучшения навигации и перелинковки.',
      };
    }

    if (internalCount === 0) {
      return {
        tag: 'Links',
        status: 'Warning',
        description: `Найдено ссылок: ${totalCount}, но внутренних ссылок нет. Добавьте внутреннюю перелинковку.`,
      };
    }

    return {
      tag: 'Links',
      status: 'Passed',
      description: `Найдено ссылок: ${totalCount}. Внутренних: ${internalCount}, внешних: ${externalCount}.`,
    };
  }

  private scoreHtmlSize(data: ParsedSeoData): SeoCheck {
    const sizeKb = Math.round(data.textContent.htmlLength / 1024);

    if (sizeKb <= 150) {
      return {
        tag: 'HTML Size',
        status: 'Passed',
        description: `Размер HTML: ${sizeKb} KB. Страница достаточно легкая.`,
      };
    }

    if (sizeKb <= 300) {
      return {
        tag: 'HTML Size',
        status: 'Warning',
        description: `Размер HTML: ${sizeKb} KB. Проверьте лишнюю разметку и inline-код.`,
      };
    }

    return {
      tag: 'HTML Size',
      status: 'Failed',
      description: `Размер HTML: ${sizeKb} KB. Страница слишком тяжелая, стоит уменьшить объем кода.`,
    };
  }

  private scoreWordCount(data: ParsedSeoData): SeoCheck {
    const { wordCount } = data.textContent;

    if (wordCount >= 300) {
      return {
        tag: 'Word Count',
        status: 'Passed',
        description: `Количество слов: ${wordCount}. Контента достаточно для базовой SEO-оценки.`,
      };
    }

    if (wordCount >= 100) {
      return {
        tag: 'Word Count',
        status: 'Warning',
        description: `Количество слов: ${wordCount}. Для информационных страниц лучше добавить больше полезного текста.`,
      };
    }

    return {
      tag: 'Word Count',
      status: 'Failed',
      description: `Количество слов: ${wordCount}. На странице слишком мало текстового контента.`,
    };
  }

  private scoreHreflang(data: ParsedSeoData): SeoCheck {
    if (data.hreflang.count > 0) {
      return {
        tag: 'Hreflang',
        status: 'Passed',
        description: `Найдено hreflang-ссылок: ${data.hreflang.count}.`,
      };
    }

    return {
      tag: 'Hreflang',
      status: 'Warning',
      description: 'Hreflang не найден. Если сайт многоязычный, добавьте hreflang для правильной региональной выдачи.',
    };
  }

  private scoreDuplicateHeadings(data: ParsedSeoData): SeoCheck {
    if (data.duplicateHeadings.count === 0) {
      return {
        tag: 'Duplicate Headings',
        status: 'Passed',
        description: 'Дубликаты заголовков H1-H6 не найдены.',
      };
    }

    return {
      tag: 'Duplicate Headings',
      status: 'Warning',
      description: `Найдено повторяющихся заголовков: ${data.duplicateHeadings.count}. Проверьте: ${data.duplicateHeadings.values.join(', ')}.`,
    };
  }

  private scoreLargeImages(data: ParsedSeoData): SeoCheck {
    if (data.images.totalCount === 0) {
      return {
        tag: 'Large Images',
        status: 'Passed',
        description: 'Изображения не найдены, поэтому размер изображений не проверяется.',
      };
    }

    if (data.imageSize.oversizedCount === 0) {
      if (!data.url.value && data.imageSize.urls.length > 0) {
        return {
          tag: 'Large Images',
          status: 'Warning',
          description:
            'Размер файлов изображений не проверялся, потому что анализ выполнен по HTML без URL. Проверены только width/height атрибуты.',
        };
      }

      return {
        tag: 'Large Images',
        status: 'Passed',
        description: 'Слишком крупные изображения не найдены.',
      };
    }

    return {
      tag: 'Large Images',
      status: 'Warning',
      description: `Найдено крупных изображений: ${data.imageSize.oversizedCount}. Сожмите изображения или используйте современные форматы WebP/AVIF.`,
    };
  }
}
