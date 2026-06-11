import Link from "next/link";
import { routes } from "@shared/config/routes";

const items = [
  { href: routes.profile, label: "Профиль" },
  { href: routes.analyze, label: "Анализ" },
  { href: routes.history, label: "История" },
  { href: routes.reports, label: "Отчеты" },
  { href: routes.settings, label: "Настройки" },
];

export function Sidebar(): React.JSX.Element {
  return (
    <aside className="border-r border-neutral-200 bg-white p-5">
      <nav className="grid gap-2">
        {items.map((item) => (
          <Link className="border border-neutral-200 px-3 py-2 text-sm font-medium" href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
