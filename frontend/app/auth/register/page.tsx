import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@features/auth/ui/register-form";
import { routes } from "@shared/config/routes";

export const metadata: Metadata = {
  title: "Регистрация",
  description: "Создание аккаунта SEO Analyzer.",
};

export default function RegisterPage(): React.JSX.Element {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-5 text-neutral-950">
      <section className="w-full max-w-md border border-neutral-200 p-6">
        <h1 className="text-2xl font-semibold">Регистрация</h1>
        <p className="mb-6 mt-2 text-sm text-neutral-600">Создайте локальный демо-аккаунт.</p>
        <RegisterForm />
        <Link className="mt-5 inline-block text-sm font-semibold text-[#2563EB]" href={routes.login}>
          Уже есть аккаунт
        </Link>
      </section>
    </main>
  );
}
