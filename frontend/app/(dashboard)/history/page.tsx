import type { Metadata } from "next";
import { HistoryList } from "@features/reports/ui/history-list";

export const metadata: Metadata = {
  title: "История",
  description: "Страница истории SEO-анализов.",
};

export default function HistoryPage(): React.JSX.Element {
  return <HistoryList />;
}
