import { locales, type AppLocale } from "#/i18n/locales";
import { getServerSideURL } from "#/utilities/getURL";
import { getDocHref } from "#/utilities/localizeHref";

import { getPayloadClient } from "./payload.server";

type SitemapEntry = {
  lastmod: string;
  /** Locales the entry is published in */
  locales: readonly AppLocale[];
  path: (locale: AppLocale) => string;
};

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Every entry is listed once per published locale, with `hreflang` alternates to the others */
const renderUrlset = (entries: SitemapEntry[]) => {
  const siteUrl = getServerSideURL();

  const urls = entries.flatMap(({ lastmod, locales: entryLocales, path }) =>
    entryLocales.map((locale) => {
      const alternates = entryLocales
        .map(
          (alternate) =>
            `<xhtml:link rel="alternate" hreflang="${alternate}" href="${escapeXml(siteUrl + path(alternate))}"/>`,
        )
        .join("");

      return `<url><loc>${escapeXml(siteUrl + path(locale))}</loc><lastmod>${lastmod}</lastmod>${alternates}</url>`;
    }),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;
};

export const xmlResponse = (xml: string) =>
  new Response(xml, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });

export const renderSitemapIndex = () => {
  const siteUrl = getServerSideURL();
  const sitemaps = ["pages-sitemap.xml", "posts-sitemap.xml"];

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((name) => `<sitemap><loc>${siteUrl}/${name}</loc></sitemap>`).join("\n")}
</sitemapindex>`;
};

export const renderCollectionSitemap = async (collection: "pages" | "posts") => {
  const payload = await getPayloadClient();
  const dateFallback = new Date().toISOString();

  // Publishing status is stored per locale, so each locale is queried separately
  const results = await Promise.all(
    locales.map(async (locale) => {
      const { docs } = await payload.find({
        collection,
        depth: 0,
        draft: false,
        limit: 1000,
        locale,
        overrideAccess: false,
        pagination: false,
        select: { slug: true, updatedAt: true },
        where: { _status: { equals: "published" } },
      });
      return docs.map((doc) => ({ ...doc, locale }));
    }),
  );

  const bySlug = new Map<string, { lastmod: string; locales: AppLocale[] }>();

  for (const doc of results.flat()) {
    if (!doc.slug) continue;
    const entry = bySlug.get(doc.slug) ?? { lastmod: doc.updatedAt || dateFallback, locales: [] };
    entry.locales.push(doc.locale);
    bySlug.set(doc.slug, entry);
  }

  const entries: SitemapEntry[] = [...bySlug].map(([slug, { lastmod, locales }]) => ({
    lastmod,
    locales,
    path: (locale) => getDocHref({ relationTo: collection, slug }, locale),
  }));

  if (collection === "pages") {
    entries.push(
      { lastmod: dateFallback, locales, path: (locale) => `/${locale}/posts` },
      { lastmod: dateFallback, locales, path: (locale) => `/${locale}/search` },
    );
  }

  return renderUrlset(entries);
};
