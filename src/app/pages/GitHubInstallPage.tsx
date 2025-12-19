"use client";

import { useEffect } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Status } from "@/generated/prisma/enums";

export default function GitHubInstallPage() {
  const trpc = useTRPC();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const error = searchParams.get("error");
  
  const pollingEnabled = status === "connected";

  const { data: installationStatus } = useQuery({
    ...trpc.installationProcess.findRecent.queryOptions(),
    enabled: pollingEnabled,
    refetchInterval: 2000, // Poll every 2 seconds
  });

  useEffect(() => {
    if (
      status === "connected" &&
      installationStatus?.status === Status.COMPLETED
    ) {
      if (window.opener) {
        window.opener.postMessage(
          { type: "GITHUB_INSTALL_SUCCESS" },
          window.origin
        );
      }
      
      setTimeout(() => {
        window.close();
      }, 1000);
    }
  }, [status, installationStatus]);

  // Error messages mapping
  const errorMessages = {
    missing_params: {
      title: "Missing Parameters",
      description: "Required installation parameters are missing. Please try installing the GitHub App again.",
      icon: AlertCircle,
      color: "text-orange-500",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication failed. Please sign in and try again.",
      icon: XCircle,
      color: "text-red-500",
    },
    user_not_found: {
      title: "User Not Found",
      description: "Your user account could not be found. Please contact support.",
      icon: XCircle,
      color: "text-red-500",
    },
    installation_failed: {
      title: "Installation Failed",
      description: "Something went wrong during installation. Please try again.",
      icon: XCircle,
      color: "text-red-500",
    },
  };

  // Render error state
  if (error && errorMessages[error as keyof typeof errorMessages]) {
    const errorInfo = errorMessages[error as keyof typeof errorMessages];
    const Icon = errorInfo.icon;

    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-4">
              <Icon className={`h-12 w-12 ${errorInfo.color}`} />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {errorInfo.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {errorInfo.description}
            </p>
          </div>

          <button
            onClick={() => window.close()}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  // Render connecting/syncing state
  if (status === "connected") {
    const isCompleted = installationStatus?.status === "COMPLETED";
    
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              {isCompleted ? (
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              ) : (
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isCompleted ? "Installation Complete!" : "Setting Up Your Repositories"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isCompleted 
                ? "Successfully synced your repositories. Closing window..."
                : "We're syncing your repositories and setting up Gitdocs AI. This may take a few moments."}
            </p>
          </div>

          {!isCompleted && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span>Syncing repositories...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default state (shouldn't normally reach here)
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-4">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Processing...
          </h1>
          <p className="text-sm text-muted-foreground">
            Please wait while we complete your installation.
          </p>
        </div>
      </div>
    </div>
  );
}