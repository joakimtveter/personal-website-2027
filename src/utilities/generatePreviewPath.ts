import type { CollectionSlug } from "payload";

import { defaultLocale, isLocale } from "#/i18n/locales";

export type PreviewSearchParams = {
  path: string;
  previewSecret: string;
};

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: "/posts",
  pages: "",
};

type Props = {
  collection: keyof typeof collectionPrefixMap;
  locale?: string;
  slug: string;
};

export const generatePreviewPath = ({ collection, locale, slug }: Props) => {
  if (slug === undefined || slug === null) {
    return null;
  }

  const localePrefix = `/${isLocale(locale) ? locale : defaultLocale}`;

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug);

  const path =
    collection === "pages" && slug === "home"
      ? localePrefix
      : `${localePrefix}${collectionPrefixMap[collection]}/${encodedSlug}`;

  const encodedParams = new URLSearchParams({
    path,
    previewSecret: process.env.PREVIEW_SECRET || "",
  } satisfies PreviewSearchParams);

  return `/preview?${encodedParams.toString()}`;
};
