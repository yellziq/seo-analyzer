import type { Metadata } from "next";
import { ReportDetails } from "@features/reports/ui/report-details";

type ReportPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Отчет",
  description: "Детальный отчет SEO-анализа.",
};

export default async function ReportPage({
  params,
}: ReportPageProps): Promise<React.JSX.Element> {
  const { id } = await params;

  return <ReportDetails reportId={id} />;
}
