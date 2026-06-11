"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import { routes } from "@shared/config/routes";
import { rootStore } from "@shared/model/root-store";
import { Button } from "@shared/ui/button";

type InputMode = "url" | "html";

const statusLabels = {
  Passed: "Пройдено",
  Warning: "Предупреждение",
  Failed: "Ошибка",
} as const;

const tagLabels: Record<string, string> = {
  Title: "Title",
  "Meta Description": "Meta Description",
  H1: "H1",
  "H2-H6": "H2-H6",
  Canonical: "Canonical",
  "Robots Meta": "Robots Meta",
  "Open Graph": "Open Graph",
  "Images Alt": "Alt у изображений",
  HTTPS: "HTTPS",
  "URL Length": "Длина URL",
  "HTML Lang": "HTML lang",
  "Text Content": "Текстовый контент",
  Viewport: "Viewport",
  Favicon: "Favicon",
  "Robots.txt": "Robots.txt",
  "Sitemap.xml": "Sitemap.xml",
  "Schema.org": "Schema.org",
  "Broken Links": "Битые ссылки",
  Links: "Ссылки",
  "HTML Size": "Размер HTML",
  "Word Count": "Количество слов",
  Hreflang: "Hreflang",
  "Duplicate Headings": "Дубликаты заголовков",
  "Large Images": "Крупные изображения",
  "URL Fetch": "Загрузка URL",
};

export const AnalyzerPanel = observer(function AnalyzerPanel(): React.JSX.Element {
  const [mode, setMode] = useState<InputMode>("url");
  const [url, setUrl] = useState<string>("https://example.com");
  const [html, setHtml] = useState<string>("<html lang=\"ru\"><head><title>SEO пример</title></head><body><h1>Привет</h1></body></html>");
  const seoStore = rootStore.seoStore;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void seoStore.analyze(mode === "url" ? { url } : { html });
  };

  return (
    <section className="grid gap-6">
      <form className="border border-neutral-200 bg-white p-5" onSubmit={handleSubmit}>
        <div className="mb-5 flex border border-neutral-300">
          <button className={`flex-1 px-4 py-2 ${mode === "url" ? "bg-[#2563EB] text-white" : "bg-white"}`} type="button" onClick={() => setMode("url")}>
            URL
          </button>
          <button className={`flex-1 border-l border-neutral-300 px-4 py-2 ${mode === "html" ? "bg-[#2563EB] text-white" : "bg-white"}`} type="button" onClick={() => setMode("html")}>
            HTML
          </button>
        </div>
        {mode === "url" ? (
          <label className="grid gap-2 text-sm font-medium">
            URL страницы
            <input className="border border-neutral-300 px-3 py-2" value={url} onChange={(event) => setUrl(event.target.value)} type="url" required />
          </label>
        ) : (
          <label className="grid gap-2 text-sm font-medium">
            HTML-документ
            <textarea className="min-h-40 border border-neutral-300 p-3" value={html} onChange={(event) => setHtml(event.target.value)} required />
          </label>
        )}
        <div className="mt-5">
          <Button type="submit">{seoStore.isLoading ? "Идет анализ..." : "Анализировать"}</Button>
        </div>
      </form>

      {seoStore.errorMessage ? (
        <p className="border border-red-300 bg-white p-3 text-sm text-red-700">
          {seoStore.errorMessage}
        </p>
      ) : null}

      {seoStore.result ? (
        <div className="grid gap-5">
          <div className="flex items-center justify-between border border-neutral-200 bg-white p-5">
            <div>
              <h2 className="text-lg font-semibold">Результаты</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Отчет сохранен в истории.{" "}
                <Link className="font-semibold text-[#2563EB]" href={routes.history}>
                  Открыть историю
                </Link>
              </p>
            </div>
            <span className="border-2 border-[#2563EB] px-4 py-2 text-xl font-bold text-[#2563EB]">{seoStore.result.score}/100</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {seoStore.result.checks.map((check) => (
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
            <p className="text-sm leading-6 text-neutral-700">{seoStore.result.aiReview}</p>
          </section>
        </div>
      ) : null}
    </section>
  );
});
