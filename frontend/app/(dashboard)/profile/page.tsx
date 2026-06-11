import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Профиль",
  description: "Страница личного кабинета пользователя SEO Analyzer.",
};

export default function ProfilePage(): React.JSX.Element {
  return (
    <section className="grid gap-5">
      <div className="border border-neutral-200 bg-white p-5">
        <h1 className="text-2xl font-semibold">Личный кабинет</h1>
        <p className="mt-2 text-neutral-600">Управляйте аккаунтом и SEO-процессами из одной панели.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="border border-neutral-200 bg-white p-5">
          <h2 className="font-semibold">Анализы</h2>
          <p className="mt-3 text-3xl font-bold text-[#2563EB]">12</p>
        </article>
        <article className="border border-neutral-200 bg-white p-5">
          <h2 className="font-semibold">Средний балл</h2>
          <p className="mt-3 text-3xl font-bold text-[#2563EB]">81</p>
        </article>
        <article className="border border-neutral-200 bg-white p-5">
          <h2 className="font-semibold">Открытые проблемы</h2>
          <p className="mt-3 text-3xl font-bold text-[#2563EB]">7</p>
        </article>
      </div>
    </section>
  );
}
