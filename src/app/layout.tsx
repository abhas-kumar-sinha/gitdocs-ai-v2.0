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
import { ScrollPositionProvider } from "@/contexts/ScrollPositionContext";

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

export const metadata: Metadata = {
  title: "Gitdocs AI",
  description: "",
};

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
