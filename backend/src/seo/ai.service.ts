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
      return 'DeepSeek review is unavailable because DEEPSEEK_API_KEY is not configured.';
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
              'You are an SEO expert. Analyze the provided SEO check results and write a short 3-4 sentence review with the most important recommendations.',
          },
          {
            role: 'user',
            content: JSON.stringify(checks),
          },
        ],
      });

      return (
        response.choices[0]?.message?.content?.trim() ??
        'DeepSeek did not return a review.'
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown DeepSeek API error.';
      return `DeepSeek review request failed: ${message}`;
    }
  }
}
