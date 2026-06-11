import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@features/auth/ui/login-form";
import { routes } from "@shared/config/routes";

export const metadata: Metadata = {
  title: "Вход",
  description: "Вход в панель SEO Analyzer.",
};

export default function LoginPage(): React.JSX.Element {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-5 text-neutral-950">
      <section className="w-full max-w-md border border-neutral-200 p-6">
        <h1 className="text-2xl font-semibold">Вход</h1>
        <p className="mb-6 mt-2 text-sm text-neutral-600">Войдите в панель SEO-анализа.</p>
        <Suspense fallback={<div className="text-sm text-neutral-500">Загрузка формы...</div>}>
          <LoginForm />
        </Suspense>
        <Link className="mt-5 inline-block text-sm font-semibold text-[#2563EB]" href={routes.register}>
          Создать аккаунт
        </Link>
      </section>
    </main>
  );
}
