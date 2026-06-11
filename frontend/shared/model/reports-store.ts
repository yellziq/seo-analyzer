import { makeAutoObservable } from "mobx";
import type { Report, SeoAnalyzeRequest, SeoAnalyzeResponse } from "@shared/api/types";

const storageKey = "seo-reports";

export class ReportsStore {
  reports: Report[] = [];
  isHydrated = false;

  constructor() {
    makeAutoObservable(this);
  }

  hydrate(): void {
    if (typeof window === "undefined" || this.isHydrated) {
      return;
    }

    const savedReports = window.localStorage.getItem(storageKey);
    this.reports = savedReports ? (JSON.parse(savedReports) as Report[]) : [];
    this.isHydrated = true;
  }

  addReport(payload: SeoAnalyzeRequest, result: SeoAnalyzeResponse): Report {
    const report: Report = {
      id: crypto.randomUUID(),
      title: this.createTitle(payload),
      score: result.score,
      createdAt: new Date().toISOString(),
      source: payload.url
        ? { type: "url", value: payload.url }
        : { type: "html", value: payload.html ?? "" },
      checks: result.checks,
      aiReview: result.aiReview,
    };

    this.reports = [report, ...this.reports];
    this.persist();

    return report;
  }

  getReportById(id: string): Report | null {
    return this.reports.find((report) => report.id === id) ?? null;
  }

  deleteReport(id: string): void {
    this.reports = this.reports.filter((report) => report.id !== id);
    this.persist();
  }

  private persist(): void {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(this.reports));
  }

  private createTitle(payload: SeoAnalyzeRequest): string {
    if (payload.url) {
      return payload.url;
    }

    const html = payload.html?.trim() ?? "";
    return html.length > 64 ? `${html.slice(0, 64)}...` : html || "HTML-документ";
  }
}
