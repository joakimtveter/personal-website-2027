import { locales as allLocales, type AppLocale } from "#/i18n/locales";

import type { Config, Media, Page, Post } from "../payload-types";
import { getServerSideURL } from "./getURL";
import { getDocHref } from "./localizeHref";
import { mergeOpenGraph, type OpenGraph } from "./mergeOpenGraph";
import { siteName } from "./siteName";

const getImageURL = (image?: Media | Config["db"]["defaultIDType"] | null) => {
  if (!image || typeof image !== "object" || !image.url) return undefined;

  const serverUrl = getServerSideURL();
  const ogUrl = image.variants?.og?.url;

  return ogUrl ? serverUrl + ogUrl : serverUrl + image.url;
};

type HeadTags = {
  links: { href: string; hrefLang?: string; rel: string }[];
  meta: Record<string, string>[];
};

/** Converts title, Open Graph and alternate-language data to TanStack `head()` tags */
export const toHeadTags = ({
  alternateLocales = allLocales,
  description,
  og,
  path,
  title,
}: {
  /** Locales the content is available in, for `hreflang` alternates */
  alternateLocales?: readonly AppLocale[];
  description?: string | null;
  og?: OpenGraph;
  /** Path without the locale prefix, e.g. `/posts/my-post` */
  path: string;
  title: string;
}): HeadTags => {
  const serverUrl = getServerSideURL();
  const openGraph = mergeOpenGraph({ description: description || undefined, title, ...og });

  return {
    links: [
      ...alternateLocales.map((code) => ({
        href: `${serverUrl}/${code}${path === "/" ? "" : path}`,
        hrefLang: code,
        rel: "alternate",
      })),
      ...(openGraph.url ? [{ href: openGraph.url, rel: "canonical" }] : []),
    ],
    meta: [
      { title },
      ...(description ? [{ name: "description", content: description }] : []),
      { property: "og:type", content: openGraph.type ?? "website" },
      { property: "og:site_name", content: siteName },
      { property: "og:title", content: openGraph.title ?? title },
      ...(openGraph.description
        ? [{ property: "og:description", content: openGraph.description }]
        : []),
      ...(openGraph.image ? [{ property: "og:image", content: openGraph.image }] : []),
      ...(openGraph.url ? [{ property: "og:url", content: openGraph.url }] : []),
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
};

export const generateMeta = (args: {
  doc: Partial<Page> | Partial<Post> | null | undefined;
  locale: AppLocale;
  publishedLocales?: readonly AppLocale[];
  relationTo: "pages" | "posts";
}): HeadTags => {
  const { doc, locale, publishedLocales, relationTo } = args;

  const title = doc?.meta?.title ? `${doc.meta.title} | ${siteName}` : siteName;
  const href = getDocHref({ relationTo, slug: doc?.slug }, locale);

  return toHeadTags({
    alternateLocales: publishedLocales,
    description: doc?.meta?.description,
    og: {
      image: getImageURL(doc?.meta?.image),
      type: relationTo === "posts" ? "article" : "website",
      url: getServerSideURL() + href,
    },
    path: href.slice(`/${locale}`.length) || "/",
    title,
  });
};
