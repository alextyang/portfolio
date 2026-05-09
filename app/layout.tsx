import type { Metadata } from "next";

import { mantineHtmlProps, MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';

import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL("https://alexya.ng"),
  title: {
    default: "Alexander Yang",
    template: "%s | Alexander Yang",
  },
  description: "Full-stack developer using TypeScript and Next.js to build polished products, better workflows, and the systems behind them.",
  applicationName: "Alexander Yang",
  authors: [{ name: "Alexander Yang", url: "https://alexya.ng" }],
  creator: "Alexander Yang",
  publisher: "Alexander Yang",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Alexander Yang",
    description: "Full-stack developer using TypeScript and Next.js to build polished products, better workflows, and the systems behind them.",
    url: "/",
    siteName: "Alexander Yang",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Alexander Yang",
    description: "Full-stack developer using TypeScript and Next.js to build polished products, better workflows, and the systems behind them.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Baskervville:ital,wght@0,400..700;1,400..700&family=Atkinson+Hyperlegible+Next:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`antialiased`}
      >
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
