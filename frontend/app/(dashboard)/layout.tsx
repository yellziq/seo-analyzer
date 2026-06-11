import { Header } from "@widgets/header/header";
import { Sidebar } from "@widgets/sidebar/sidebar";
import { RootWrapper } from "@widgets/wrappers/root-wrapper";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps): React.JSX.Element {
  return (
    <RootWrapper>
      <div className="min-h-screen bg-neutral-50 text-neutral-950">
        <Header />
        <div className="grid min-h-[calc(100vh-64px)] md:grid-cols-[220px_1fr]">
          <Sidebar />
          <main className="p-5">{children}</main>
        </div>
      </div>
    </RootWrapper>
  );
}
