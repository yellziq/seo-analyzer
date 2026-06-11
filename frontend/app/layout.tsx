import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { CommonWrapper } from "@widgets/wrappers/common-wrapper";

const siteUrl = "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SEO Analyzer",
    template: "%s | SEO Analyzer",
  },
  description: "Анализируйте страницы, проверяйте SEO-теги и получайте практические рекомендации.",
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "SEO Analyzer",
    description: "Панель SEO-анализа на Next.js с типизированной backend-интеграцией.",
    url: siteUrl,
    siteName: "SEO Analyzer",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SEO Analyzer",
    applicationCategory: "SEO-приложение",
    operatingSystem: "Веб",
    url: siteUrl,
  };

  return (
    <html lang="ru">
      <body>
        <CommonWrapper>{children}</CommonWrapper>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </body>
    </html>
  );
}
