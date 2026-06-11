"use client";

import { useEffect } from "react";
import { rootStore } from "@shared/model/root-store";

type CommonWrapperProps = {
  children: React.ReactNode;
};

export function CommonWrapper({ children }: CommonWrapperProps): React.JSX.Element {
  useEffect(() => {
    rootStore.authStore.hydrate();
    rootStore.reportsStore.hydrate();
  }, []);

  return <>{children}</>;
}
