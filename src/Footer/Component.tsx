import { FC } from "react";

import { AppLink } from "#/components/AppLink";
import { CMSLink } from "#/components/Link";
import { Logo } from "#/components/Logo/Logo";
import { useLocale } from "#/i18n/useLocale";
import type { Footer as FooterType } from "#/payload-types";
import { ThemeSelector } from "#/providers/Theme/ThemeSelector";

export const Footer: FC<{ data: FooterType }> = ({ data }) => {
  const navItems = data?.navItems || [];
  const locale = useLocale();

  return (
    <footer className="border-border dark:bg-card mt-auto border-t bg-black text-white">
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:justify-between">
        <AppLink className="flex items-center" href={`/${locale}`}>
          <Logo />
        </AppLink>

        <div className="flex flex-col-reverse items-start gap-4 md:flex-row md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col gap-4 md:flex-row">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />;
            })}
          </nav>
        </div>
      </div>
    </footer>
  );
};
