"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const parser_service_1 = require("./parser.service");
const scorer_service_1 = require("./scorer.service");
const scraper_service_1 = require("./scraper.service");
let SeoService = class SeoService {
    scraperService;
    parserService;
    scorerService;
    aiService;
    constructor(scraperService, parserService, scorerService, aiService) {
        this.scraperService = scraperService;
        this.parserService = parserService;
        this.scorerService = scorerService;
        this.aiService = aiService;
    }
    async analyze(payload) {
        if (!payload.url && !payload.html) {
            throw new common_1.BadRequestException('Передайте URL или HTML.');
        }
        let html;
        if (payload.url) {
            try {
                html = await this.scraperService.fetchHtml(payload.url);
            }
            catch (error) {
                return this.createUrlFetchFailureResult(payload.url, error);
            }
        }
        else {
            html = payload.html;
        }
        if (!html) {
            throw new common_1.BadRequestException('HTML-контент пустой.');
        }
        const parsedData = this.parserService.parse(html, payload.url);
        if (payload.url) {
            await this.enrichWithUrlChecks(parsedData, payload.url);
        }
        const { score, checks } = this.scorerService.score(parsedData);
        const aiReview = await this.aiService.generateReview(checks);
        return {
            score,
            checks,
            aiReview,
        };
    }
    async createUrlFetchFailureResult(url, error) {
        const reason = this.extractErrorMessage(error);
        const checks = [
            {
                tag: 'URL Fetch',
                status: 'Failed',
                description: `Не удалось загрузить HTML по адресу ${url}. Причина: ${reason}. Вставьте HTML-код страницы вручную или попробуйте другой URL.`,
            },
        ];
        const aiReview = await this.aiService.generateReview(checks);
        return {
            score: 0,
            checks,
            aiReview,
        };
    }
    extractErrorMessage(error) {
        if (!(error instanceof common_1.HttpException)) {
            return 'Неизвестная ошибка загрузки.';
        }
        const response = error.getResponse();
        if (typeof response === 'string') {
            return response;
        }
        if (typeof response === 'object' &&
            response !== null &&
            'message' in response) {
            const message = response.message;
            if (Array.isArray(message)) {
                return message.join(', ');
            }
            if (typeof message === 'string') {
                return message;
            }
        }
        return error.message;
    }
    async enrichWithUrlChecks(parsedData, url) {
        const [robotsTxt, sitemapXml, brokenLinks, largeImagesCount] = await Promise.all([
            this.scraperService.checkTechnicalFile(url, 'robots.txt'),
            this.scraperService.checkTechnicalFile(url, 'sitemap.xml'),
            this.scraperService.checkLinks(parsedData.links.urls),
            this.scraperService.countLargeImages(parsedData.imageSize.urls),
        ]);
        parsedData.technicalFiles = {
            robotsTxt,
            sitemapXml,
        };
        parsedData.brokenLinks = brokenLinks;
        parsedData.imageSize.oversizedCount += largeImagesCount;
    }
};
exports.SeoService = SeoService;
exports.SeoService = SeoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [scraper_service_1.ScraperService,
        parser_service_1.ParserService,
        scorer_service_1.ScorerService,
        ai_service_1.AiService])
], SeoService);
//# sourceMappingURL=seo.service.js.map