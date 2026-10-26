import { FC, ReactNode } from "react";
import { HeaderThemeProvider } from "./HeaderTheme";
import { ThemeProvider } from "./Theme";

export const Providers: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>{children}</HeaderThemeProvider>
    </ThemeProvider>
  );
};
