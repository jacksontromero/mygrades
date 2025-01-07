"use client";

import { createContext } from "react";

export const SharedDataContext = createContext({
  allUniversities: [] as string[],
});

export default function SharedContextProvider({
  allUniversities,
  children,
}: {
  allUniversities: string[];
  children: React.ReactNode;
}) {
  return (
    <SharedDataContext.Provider
      value={{
        allUniversities: allUniversities,
      }}
    >
      {children}
    </SharedDataContext.Provider>
  );
}
