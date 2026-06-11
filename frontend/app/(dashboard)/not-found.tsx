import Link from "next/link";
import { routes } from "@shared/config/routes";

export default function DashboardNotFound(): React.JSX.Element {
  return (
    <section className="border border-neutral-200 bg-white p-5">
      <h1 className="text-2xl font-semibold">Страница панели не найдена</h1>
      <p className="mt-2 text-neutral-600">Эта защищенная страница не существует.</p>
      <Link className="mt-5 inline-block border border-[#2563EB] bg-[#2563EB] px-4 py-2 font-semibold text-white" href={routes.profile}>
        Перейти в профиль
      </Link>
    </section>
  );
}
