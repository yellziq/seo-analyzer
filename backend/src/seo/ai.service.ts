import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { SeoCheck } from './scorer.service';

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  async generateReview(checks: SeoCheck[]): Promise<string> {
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');

    if (!apiKey) {
      return 'AI-обзор DeepSeek недоступен, потому что DEEPSEEK_API_KEY не настроен.';
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
      return `Запрос AI-обзора DeepSeek завершился ошибкой: ${message}`;
    }
  }
}
