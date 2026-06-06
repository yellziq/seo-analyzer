import {
  BadGatewayException,
  BadRequestException,
  GatewayTimeoutException,
  Injectable,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';

@Injectable()
export class ScraperService {
  async fetchHtml(url: string): Promise<string> {
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      throw new BadRequestException('Некорректный URL.');
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new BadRequestException('URL должен использовать HTTP или HTTPS.');
    }

    try {
      const response = await axios.get<string>(parsedUrl.toString(), {
        responseType: 'text',
        timeout: 30000,
        maxRedirects: 5,
        headers: {
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36 SEOAnalyzer/1.0',
        },
        validateStatus: () => true,
      });

      if (response.status < 200 || response.status >= 300) {
        throw new BadGatewayException(
          `Не удалось загрузить URL. Получен статус ${response.status}.`,
        );
      }

      return response.data;
    } catch (error) {
      if (
        error instanceof BadGatewayException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      const axiosError = error as AxiosError;

      if (
        axiosError.code === 'ECONNABORTED' ||
        axiosError.code === 'ETIMEDOUT' ||
        axiosError.code === 'ECONNRESET'
      ) {
        throw new GatewayTimeoutException(
          'Истекло время ожидания загрузки URL. Попробуйте другой адрес или вставьте HTML-код страницы вручную.',
        );
      }

      throw new BadGatewayException(
        'Не удалось загрузить URL. Сайт может блокировать серверные запросы.',
      );
    }
  }
}
