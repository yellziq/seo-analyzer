import { ConfigService } from '@nestjs/config';
import { SeoCheck } from './scorer.service';
export declare class AiService {
    private readonly configService;
    constructor(configService: ConfigService);
    generateReview(checks: SeoCheck[]): Promise<string>;
    private generateWithOllama;
    private generateWithDeepSeekApi;
    private createPrompt;
    private cleanReview;
    private isLowQualityReview;
    private createDeterministicReview;
}
