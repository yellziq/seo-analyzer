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
        timeout: 10000,
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

      if (axiosError.code === 'ECONNABORTED') {
        throw new GatewayTimeoutException('Истекло время ожидания загрузки URL.');
      }

      throw new BadGatewayException('Не удалось загрузить URL.');
    }
  }
}
