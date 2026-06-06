"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScorerService = void 0;
const common_1 = require("@nestjs/common");
let ScorerService = class ScorerService {
    score(data) {
        const checks = [
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
    scoreTitle(data) {
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
    scoreMetaDescription(data) {
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
    scoreH1(data) {
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
    scoreHeadings(data) {
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
    scoreCanonical(data) {
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
    scoreRobotsMeta(data) {
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
    scoreOpenGraph(data) {
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
    scoreImagesAlt(data) {
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
    scoreHttps(data) {
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
    scoreUrlLength(data) {
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
    scoreHtmlLang(data) {
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
            description: 'Атрибут html lang отсутствует. Добавьте его, чтобы поисковые системы и вспомогательные технологии понимали язык страницы.',
        };
    }
    scoreTextContent(data) {
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
    scoreViewport(data) {
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
    scoreFavicon(data) {
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
    scoreRobotsTxt(data) {
        if (data.technicalFiles.robotsTxt === null) {
            return {
                tag: 'Robots.txt',
                status: 'Passed',
                description: 'URL не был передан, поэтому robots.txt не проверялся.',
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
    scoreSitemapXml(data) {
        if (data.technicalFiles.sitemapXml === null) {
            return {
                tag: 'Sitemap.xml',
                status: 'Passed',
                description: 'URL не был передан, поэтому sitemap.xml не проверялся.',
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
    scoreSchemaOrg(data) {
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
    scoreBrokenLinks(data) {
        const { checkedCount, brokenCount } = data.brokenLinks;
        if (checkedCount === 0) {
            return {
                tag: 'Broken Links',
                status: 'Passed',
                description: 'Ссылки не проверялись: URL не был передан или ссылок на странице нет.',
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
    scoreLinkBalance(data) {
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
    scoreHtmlSize(data) {
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
    scoreWordCount(data) {
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
    scoreHreflang(data) {
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
    scoreDuplicateHeadings(data) {
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
    scoreLargeImages(data) {
        if (data.images.totalCount === 0) {
            return {
                tag: 'Large Images',
                status: 'Passed',
                description: 'Изображения не найдены, поэтому размер изображений не проверяется.',
            };
        }
        if (data.imageSize.oversizedCount === 0) {
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
};
exports.ScorerService = ScorerService;
exports.ScorerService = ScorerService = __decorate([
    (0, common_1.Injectable)()
], ScorerService);
//# sourceMappingURL=scorer.service.js.map