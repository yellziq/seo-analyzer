import Link from "next/link";

export default function ReportsNotFound(): React.JSX.Element {
  return <Link className="border border-[#2563EB] bg-[#2563EB] px-4 py-2 text-white" href="/reports">Отчеты не найдены. Вернуться к отчетам</Link>;
}
