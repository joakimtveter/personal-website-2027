import { useRouterState } from "@tanstack/react-router";
import React from "react";

import { AppLink } from "#/components/AppLink";
import { isLocale, localeLabels, locales } from "#/i18n/locales";
import { useLocale, useMessages } from "#/i18n/useLocale";
import { cn } from "#/utilities/ui";

/** Reads the published locales that page and post loaders return, if the current route has any */
const selectPublishedLocales = (matches: { loaderData?: unknown }[]) => {
  for (const match of [...matches].reverse()) {
    const data = match.loaderData as { publishedLocales?: unknown } | undefined;
    if (Array.isArray(data?.publishedLocales)) return data.publishedLocales.filter(isLocale);
  }
  return undefined;
};

/**
 * Links to the current path in the other locales (slugs are shared between locales). When the
 * current page or post isn't published in a locale, that locale's home page is linked instead.
 */
export const LocaleSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const locale = useLocale();
  const t = useMessages();
  const { pathname, publishedLocales, searchStr } = useRouterState({
    select: (state) => ({
      pathname: state.location.pathname,
      publishedLocales: selectPublishedLocales(state.matches),
      searchStr: state.location.searchStr,
    }),
    structuralSharing: true,
  });

  return (
    <ul aria-label={t.language} className={cn("flex gap-2 text-sm uppercase", className)}>
      {locales.map((code) => {
        const isAvailable = !publishedLocales || publishedLocales.includes(code);
        const href = isAvailable
          ? pathname.replace(/^\/[^/]+/, `/${code}`) + searchStr
          : `/${code}`;

        return (
          <li key={code}>
            <AppLink
              aria-current={code === locale ? "true" : undefined}
              className={cn(
                "text-primary",
                code === locale ? "font-semibold" : "opacity-60 hover:opacity-100",
              )}
              href={href}
              hrefLang={code}
              lang={code}
              title={localeLabels[code]}
            >
              {code}
            </AppLink>
          </li>
        );
      })}
    </ul>
  );
};
