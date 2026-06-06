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
        const html = payload.url
            ? await this.scraperService.fetchHtml(payload.url)
            : payload.html;
        if (!html) {
            throw new common_1.BadRequestException('HTML-контент пустой.');
        }
        const parsedData = this.parserService.parse(html, payload.url);
        const { score, checks } = this.scorerService.score(parsedData);
        const aiReview = await this.aiService.generateReview(checks);
        return {
            score,
            checks,
            aiReview,
        };
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