"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserService = void 0;
const common_1 = require("@nestjs/common");
const cheerio = __importStar(require("cheerio"));
let ParserService = class ParserService {
    parse(html, url) {
        const $ = cheerio.load(html);
        const normalizedUrl = this.normalizeUrl(url);
        const titleText = this.cleanText($('title').first().text());
        const metaDescription = this.cleanText($('meta[name="description"]').attr('content'));
        const h1Elements = $('h1');
        const firstH1 = this.cleanText(h1Elements.first().text());
        const canonicalHref = this.cleanText($('link[rel="canonical"]').attr('href'));
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
                ogDescription: Boolean(this.cleanText($('meta[property="og:description"]').attr('content'))),
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
                href: this.cleanText($('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]')
                    .first()
                    .attr('href')),
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
    cleanText(value) {
        const text = value?.trim().replace(/\s+/g, ' ');
        return text ? text : null;
    }
    normalizeUrl(value) {
        if (!value) {
            return null;
        }
        try {
            return new URL(value).toString();
        }
        catch {
            return null;
        }
    }
    extractTextContent($) {
        const body = $('body').clone();
        body.find('script, style, noscript, svg').remove();
        return body.text().trim().replace(/\s+/g, ' ');
    }
    countWords(text) {
        if (!text) {
            return 0;
        }
        return text.split(/\s+/).filter(Boolean).length;
    }
    extractLinks($, baseUrl) {
        const urls = $('a[href]')
            .toArray()
            .map((link) => $(link).attr('href'))
            .filter((href) => Boolean(href))
            .filter((href) => !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:'))
            .map((href) => this.resolveUrl(href, baseUrl))
            .filter((href) => Boolean(href));
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
    resolveUrl(href, baseUrl) {
        try {
            return baseUrl ? new URL(href, baseUrl).toString() : href;
        }
        catch {
            return null;
        }
    }
    extractDuplicateHeadings($) {
        const headings = $('h1, h2, h3, h4, h5, h6')
            .toArray()
            .map((heading) => this.cleanText($(heading).text())?.toLowerCase())
            .filter((heading) => Boolean(heading));
        const counts = new Map();
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
    countOversizedImagesByAttributes($) {
        return $('img')
            .toArray()
            .filter((image) => {
            const width = Number($(image).attr('width') ?? 0);
            const height = Number($(image).attr('height') ?? 0);
            return width > 2000 || height > 2000;
        }).length;
    }
    extractImageUrls($, baseUrl) {
        return $('img[src]')
            .toArray()
            .map((image) => $(image).attr('src'))
            .filter((src) => Boolean(src))
            .map((src) => this.resolveUrl(src, baseUrl))
            .filter((src) => Boolean(src));
    }
};
exports.ParserService = ParserService;
exports.ParserService = ParserService = __decorate([
    (0, common_1.Injectable)()
], ParserService);
//# sourceMappingURL=parser.service.js.map