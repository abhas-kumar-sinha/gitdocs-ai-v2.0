type ModelConfig = {
  model: string;
  temp: number;
};

type RepositorySnapshot = {
  fullName: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  hasReadme: boolean;
  existingReadme: string | null;
  totalFiles: number;
  directories: string[];
  fileTypes: Record<string, number>;
  frameworks: string[];
  features: {
    tests: boolean;
    docker: boolean;
    docs: boolean;
    ci: boolean;
  };
};

type GitHubTreeItem = {
  path?: string;
  mode?: string;
  type?: string;
  sha?: string;
  size?: number;
  url?: string;
};

type FileContext = {
  path: string;
  content: string;
  type: 'full' | 'summary';
  size: number;
};

type ContextDiscoveryResult = {
  requiredFiles: string[];
  reasoning: string;
  estimatedTokens: number;
};

type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export { 
    type ModelConfig, 
    type RepositorySnapshot, 
    type GitHubTreeItem, 
    type FileContext, 
    type ContextDiscoveryResult,
    type ConversationMessage 
}