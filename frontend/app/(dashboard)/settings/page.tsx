import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Настройки",
  description: "Настройки панели SEO Analyzer.",
};

export default function SettingsPage(): React.JSX.Element {
  return (
    <section className="border border-neutral-200 bg-white p-5">
      <h1 className="text-2xl font-semibold">Настройки</h1>
      <div className="mt-5 grid gap-4">
        <label className="flex items-center justify-between border border-neutral-200 p-3">
          Email-уведомления
          <input defaultChecked type="checkbox" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Тема интерфейса
          <select className="border border-neutral-300 px-3 py-2" defaultValue="system">
            <option value="system">Системная</option>
            <option value="light">Светлая</option>
            <option value="dark">Темная</option>
          </select>
        </label>
      </div>
    </section>
  );
}
