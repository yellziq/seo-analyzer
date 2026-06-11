import { AuthStore } from "@shared/model/auth-store";
import { ReportsStore } from "@shared/model/reports-store";
import { SeoStore } from "@shared/model/seo-store";

export class RootStore {
  readonly authStore: AuthStore;
  readonly reportsStore: ReportsStore;
  readonly seoStore: SeoStore;

  constructor() {
    this.authStore = new AuthStore();
    this.reportsStore = new ReportsStore();
    this.seoStore = new SeoStore(this.reportsStore);
  }
}

export const rootStore = new RootStore();
