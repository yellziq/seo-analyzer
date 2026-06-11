import type { SeoCheckStatus } from "@shared/api/types";

export const statusLabels: Record<SeoCheckStatus, string> = {
  Passed: "Пройдено",
  Warning: "Предупреждение",
  Failed: "Ошибка",
};

export const tagLabels: Record<string, string> = {
  Title: "Title",
  "Meta Description": "Meta Description",
  H1: "H1",
  "H2-H6": "H2-H6",
  Canonical: "Canonical",
  "Robots Meta": "Robots Meta",
  "Open Graph": "Open Graph",
  "Images Alt": "Alt у изображений",
  HTTPS: "HTTPS",
  "URL Length": "Длина URL",
  "HTML Lang": "HTML lang",
  "Text Content": "Текстовый контент",
  Viewport: "Viewport",
  Favicon: "Favicon",
  "Robots.txt": "Robots.txt",
  "Sitemap.xml": "Sitemap.xml",
  "Schema.org": "Schema.org",
  "Broken Links": "Битые ссылки",
  Links: "Ссылки",
  "HTML Size": "Размер HTML",
  "Word Count": "Количество слов",
  Hreflang: "Hreflang",
  "Duplicate Headings": "Дубликаты заголовков",
  "Large Images": "Крупные изображения",
  "URL Fetch": "Загрузка URL",
};
