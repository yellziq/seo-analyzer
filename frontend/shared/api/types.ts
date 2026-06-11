export type SeoCheckStatus = "Passed" | "Warning" | "Failed";

export type SeoCheck = {
  tag: string;
  status: SeoCheckStatus;
  description: string;
};

export type SeoAnalyzeRequest = {
  url?: string;
  html?: string;
};

export type SeoAnalyzeResponse = {
  score: number;
  checks: SeoCheck[];
  aiReview: string;
};

export type SeoReportSource = {
  type: "url" | "html";
  value: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
};

export type Report = {
  id: string;
  title: string;
  score: number;
  createdAt: string;
  source: SeoReportSource;
  checks: SeoCheck[];
  aiReview: string;
};

export type UpdateSettingsRequest = {
  theme: "system" | "light" | "dark";
  emailNotifications: boolean;
};
