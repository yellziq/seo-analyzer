"use client";

import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes } from "@shared/config/routes";
import { rootStore } from "@shared/model/root-store";

type AuthWrapperProps = {
  children: React.ReactNode;
};

export const AuthWrapper = observer(function AuthWrapper({
  children,
}: AuthWrapperProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (rootStore.authStore.isReady && !rootStore.authStore.user) {
      router.replace(`${routes.login}?from=${pathname}`);
    }
  }, [pathname, router]);

  if (!rootStore.authStore.isReady) {
    return <div className="p-6 text-sm text-neutral-500">Загрузка сессии...</div>;
  }

  if (!rootStore.authStore.user) {
    return <div className="p-6 text-sm text-neutral-500">Перенаправление...</div>;
  }

  return <>{children}</>;
});
