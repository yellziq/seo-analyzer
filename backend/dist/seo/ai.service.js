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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
let AiService = class AiService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async generateReview(checks) {
        const apiKey = this.configService.get('DEEPSEEK_API_KEY');
        if (!apiKey) {
            return 'AI-обзор DeepSeek недоступен, потому что DEEPSEEK_API_KEY не настроен.';
        }
        const client = new openai_1.default({
            apiKey,
            baseURL: 'https://api.deepseek.com',
        });
        try {
            const response = await client.chat.completions.create({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: 'Ты SEO-эксперт. Проанализируй переданные результаты SEO-проверок и напиши короткий обзор на русском языке из 3-4 предложений с самыми важными рекомендациями.',
                    },
                    {
                        role: 'user',
                        content: JSON.stringify(checks),
                    },
                ],
            });
            return (response.choices[0]?.message?.content?.trim() ??
                'DeepSeek не вернул обзор.');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Неизвестная ошибка DeepSeek API.';
            return `Запрос AI-обзора DeepSeek завершился ошибкой: ${message}`;
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map