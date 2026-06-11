import type { Metadata } from "next";
import { HistoryList } from "@features/reports/ui/history-list";

export const metadata: Metadata = {
  title: "Отчеты",
  description: "Сводная страница SEO-отчетов.",
};

export default function ReportsPage(): React.JSX.Element {
  return (
    <section className="grid gap-5">
      <div className="border border-neutral-200 bg-white p-5">
        <h1 className="text-2xl font-semibold">Отчеты</h1>
        <p className="mt-2 text-neutral-600">Здесь отображаются сохраненные отчеты по выполненным SEO-анализам.</p>
      </div>
      <HistoryList />
    </section>
  );
}
