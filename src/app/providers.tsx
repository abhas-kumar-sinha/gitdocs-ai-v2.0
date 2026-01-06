"use client";

import { ThemeProvider } from "next-themes";
import { ScrollPositionProvider } from "@/contexts/ScrollPositionContext";
import { RepositoryProvider } from "@/contexts/RepositoryContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { AiProvider } from "@/contexts/AiContext";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "@/trpc/client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollPositionProvider>
            <RepositoryProvider>
              <SidebarProvider>
                <AiProvider>
                  {children}
                </AiProvider>
              </SidebarProvider>
            </RepositoryProvider>
          </ScrollPositionProvider>
        </ThemeProvider>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
