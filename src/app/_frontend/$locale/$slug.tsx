import { createFileRoute, notFound } from "@tanstack/react-router";
import type { RequiredDataFromCollectionSlug } from "payload";

import { RenderBlocks } from "#/blocks/RenderBlocks";
import { RenderHero } from "#/heros/RenderHero";
import { toLocale } from "#/i18n/locales";
import { HeaderTheme } from "#/providers/HeaderTheme/HeaderTheme";
import { getPage } from "#/server/content.functions";
import { generateMeta } from "#/utilities/generateMeta";
import { FC } from "react";

export const Route = createFileRoute("/_frontend/$locale/$slug")({
  loader: async ({ params }) => {
    // Decode to support slugs with special characters
    const result = await getPage({
      data: { locale: toLocale(params.locale), slug: decodeURIComponent(params.slug) },
    });
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData, params }) =>
    generateMeta({
      doc: loaderData?.page,
      locale: toLocale(params.locale),
      publishedLocales: loaderData?.publishedLocales,
      relationTo: "pages",
    }),
  component: SlugPage,
});

function SlugPage() {
  return <PageView page={Route.useLoaderData().page} />;
}

export const PageView: FC<{ page: RequiredDataFromCollectionSlug<"pages"> }> = ({ page }) => {
  const { hero, layout } = page;

  return (
    <article className="pt-16 pb-24">
      <HeaderTheme theme="light" />
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  );
};
