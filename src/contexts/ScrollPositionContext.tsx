"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface ScrollPositionContextType {
  rawScrollPosition: number;
  markdownScrollPosition: number;
  setRawScrollPosition: (position: number) => void;
  setMarkdownScrollPosition: (position: number) => void;
}

const ScrollPositionContext = createContext<ScrollPositionContextType>({
  rawScrollPosition: 0,
  markdownScrollPosition: 0,
  setRawScrollPosition: () => {},
  setMarkdownScrollPosition: () => {},
});

export const useScrollPosition = () => useContext(ScrollPositionContext);

export const ScrollPositionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [rawScrollPosition, setRawScrollPosition] = useState<number>(0);
  const [markdownScrollPosition, setMarkdownScrollPosition] =
    useState<number>(0);

  return (
    <ScrollPositionContext.Provider
      value={{
        rawScrollPosition,
        markdownScrollPosition,
        setRawScrollPosition,
        setMarkdownScrollPosition,
      }}
    >
      {children}
    </ScrollPositionContext.Provider>
  );
};
