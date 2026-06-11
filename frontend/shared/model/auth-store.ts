import { makeAutoObservable } from "mobx";

export type AuthUser = {
  name: string;
  email: string;
};

export class AuthStore {
  user: AuthUser | null = null;
  isReady = false;

  constructor() {
    makeAutoObservable(this);
  }

  hydrate(): void {
    if (typeof window === "undefined") {
      return;
    }

    const savedUser = window.localStorage.getItem("seo-user");
    this.user = savedUser ? (JSON.parse(savedUser) as AuthUser) : null;
    this.isReady = true;
  }

  login(email: string): void {
    const user = {
      name: email.split("@")[0] || "Пользователь",
      email,
    };
    this.user = user;
    window.localStorage.setItem("seo-user", JSON.stringify(user));
    document.cookie = "seo-auth=true; path=/; max-age=86400; SameSite=Lax";
  }

  register(name: string, email: string): void {
    const user = { name, email };
    this.user = user;
    window.localStorage.setItem("seo-user", JSON.stringify(user));
    document.cookie = "seo-auth=true; path=/; max-age=86400; SameSite=Lax";
  }

  logout(): void {
    this.user = null;
    window.localStorage.removeItem("seo-user");
    document.cookie = "seo-auth=; path=/; max-age=0; SameSite=Lax";
  }
}
