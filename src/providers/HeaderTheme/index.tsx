import { createContext, useCallback, use, useState, ReactNode } from "react";

import type { Theme } from "#/providers/Theme/types";

export interface ContextType {
  headerTheme?: Theme | null;
  setHeaderTheme: (theme: Theme | null) => void;
}

const initialContext: ContextType = {
  headerTheme: undefined,
  setHeaderTheme: () => null,
};

const HeaderThemeContext = createContext(initialContext);

export const HeaderThemeProvider = ({ children }: { children: ReactNode }) => {
  // Starts unset on both server and client so the header hydrates without a mismatch
  const [headerTheme, setThemeState] = useState<Theme | undefined | null>(undefined);

  const setHeaderTheme = useCallback((themeToSet: Theme | null) => {
    setThemeState(themeToSet);
  }, []);

  return (
    <HeaderThemeContext value={{ headerTheme, setHeaderTheme }}>{children}</HeaderThemeContext>
  );
};

export const useHeaderTheme = (): ContextType => use(HeaderThemeContext);
