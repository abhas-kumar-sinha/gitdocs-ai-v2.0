import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { AiProvider } from "@/contexts/AiContext";
import { TRPCReactProvider } from "@/trpc/client";
import { Geist_Mono, Caveat, Nunito } from "next/font/google";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { RepositoryProvider } from "@/contexts/RepositoryContext";
import GoogleTagManager from "@/components/analytics/GoogleTagManager";
import { ScrollPositionProvider } from "@/contexts/ScrollPositionContext";

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
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${caveat.variable} ${geistMono.variable} ${nunito.variable} antialiased`}
          >
            <GoogleTagManager />
            <Providers>
              <ScrollPositionProvider>
                <RepositoryProvider>
                  <SidebarProvider>
                    <AiProvider>
                      <Toaster />
                      {children}
                    </AiProvider>
                  </SidebarProvider>
                </RepositoryProvider>
              </ScrollPositionProvider>
            </Providers>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
