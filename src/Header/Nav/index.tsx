import { Link } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import React from "react";

import { CMSLink } from "#/components/Link";
import { LocaleSwitcher } from "#/components/LocaleSwitcher";
import { useLocale, useMessages } from "#/i18n/useLocale";
import type { Header as HeaderType } from "#/payload-types";

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || [];
  const locale = useLocale();
  const t = useMessages();

  return (
    <nav className="flex items-center gap-3">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />;
      })}
      <Link to="/$locale/search" params={{ locale }}>
        <span className="sr-only">{t.search}</span>
        <SearchIcon className="text-primary w-5" />
      </Link>
      <LocaleSwitcher />
    </nav>
  );
};
