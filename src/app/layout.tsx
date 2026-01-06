import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { Geist_Mono, Caveat, Nunito } from "next/font/google";
import GoogleTagManager from "@/components/analytics/GoogleTagManager";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gitdocs.space"),

  applicationName: "Gitdocs AI",
  generator: "Next.js",

  referrer: "origin-when-cross-origin",

  verification: {
    google: "jE8xZwoJxnDc2ICzxeLXfUNjB1xxBdMBxkwOVsxsnEY",
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    siteName: "Gitdocs AI",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito"
})

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat"
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${caveat.variable} ${geistMono.variable} ${nunito.variable} antialiased`}
      >
        <GoogleTagManager />
        <Providers>
          <Toaster />
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
