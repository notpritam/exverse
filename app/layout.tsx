import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Newsreader, JetBrains_Mono } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const SITE = "https://exverse.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Exverse — learn something",
    template: "%s · Exverse",
  },
  description:
    "An open-source place to learn something. Courses you click through as an interactive roadmap — real lessons, end-of-step Q&A, and progress that follows you.",
  applicationName: "Exverse",
  openGraph: { type: "website", siteName: "Exverse", url: SITE },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf4" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e0b" },
  ],
};

// Runs before paint: set the theme from storage (or OS) so there's no flash.
const themeInit = `(function(){try{var t=localStorage.getItem('exverse-theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${serif.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="bg-grid min-h-screen antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
