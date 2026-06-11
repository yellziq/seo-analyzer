import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Главная",
  description: "Приветственная страница веб-приложения SEO Analyzer.",
};

export default function LandingPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <span className="text-xl font-semibold">SEO Analyzer</span>
          <nav className="flex items-center gap-3 text-sm">
            <Link className="border border-neutral-300 px-4 py-2" href="/auth/login">
              Вход
            </Link>
            <Link className="border border-[#2563EB] bg-[#2563EB] px-4 py-2 text-white" href="/auth/register">
              Регистрация
            </Link>
          </nav>
        </div>
      </header>
      <section className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl content-center gap-8 px-5 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase text-[#2563EB]">SEO-анализатор</p>
          <h1 className="text-5xl font-semibold tracking-normal text-neutral-950">
            Анализируйте SEO-теги и быстрее улучшайте качество страниц.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
            Отправьте URL или HTML-документ, проверьте важные SEO-параметры и получите краткий AI-обзор с рекомендациями.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="border border-[#2563EB] bg-[#2563EB] px-5 py-3 font-semibold text-white" href="/auth/login">
            Начать анализ
          </Link>
          <Link className="border border-neutral-300 px-5 py-3 font-semibold text-neutral-900" href="/reports">
            Посмотреть отчеты
          </Link>
        </div>
      </section>
    </main>
  );
}
