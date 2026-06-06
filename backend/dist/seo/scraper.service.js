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
const requestHeaders = {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36 SEOAnalyzer/1.0',
};
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
                timeout: 30000,
                maxRedirects: 5,
                headers: requestHeaders,
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
            if (axiosError.code === 'ECONNABORTED' ||
                axiosError.code === 'ETIMEDOUT' ||
                axiosError.code === 'ECONNRESET') {
                throw new common_1.GatewayTimeoutException('Истекло время ожидания загрузки URL. Попробуйте другой адрес или вставьте HTML-код страницы вручную.');
            }
            throw new common_1.BadGatewayException('Не удалось загрузить URL. Сайт может блокировать серверные запросы.');
        }
    }
    async checkTechnicalFile(url, fileName) {
        const parsedUrl = new URL(url);
        const resourceUrl = `${parsedUrl.origin}/${fileName}`;
        return this.checkResource(resourceUrl);
    }
    async checkLinks(urls, limit = 20) {
        const uniqueUrls = Array.from(new Set(urls)).slice(0, limit);
        const results = await Promise.all(uniqueUrls.map(async (url) => {
            const isAvailable = await this.checkResource(url);
            return isAvailable ? 0 : 1;
        }));
        return {
            checkedCount: uniqueUrls.length,
            brokenCount: results.reduce((total, value) => total + value, 0),
        };
    }
    async countLargeImages(urls, limit = 15) {
        const uniqueUrls = Array.from(new Set(urls)).slice(0, limit);
        const sizes = await Promise.all(uniqueUrls.map((url) => this.getContentLength(url)));
        return sizes.filter((size) => size !== null && size > 500 * 1024).length;
    }
    async checkResource(url) {
        try {
            const response = await axios_1.default.head(url, {
                timeout: 7000,
                maxRedirects: 5,
                headers: requestHeaders,
                validateStatus: () => true,
            });
            return response.status >= 200 && response.status < 400;
        }
        catch {
            return false;
        }
    }
    async getContentLength(url) {
        try {
            const response = await axios_1.default.head(url, {
                timeout: 7000,
                maxRedirects: 5,
                headers: requestHeaders,
                validateStatus: () => true,
            });
            const contentLength = response.headers['content-length'];
            if (typeof contentLength !== 'string') {
                return null;
            }
            return Number(contentLength);
        }
        catch {
            return null;
        }
    }
};
exports.ScraperService = ScraperService;
exports.ScraperService = ScraperService = __decorate([
    (0, common_1.Injectable)()
], ScraperService);
//# sourceMappingURL=scraper.service.js.map