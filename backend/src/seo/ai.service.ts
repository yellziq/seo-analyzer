import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { SeoCheck } from './scorer.service';

type OllamaGenerateResponse = {
  response?: string;
};

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  async generateReview(checks: SeoCheck[]): Promise<string> {
    const provider = this.configService.get<string>('AI_PROVIDER') ?? 'ollama';

    if (provider === 'deepseek-api') {
      return this.generateWithDeepSeekApi(checks);
    }

    const ollamaReview = await this.generateWithOllama(checks);

    if (ollamaReview) {
      return ollamaReview;
    }

    return this.generateWithDeepSeekApi(checks);
  }

  private async generateWithOllama(checks: SeoCheck[]): Promise<string | null> {
    const baseUrl =
      this.configService.get<string>('OLLAMA_BASE_URL') ??
      'http://localhost:11434';
    const model =
      this.configService.get<string>('OLLAMA_MODEL') ?? 'deepseek-r1:7b';

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

      const data = (await response.json()) as OllamaGenerateResponse;
      const review = data.response?.trim();
      const cleanedReview = review ? this.cleanReview(review) : null;

      if (!cleanedReview || this.isLowQualityReview(cleanedReview)) {
        return this.createDeterministicReview(checks);
      }

      return cleanedReview;
    } catch {
      return null;
    }
  }

  private async generateWithDeepSeekApi(checks: SeoCheck[]): Promise<string> {
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');

    if (!apiKey) {
      return 'AI-обзор недоступен: Ollama не запущена, а DEEPSEEK_API_KEY не настроен.';
    }

    const client = new OpenAI({
      apiKey,
      baseURL: 'https://api.deepseek.com',
    });

    try {
      const response = await client.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content:
              'Ты SEO-эксперт. Проанализируй переданные результаты SEO-проверок и напиши короткий обзор на русском языке из 3-4 предложений с самыми важными рекомендациями.',
          },
          {
            role: 'user',
            content: JSON.stringify(checks),
          },
        ],
      });

      return (
        response.choices[0]?.message?.content?.trim() ??
        'DeepSeek не вернул обзор.'
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Неизвестная ошибка DeepSeek API.';
      return `AI-обзор недоступен: Ollama не запущена, а DeepSeek API вернул ошибку: ${message}`;
    }
  }

  private createPrompt(checks: SeoCheck[]): string {
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

  private cleanReview(value: string): string {
    return value
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/\*\*/g, '')
      .replace(/^[-#\s]+/gm, '')
      .trim();
  }

  private isLowQualityReview(value: string): boolean {
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

  private createDeterministicReview(checks: SeoCheck[]): string {
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
}
