import { makeAutoObservable, runInAction } from "mobx";
import { api } from "@shared/api/http-client";
import type { SeoAnalyzeRequest, SeoAnalyzeResponse } from "@shared/api/types";
import type { ReportsStore } from "@shared/model/reports-store";

export class SeoStore {
  result: SeoAnalyzeResponse | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private readonly reportsStore: ReportsStore) {
    makeAutoObservable(this);
  }

  async analyze(payload: SeoAnalyzeRequest): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;
    this.result = null;

    try {
      const result = await api.analyzeSeo(payload);
      runInAction(() => {
        this.result = result;
        this.reportsStore.addReport(payload, result);
      });
    } catch (error: unknown) {
      runInAction(() => {
        const message = error instanceof Error ? error.message : "SEO-анализ не выполнен.";
        this.errorMessage = `${message} Отчет сохраняется только после успешного анализа.`;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}
