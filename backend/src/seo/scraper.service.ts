import {
  BadGatewayException,
  BadRequestException,
  GatewayTimeoutException,
  Injectable,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';

export type LinkCheckResult = {
  checkedCount: number;
  brokenCount: number;
};

const requestHeaders = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36 SEOAnalyzer/1.0',
};

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
        headers: requestHeaders,
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

  async checkTechnicalFile(url: string, fileName: string): Promise<boolean> {
    const parsedUrl = new URL(url);
    const resourceUrl = `${parsedUrl.origin}/${fileName}`;

    return this.checkResource(resourceUrl);
  }

  async checkLinks(urls: string[], limit = 20): Promise<LinkCheckResult> {
    const uniqueUrls = Array.from(new Set(urls)).slice(0, limit);
    const results = await Promise.all(
      uniqueUrls.map(async (url) => {
        const isAvailable = await this.checkResource(url);
        return isAvailable ? 0 : 1;
      }),
    );

    return {
      checkedCount: uniqueUrls.length,
      brokenCount: results.reduce((total, value) => total + value, 0),
    };
  }

  async countLargeImages(urls: string[], limit = 15): Promise<number> {
    const uniqueUrls = Array.from(new Set(urls)).slice(0, limit);
    const sizes = await Promise.all(
      uniqueUrls.map((url) => this.getContentLength(url)),
    );

    return sizes.filter((size) => size !== null && size > 500 * 1024).length;
  }

  private async checkResource(url: string): Promise<boolean> {
    try {
      const response = await axios.head(url, {
        timeout: 7000,
        maxRedirects: 5,
        headers: requestHeaders,
        validateStatus: () => true,
      });

      return response.status >= 200 && response.status < 400;
    } catch {
      return false;
    }
  }

  private async getContentLength(url: string): Promise<number | null> {
    try {
      const response = await axios.head(url, {
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
    } catch {
      return null;
    }
  }
}
