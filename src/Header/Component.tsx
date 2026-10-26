import { useRouterState } from "@tanstack/react-router";
import React, { useEffect } from "react";

import { AppLink } from "#/components/AppLink";
import { Logo } from "#/components/Logo/Logo";
import { useLocale } from "#/i18n/useLocale";
import type { Header as HeaderType } from "#/payload-types";
import { useHeaderTheme } from "#/providers/HeaderTheme";

import { HeaderNav } from "./Nav";

export const Header: React.FC<{ data: HeaderType }> = ({ data }) => {
  const { headerTheme, setHeaderTheme } = useHeaderTheme();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const locale = useLocale();

  // Reset on navigation; the new page sets its own theme in the same commit (its effects run after ours)
  useEffect(() => {
    setHeaderTheme(null);
  }, [pathname, setHeaderTheme]);

  return (
    <header
      className="relative z-20 container"
      {...(headerTheme ? { "data-theme": headerTheme } : {})}
    >
      <div className="flex justify-between py-8">
        <AppLink href={`/${locale}`}>
          <Logo loading="eager" priority="high" className="invert dark:invert-0" />
        </AppLink>
        <HeaderNav data={data} />
      </div>
    </header>
  );
};
