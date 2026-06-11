"use client";

import Link from "next/link";
import { observer } from "mobx-react-lite";
import { rootStore } from "@shared/model/root-store";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export const HistoryList = observer(function HistoryList(): React.JSX.Element {
  const reportsStore = rootStore.reportsStore;

  if (!reportsStore.isHydrated) {
    return <div className="border border-neutral-200 bg-white p-5">Загрузка истории...</div>;
  }

  if (reportsStore.reports.length === 0) {
    return (
      <section className="border border-neutral-200 bg-white p-5">
        <h1 className="text-2xl font-semibold">История анализов</h1>
        <p className="mt-3 text-neutral-600">Пока нет сохраненных отчетов. Запустите SEO-анализ, и результат появится здесь.</p>
      </section>
    );
  }

  return (
    <section className="border border-neutral-200 bg-white p-5">
      <h1 className="text-2xl font-semibold">История анализов</h1>
      <div className="mt-5 grid gap-3">
        {reportsStore.reports.map((report) => (
          <Link
            className="grid gap-2 border border-neutral-200 p-4 transition-colors hover:border-[#2563EB] md:grid-cols-[1fr_auto]"
            href={`/history/${report.id}`}
            key={report.id}
          >
            <span>
              <span className="block font-semibold text-neutral-950">{report.title}</span>
              <span className="mt-1 block text-sm text-neutral-500">{formatDate(report.createdAt)}</span>
            </span>
            <strong className="text-[#2563EB]">{report.score}/100</strong>
          </Link>
        ))}
      </div>
    </section>
  );
});
