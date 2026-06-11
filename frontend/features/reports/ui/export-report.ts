import { statusLabels, tagLabels } from "@features/reports/ui/report-status";
import type { Report } from "@shared/api/types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function createProblemSection(report: Report): string {
  const problemChecks = report.checks.filter((check) => check.status !== "Passed");

  if (problemChecks.length === 0) {
    return "<p>Критичных ошибок и предупреждений не найдено.</p>";
  }

  return problemChecks
    .map(
      (check, index) => `
        <section class="item">
          <h3>${index + 1}. ${escapeHtml(tagLabels[check.tag] ?? check.tag)}</h3>
          <p><strong>Статус:</strong> ${escapeHtml(statusLabels[check.status])}</p>
          <p><strong>Что исправить:</strong> ${escapeHtml(check.description)}</p>
        </section>
      `,
    )
    .join("");
}

function createChecksSection(report: Report): string {
  return report.checks
    .map(
      (check, index) => `
        <section class="item">
          <h3>${index + 1}. ${escapeHtml(tagLabels[check.tag] ?? check.tag)}</h3>
          <p><strong>Статус:</strong> ${escapeHtml(statusLabels[check.status])}</p>
          <p>${escapeHtml(check.description)}</p>
        </section>
      `,
    )
    .join("");
}

export function printTextReport(report: Report): void {
  const printWindow = window.open("", "_blank", "noopener,noreferrer");

  if (!printWindow) {
    window.print();
    return;
  }

  const html = `
    <!doctype html>
    <html lang="ru">
      <head>
        <meta charset="utf-8" />
        <title>SEO-отчет: ${escapeHtml(report.title)}</title>
        <style>
          @page {
            margin: 18mm;
          }

          body {
            color: #111111;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
            line-height: 1.55;
          }

          h1 {
            font-size: 24px;
            margin: 0 0 10px;
          }

          h2 {
            border-bottom: 1px solid #cccccc;
            font-size: 17px;
            margin: 28px 0 12px;
            padding-bottom: 6px;
          }

          h3 {
            font-size: 14px;
            margin: 0 0 6px;
          }

          p {
            margin: 4px 0;
          }

          .meta {
            margin-bottom: 18px;
          }

          .score {
            border: 2px solid #111111;
            display: inline-block;
            font-size: 20px;
            font-weight: 700;
            margin: 10px 0 0;
            padding: 6px 10px;
          }

          .source {
            border: 1px solid #cccccc;
            margin-top: 8px;
            padding: 10px;
            white-space: pre-wrap;
            word-break: break-word;
          }

          .item {
            break-inside: avoid;
            border-bottom: 1px solid #dddddd;
            padding: 10px 0;
          }

          .item:last-child {
            border-bottom: 0;
          }
        </style>
      </head>
      <body>
        <h1>SEO-отчет</h1>
        <section class="meta">
          <p><strong>Страница:</strong> ${escapeHtml(report.title)}</p>
          <p><strong>Дата:</strong> ${escapeHtml(formatDate(report.createdAt))}</p>
          <p><strong>Источник:</strong> ${report.source.type === "url" ? "URL" : "HTML"}</p>
          <div class="score">${report.score}/100</div>
        </section>

        <h2>Источник анализа</h2>
        <div class="source">${escapeHtml(report.source.value)}</div>

        <h2>Ошибки и предлагаемые изменения</h2>
        ${createProblemSection(report)}

        <h2>AI-обзор</h2>
        <p>${escapeHtml(report.aiReview)}</p>

        <h2>Все SEO-проверки</h2>
        ${createChecksSection(report)}
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
