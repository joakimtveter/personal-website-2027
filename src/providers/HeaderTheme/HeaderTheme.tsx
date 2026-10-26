import { useEffect } from "react";

import type { Theme } from "#/providers/Theme/types";

import { useHeaderTheme } from ".";

/**
 * Sets the header theme for the current page, e.g. dark over a full-bleed hero image. Render it
 * before any hero that may switch the theme itself.
 */
export const HeaderTheme = ({ theme }: { theme: Theme }) => {
  const { setHeaderTheme } = useHeaderTheme();

  useEffect(() => {
    setHeaderTheme(theme);
  }, [setHeaderTheme, theme]);

  return null;
};
