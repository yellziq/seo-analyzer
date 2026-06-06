"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let ScraperService = class ScraperService {
    async fetchHtml(url) {
        let parsedUrl;
        try {
            parsedUrl = new URL(url);
        }
        catch {
            throw new common_1.BadRequestException('Некорректный URL.');
        }
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            throw new common_1.BadRequestException('URL должен использовать HTTP или HTTPS.');
        }
        try {
            const response = await axios_1.default.get(parsedUrl.toString(), {
                responseType: 'text',
                timeout: 10000,
                validateStatus: () => true,
            });
            if (response.status < 200 || response.status >= 300) {
                throw new common_1.BadGatewayException(`Не удалось загрузить URL. Получен статус ${response.status}.`);
            }
            return response.data;
        }
        catch (error) {
            if (error instanceof common_1.BadGatewayException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            const axiosError = error;
            if (axiosError.code === 'ECONNABORTED') {
                throw new common_1.GatewayTimeoutException('Истекло время ожидания загрузки URL.');
            }
            throw new common_1.BadGatewayException('Не удалось загрузить URL.');
        }
    }
};
exports.ScraperService = ScraperService;
exports.ScraperService = ScraperService = __decorate([
    (0, common_1.Injectable)()
], ScraperService);
//# sourceMappingURL=scraper.service.js.map