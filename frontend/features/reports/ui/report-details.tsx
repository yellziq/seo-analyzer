"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { printTextReport } from "@features/reports/ui/export-report";
import { statusLabels, tagLabels } from "@features/reports/ui/report-status";
import { routes } from "@shared/config/routes";
import { rootStore } from "@shared/model/root-store";
import { Button } from "@shared/ui/button";

type ReportDetailsProps = {
  reportId: string;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export const ReportDetails = observer(function ReportDetails({
  reportId,
}: ReportDetailsProps): React.JSX.Element {
  const router = useRouter();
  const reportsStore = rootStore.reportsStore;
  const report = reportsStore.getReportById(reportId);

  if (!reportsStore.isHydrated) {
    return <div className="border border-neutral-200 bg-white p-5">Загрузка отчета...</div>;
  }

  if (!report) {
    return (
      <section className="border border-neutral-200 bg-white p-5">
        <h1 className="text-2xl font-semibold">Отчет не найден</h1>
        <p className="mt-2 text-neutral-600">Возможно, отчет был удален или история очищена.</p>
        <Link className="mt-5 inline-block border border-[#2563EB] bg-[#2563EB] px-4 py-2 font-semibold text-white" href={routes.history}>
          Вернуться к истории
        </Link>
      </section>
    );
  }

  const problemChecks = report.checks.filter((check) => check.status !== "Passed");

  return (
    <section className="grid gap-5">
      <div className="border border-neutral-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <Link className="text-sm font-semibold text-[#2563EB]" href={routes.history}>
              Назад к истории
            </Link>
            <h1 className="mt-3 text-2xl font-semibold">Отчет SEO-анализа</h1>
            <p className="mt-2 break-all text-neutral-600">{report.title}</p>
            <p className="mt-1 text-sm text-neutral-500">{formatDate(report.createdAt)}</p>
          </div>
          <div className="border-2 border-[#2563EB] px-4 py-2 text-xl font-bold text-[#2563EB]">
            {report.score}/100
          </div>
        </div>
      </div>

      <section className="border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Источник</h2>
        <p className="mt-2 text-sm text-neutral-500">{report.source.type === "url" ? "URL" : "HTML"}</p>
        <pre className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap border border-neutral-200 p-3 text-sm text-neutral-700">
          {report.source.value}
        </pre>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {report.checks.map((check) => (
          <article className="border border-neutral-200 bg-white p-4" key={check.tag}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="font-semibold">{tagLabels[check.tag] ?? check.tag}</h3>
              <span className="border border-neutral-300 px-2 py-1 text-xs">{statusLabels[check.status]}</span>
            </div>
            <p className="text-sm leading-6 text-neutral-600">{check.description}</p>
          </article>
        ))}
      </div>

      <section className="border border-neutral-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-semibold">AI-обзор</h2>
        <p className="text-sm leading-6 text-neutral-700">{report.aiReview}</p>
      </section>

      <section className="border border-neutral-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-semibold">Ошибки и предлагаемые изменения</h2>
        {problemChecks.length > 0 ? (
          <div className="grid gap-3">
            {problemChecks.map((check) => (
              <article className="border border-neutral-200 p-3" key={`${check.tag}-${check.description}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{tagLabels[check.tag] ?? check.tag}</h3>
                  <span className="border border-neutral-300 px-2 py-1 text-xs">{statusLabels[check.status]}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{check.description}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-600">Критичных ошибок и предупреждений не найдено.</p>
        )}
      </section>

      <div className="flex flex-wrap gap-3 print:hidden">
        <Button onClick={() => printTextReport(report)}>
          Сохранить отчет в PDF
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            reportsStore.deleteReport(report.id);
            router.push(routes.history);
          }}
        >
          Удалить отчет
        </Button>
      </div>
    </section>
  );
});
