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
            return 'DeepSeek review is unavailable because DEEPSEEK_API_KEY is not configured.';
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
                        content: 'You are an SEO expert. Analyze the provided SEO check results and write a short 3-4 sentence review with the most important recommendations.',
                    },
                    {
                        role: 'user',
                        content: JSON.stringify(checks),
                    },
                ],
            });
            return (response.choices[0]?.message?.content?.trim() ??
                'DeepSeek did not return a review.');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown DeepSeek API error.';
            return `DeepSeek review request failed: ${message}`;
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map