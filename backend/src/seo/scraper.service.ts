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
      throw new BadRequestException('Invalid URL.');
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new BadRequestException('URL must use HTTP or HTTPS.');
    }

    try {
      const response = await axios.get<string>(parsedUrl.toString(), {
        responseType: 'text',
        timeout: 10000,
        validateStatus: () => true,
      });

      if (response.status < 200 || response.status >= 300) {
        throw new BadGatewayException(
          `Failed to fetch URL. Received status ${response.status}.`,
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
        throw new GatewayTimeoutException('URL fetch timed out.');
      }

      throw new BadGatewayException('Failed to fetch URL.');
    }
  }
}
