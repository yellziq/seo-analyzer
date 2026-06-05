"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ai_service_1 = require("./ai.service");
const parser_service_1 = require("./parser.service");
const scorer_service_1 = require("./scorer.service");
const scraper_service_1 = require("./scraper.service");
const seo_controller_1 = require("./seo.controller");
const seo_service_1 = require("./seo.service");
let SeoModule = class SeoModule {
};
exports.SeoModule = SeoModule;
exports.SeoModule = SeoModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [seo_controller_1.SeoController],
        providers: [
            seo_service_1.SeoService,
            scraper_service_1.ScraperService,
            parser_service_1.ParserService,
            scorer_service_1.ScorerService,
            ai_service_1.AiService,
        ],
    })
], SeoModule);
//# sourceMappingURL=seo.module.js.map