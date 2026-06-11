"use client";

import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { routes } from "@shared/config/routes";
import { rootStore } from "@shared/model/root-store";
import { Button } from "@shared/ui/button";

export const Header = observer(function Header(): React.JSX.Element {
  const router = useRouter();

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="flex h-16 items-center justify-between px-5">
        <span className="text-lg font-semibold text-neutral-950">SEO Analyzer</span>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-neutral-600">{rootStore.authStore.user?.email}</span>
          <Button
            variant="secondary"
            onClick={() => {
              rootStore.authStore.logout();
              router.push(routes.home);
            }}
          >
            Выйти
          </Button>
        </div>
      </div>
    </header>
  );
});
