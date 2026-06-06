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
        const provider = this.configService.get('AI_PROVIDER') ?? 'ollama';
        if (provider === 'deepseek-api') {
            return this.generateWithDeepSeekApi(checks);
        }
        const ollamaReview = await this.generateWithOllama(checks);
        if (ollamaReview) {
            return ollamaReview;
        }
        return this.generateWithDeepSeekApi(checks);
    }
    async generateWithOllama(checks) {
        const baseUrl = this.configService.get('OLLAMA_BASE_URL') ??
            'http://localhost:11434';
        const model = this.configService.get('OLLAMA_MODEL') ?? 'deepseek-r1:7b';
        try {
            const response = await fetch(`${baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model,
                    prompt: this.createPrompt(checks),
                    stream: false,
                }),
            });
            if (!response.ok) {
                return null;
            }
            const data = (await response.json());
            const review = data.response?.trim();
            const cleanedReview = review ? this.cleanReview(review) : null;
            if (!cleanedReview || this.isLowQualityReview(cleanedReview)) {
                return this.createDeterministicReview(checks);
            }
            return cleanedReview;
        }
        catch {
            return null;
        }
    }
    async generateWithDeepSeekApi(checks) {
        const apiKey = this.configService.get('DEEPSEEK_API_KEY');
        if (!apiKey) {
            return 'AI-обзор недоступен: Ollama не запущена, а DEEPSEEK_API_KEY не настроен.';
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
            return `AI-обзор недоступен: Ollama не запущена, а DeepSeek API вернул ошибку: ${message}`;
        }
    }
    createPrompt(checks) {
        const problemChecks = checks.filter((check) => check.status !== 'Passed');
        const input = problemChecks.length > 0 ? problemChecks : checks.slice(0, 5);
        return `
Ты SEO-аналитик. Напиши итоговый SEO-обзор строго по данным ниже.

Данные:
${JSON.stringify(input, null, 2)}

Правила ответа:
- Только русский язык.
- Ровно 3 коротких предложения.
- Без markdown, без заголовков, без списков, без JSON.
- Не придумывай факты, которых нет в данных.
- Упоминай только реальные проблемы из поля description.

Формат:
Страница имеет ... . Главные проблемы: ... . В первую очередь исправьте ... .
`;
    }
    cleanReview(value) {
        return value
            .replace(/<think>[\s\S]*?<\/think>/gi, '')
            .replace(/\*\*/g, '')
            .replace(/^[-#\s]+/gm, '')
            .trim();
    }
    isLowQualityReview(value) {
        const suspiciousPhrases = [
            'рефлексия текста',
            'краткое уведомление о репозитории',
            'репозиторий страницы',
            'link profile оттуда',
            'описание:',
        ];
        const lowerValue = value.toLowerCase();
        return suspiciousPhrases.some((phrase) => lowerValue.includes(phrase));
    }
    createDeterministicReview(checks) {
        const failedChecks = checks.filter((check) => check.status === 'Failed');
        const warningChecks = checks.filter((check) => check.status === 'Warning');
        const problemChecks = [...failedChecks, ...warningChecks].slice(0, 4);
        if (problemChecks.length === 0) {
            return 'Страница выглядит хорошо по основным SEO-проверкам. Критичных ошибок и предупреждений не найдено. Продолжайте следить за качеством контента, скоростью загрузки и актуальностью метаданных.';
        }
        const problemNames = problemChecks.map((check) => check.tag).join(', ');
        const recommendations = problemChecks
            .map((check) => check.description)
            .join(' ');
        return `Страница требует SEO-доработки: обнаружены проблемы в блоках ${problemNames}. Главные замечания: ${recommendations} В первую очередь исправьте ошибки со статусом "Ошибка", затем предупреждения, влияющие на индексацию и отображение страницы.`;
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map