import Link from "next/link";

export default function NotFound(): React.JSX.Element {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-5 text-neutral-950">
      <section className="max-w-md border border-neutral-200 p-8 text-center">
        <h1 className="text-3xl font-semibold">Страница не найдена</h1>
        <p className="mt-3 text-neutral-600">Запрошенная страница не существует.</p>
        <Link className="mt-6 inline-block border border-[#2563EB] bg-[#2563EB] px-5 py-3 font-semibold text-white" href="/">
          Вернуться на главную
        </Link>
      </section>
    </main>
  );
}
