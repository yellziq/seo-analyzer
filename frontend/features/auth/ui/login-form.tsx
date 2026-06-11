"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { routes } from "@shared/config/routes";
import { rootStore } from "@shared/model/root-store";
import { Button } from "@shared/ui/button";

export function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>("student@example.com");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    rootStore.authStore.login(email);
    router.push(searchParams.get("from") ?? routes.profile);
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-medium">
        Email
        <input className="border border-neutral-300 px-3 py-2" value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Пароль
        <input className="border border-neutral-300 px-3 py-2" value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
      </label>
      <Button type="submit">Войти</Button>
    </form>
  );
}
