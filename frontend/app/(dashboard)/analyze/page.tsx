import type { Metadata } from "next";
import { AnalyzerPanel } from "@features/seo-analyzer/ui/analyzer-panel";

export const metadata: Metadata = {
  title: "Анализ",
  description: "Отправьте URL или HTML-код для SEO-анализа.",
};

export default function AnalyzePage(): React.JSX.Element {
  return (
    <section className="grid gap-5">
      <div className="border border-neutral-200 bg-white p-5">
        <h1 className="text-2xl font-semibold">SEO-анализ</h1>
        <p className="mt-2 text-neutral-600">CSR-форма подключена к типизированному endpoint на NestJS.</p>
      </div>
      <AnalyzerPanel />
    </section>
  );
}
