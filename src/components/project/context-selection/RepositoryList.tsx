"use client";

import { useState, useMemo } from "react";
import { Repository } from "@/generated/prisma/client";
import { useRepositoryContext } from "@/contexts/RepositoryContext";
import {
  Star,
  GitFork,
  Lock,
  Globe,
  Search,
  Circle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Clock,
} from "lucide-react";
import ConnectGithub from "@/components/common/ConnectGithub";
import { InstallationWithRepositories } from "@/modules/installation/server/procedures";

// --- Helpers ---
const formatNumber = (num: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(num);

const timeAgo = (date: Date | string) => {
  const d = new Date(date);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 3600 * 24),
  );

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(d);
};

const SyncStatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-3 w-3 text-green-500" />;
    case "syncing":
      return <RefreshCw className="h-3 w-3 text-blue-500 animate-spin" />;
    case "failed":
      return <AlertCircle className="h-3 w-3 text-red-500" />;
    default:
      return <Circle className="h-3 w-3 text-muted-foreground" />;
  }
};

export default function RepositoryList({
  selected,
  setSelected,
  userInstallations,
}: {
  selected: Repository | null;
  setSelected: (repo: Repository | null) => void;
  userInstallations: InstallationWithRepositories[] | undefined;
}) {
  const { repositories, isLoading } = useRepositoryContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRepos = useMemo(() => {
    if (!repositories) return [];
    const lowerQuery = searchQuery.toLowerCase();
    return repositories.filter(
      (repo: Repository) =>
        repo.name.toLowerCase().includes(lowerQuery) ||
        repo.fullName.toLowerCase().includes(lowerQuery),
    );
  }, [repositories, searchQuery]);

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-1">
        <div className="h-10 w-full bg-muted/50 rounded-md animate-pulse" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-2 py-3 border-b border-border"
          >
            <div className="flex justify-between">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-3 w-3/4 bg-muted/50 rounded animate-pulse" />
            <div className="flex gap-2 mt-1">
              <div className="h-3 w-8 bg-muted rounded animate-pulse" />
              <div className="h-3 w-8 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Search Input - Fixed at top */}
      <div className="sticky top-1 z-10 pb-4 pt-1 mx-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Find a repository..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto -mx-1 px-1 pt-0.5">
        {filteredRepos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <p className="text-sm">No repositories found.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredRepos.map((repo: Repository) => (
              <button
                key={repo.id}
                onClick={() => setSelected(repo)}
                className={`group cursor-pointer flex flex-col gap-1.5 py-3 border-b border-border px-2 rounded-md transition-all duration-200 text-left w-full ${
                  selected?.id === repo.id
                    ? "border-primary bg-accent/50 shadow-sm border-l-2 border-l-primary"
                    : "hover:bg-accent/30 hover:px-2"
                }`}
              >
                {/* Top Row: Name & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    {repo.private ? (
                      <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    ) : (
                      <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    )}
                    <span
                      className="font-medium text-sm text-foreground truncate"
                      title={repo.fullName}
                    >
                      {repo.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Sync Status Indicator */}
                    <div title={`Sync Status: ${repo.syncStatus}`}>
                      <SyncStatusIcon status={repo.syncStatus} />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {repo.description || (
                    <span className="opacity-50 italic">No description</span>
                  )}
                </p>

                {/* Bottom Row: Stats */}
                <div className="flex items-center gap-3 mt-1 text-[10px] sm:text-xs text-muted-foreground font-medium">
                  {repo.language && (
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-primary/80" />
                      <span className="text-foreground/80">
                        {repo.language}
                      </span>
                    </div>
                  )}

                  {(repo.stargazers > 0 || repo.forks > 0) && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{formatNumber(repo.stargazers)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" />
                        <span>{formatNumber(repo.forks)}</span>
                      </div>
                    </div>
                  )}

                  <div
                    title={`Updated At`}
                    className="flex items-center gap-1 ml-auto opacity-70"
                  >
                    <Clock className="h-3 w-3" />
                    <span>{timeAgo(repo.updatedAt)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Fixed at bottom  */}
      {userInstallations && userInstallations.length > 0 && (
        <div className="sticky bottom-0 z-10 text-xs mx-auto py-1">
          <span className="text-foreground me-1">Missing Git repository?</span>
          <ConnectGithub isSidebarOpen={false} update={true}>
            <span> Adjust GitHub App Permissions → </span>
          </ConnectGithub>
        </div>
      )}
    </div>
  );
}
