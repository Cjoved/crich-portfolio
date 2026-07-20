import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-raw",
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body-raw",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-raw",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Crich Joved Veridiano — AI Engineer",
  description:
    "AI Engineer building agentic LLM systems, computer vision pipelines, and RAG infrastructure end-to-end, from architecture to production.",
  icons: {
    icon: "/tab.png",
  },
  openGraph: {
    title: "Crich Joved Veridiano — AI Engineer",
    description:
      "AI Engineer building agentic LLM systems, computer vision pipelines, and RAG infrastructure end-to-end, from architecture to production.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Crich Joved Veridiano — AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crich Joved Veridiano — AI Engineer",
    description:
      "AI Engineer building agentic LLM systems, computer vision pipelines, and RAG infrastructure end-to-end, from architecture to production.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
