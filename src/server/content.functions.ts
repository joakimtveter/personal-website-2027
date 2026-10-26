import { notFound, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { Payload, Where } from "payload";

import { isLocale, locales, type AppLocale } from "#/i18n/locales";
import type { Page, Post } from "#/payload-types";
import { getDocHref, getLocaleFromPath, localizeHref } from "#/utilities/localizeHref";

import { getDraftContext, getPayloadClient } from "./payload.server";

export const postsPerPage = 12;

// Payload documents are plain JSON, but their generated types contain `unknown` (rich text,
// JSON fields) which TanStack's serializability check rejects, so output validation is relaxed
const readOptions = { method: "GET", strict: { output: false } } as const;

type LocaleInput = { locale: AppLocale };
type SlugInput = LocaleInput & { slug: string };

const validateLocale = (data: unknown): LocaleInput => {
  const locale = (data as Partial<LocaleInput> | undefined)?.locale;
  if (!isLocale(locale)) throw notFound();
  return { locale };
};

const validateSlug = (data: unknown): SlugInput => {
  const slug = (data as Partial<SlugInput> | undefined)?.slug;
  if (typeof slug !== "string" || !slug) throw notFound();
  return { ...validateLocale(data), slug };
};

/** Throws a router redirect when the redirects collection has an entry for this path */
const throwIfRedirected = async (payload: Payload, path: string) => {
  const { docs } = await payload.find({
    collection: "redirects",
    depth: 1,
    limit: 1,
    pagination: false,
    where: { from: { equals: path } },
  });

  const to = docs[0]?.to;
  if (!to) return;

  const locale = getLocaleFromPath(path);
  let href: string | null | undefined;

  if (to.type === "reference" && to.reference && typeof to.reference.value === "object") {
    href = getDocHref(
      { relationTo: to.reference.relationTo, slug: to.reference.value.slug },
      locale,
    );
  } else if (to.url) {
    href = localizeHref(to.url, locale);
  }

  if (href && href !== path) throw redirect({ href, statusCode: 301 });
};

/** Publishing status is stored per locale; this lists the locales a document is live in */
const getPublishedLocales = async (
  payload: Payload,
  collection: "pages" | "posts",
  id: number,
): Promise<AppLocale[]> => {
  const doc = await payload.findByID({
    collection,
    id,
    depth: 0,
    disableErrors: true,
    locale: "all",
    // Only the per-locale status is read, which is not sensitive
    overrideAccess: true,
    select: { _status: true },
  });

  // With `locale: 'all'`, localized fields come back keyed by locale
  const statuses = (doc?._status ?? {}) as Partial<Record<AppLocale, string>>;

  return locales.filter((locale) => statuses[locale] === "published");
};

export type ArchiveBlockWithDocs = Extract<Page["layout"][number], { blockType: "archive" }> & {
  populatedDocs?: Post[];
};

/** Archive blocks that query by collection are resolved here, since components can't query Payload */
const populateArchiveBlocks = async (payload: Payload, page: Page, locale: AppLocale) => {
  const layout = await Promise.all(
    page.layout.map(async (block): Promise<Page["layout"][number] | ArchiveBlockWithDocs> => {
      if (block.blockType !== "archive" || block.populateBy !== "collection") return block;

      const categoryIDs = block.categories?.map((category) =>
        typeof category === "object" ? category.id : category,
      );

      const { docs } = await payload.find({
        collection: "posts",
        depth: 1,
        limit: block.limit || 3,
        locale,
        overrideAccess: false,
        ...(categoryIDs?.length ? { where: { categories: { in: categoryIDs } } } : {}),
      });

      return { ...block, populatedDocs: docs };
    }),
  );

  return { ...page, layout };
};

export const getSiteData = createServerFn(readOptions)
  .validator(validateLocale)
  .handler(async ({ data: { locale } }) => {
    const { draft, payload } = await getDraftContext();

    const [header, footer] = await Promise.all([
      payload.findGlobal({ slug: "header", depth: 1, locale }),
      payload.findGlobal({ slug: "footer", depth: 1, locale }),
    ]);

    return { draft, footer, header };
  });

export const getPage = createServerFn(readOptions)
  .validator(validateSlug)
  .handler(async ({ data: { locale, slug } }) => {
    const { draft, payload, user } = await getDraftContext();

    await throwIfRedirected(payload, getDocHref({ relationTo: "pages", slug }, locale));

    const { docs } = await payload.find({
      collection: "pages",
      depth: 2,
      draft,
      limit: 1,
      locale,
      overrideAccess: false,
      pagination: false,
      user,
      where: { slug: { equals: slug } },
    });

    const page = docs[0];
    if (!page) return null;

    const [pageWithArchives, publishedLocales] = await Promise.all([
      populateArchiveBlocks(payload, page, locale),
      getPublishedLocales(payload, "pages", page.id),
    ]);

    return { page: pageWithArchives, publishedLocales };
  });

export const getPost = createServerFn(readOptions)
  .validator(validateSlug)
  .handler(async ({ data: { locale, slug } }) => {
    const { draft, payload, user } = await getDraftContext();

    await throwIfRedirected(payload, getDocHref({ relationTo: "posts", slug }, locale));

    const { docs } = await payload.find({
      collection: "posts",
      depth: 2,
      draft,
      limit: 1,
      locale,
      overrideAccess: false,
      pagination: false,
      user,
      where: { slug: { equals: slug } },
    });

    const post = docs[0];
    if (!post) throw notFound();

    return { post, publishedLocales: await getPublishedLocales(payload, "posts", post.id) };
  });

export const getPosts = createServerFn(readOptions)
  .validator((data: unknown) => {
    const page = Number((data as { page?: unknown } | undefined)?.page ?? 1);
    if (!Number.isInteger(page) || page < 1) throw notFound();
    return { ...validateLocale(data), page };
  })
  .handler(async ({ data: { locale, page } }) => {
    const payload = await getPayloadClient();

    const posts = await payload.find({
      collection: "posts",
      depth: 1,
      limit: postsPerPage,
      locale,
      overrideAccess: false,
      page,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
      },
    });

    if (page > 1 && page > posts.totalPages) throw notFound();

    return posts;
  });

export const searchPosts = createServerFn(readOptions)
  .validator((data: unknown) => {
    const query = (data as { query?: unknown } | undefined)?.query;
    return { ...validateLocale(data), query: typeof query === "string" ? query.trim() : "" };
  })
  .handler(async ({ data: { locale, query } }) => {
    const payload = await getPayloadClient();

    const where: Where | undefined = query
      ? {
          or: [
            { title: { like: query } },
            { "meta.description": { like: query } },
            { "meta.title": { like: query } },
            { slug: { like: query } },
          ],
        }
      : undefined;

    const { docs } = await payload.find({
      collection: "search",
      depth: 1,
      limit: postsPerPage,
      locale,
      // The search collection is only readable by admins; it only holds published posts
      overrideAccess: true,
      pagination: false,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
      },
      where,
    });

    return docs;
  });
