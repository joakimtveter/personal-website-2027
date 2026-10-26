import { defaultLocale, isLocale, type AppLocale } from "#/i18n/locales";

type LinkableDoc = {
  relationTo: "pages" | "posts";
  slug?: string | null;
};

// Payload's own routes are not localized
const isPayloadPath = (href: string) => /^\/(admin|api)(\/|$)/.test(href);

export const isInternalHref = (href: string) => href.startsWith("/") && !href.startsWith("//");

export const getLocaleFromPath = (path: string): AppLocale => {
  const firstSegment = path.split(/[/?#]/)[1];
  return isLocale(firstSegment) ? firstSegment : defaultLocale;
};

/** Prefixes internal paths with the locale, so editors can write `/posts` in custom URLs */
export const localizeHref = (href: string, locale: AppLocale) => {
  if (!isInternalHref(href) || isPayloadPath(href)) return href;

  const firstSegment = href.split(/[/?#]/)[1];
  if (isLocale(firstSegment)) return href;

  return href === "/" ? `/${locale}` : `/${locale}${href}`;
};

export const getDocHref = ({ relationTo, slug }: LinkableDoc, locale: AppLocale) => {
  if (relationTo === "posts") return `/${locale}/posts/${slug}`;
  if (!slug || slug === "home") return `/${locale}`;
  return `/${locale}/${slug}`;
};
