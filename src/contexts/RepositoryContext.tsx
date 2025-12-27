"use client";

import { Repository } from "@/generated/prisma/client";
import React, { createContext, useContext, useState } from "react";

type RepositoryContextType = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  repositories: Repository[];
  setRepositories: React.Dispatch<React.SetStateAction<Repository[]>>;
};

const RepositoryContext = createContext<RepositoryContextType | undefined>(
  undefined,
);

type RepositoryProviderProps = {
  children: React.ReactNode;
};

export const RepositoryProvider: React.FC<RepositoryProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [repositories, setRepositories] = useState<Repository[]>([]);

  return (
    <RepositoryContext.Provider
      value={{ repositories, setRepositories, isLoading, setIsLoading }}
    >
      {children}
    </RepositoryContext.Provider>
  );
};

export const useRepositoryContext = (): RepositoryContextType => {
  const ctx = useContext(RepositoryContext);
  if (!ctx) {
    throw new Error(
      "useRepositoryContext must be used within a RepositoryProvider",
    );
  }
  return ctx;
};

export { RepositoryContext };
