import { createFileRoute } from "@tanstack/react-router";

import { homeStatic } from "#/endpoints/seed/home-static";
import { locales, toLocale } from "#/i18n/locales";
import { getPage } from "#/server/content.functions";
import { generateMeta } from "#/utilities/generateMeta";

import { PageView } from "./$slug";

export const Route = createFileRoute("/_frontend/$locale/")({
  // Falls back to static demo content until the database has been seeded with a home page
  loader: async ({ params }) =>
    (await getPage({ data: { locale: toLocale(params.locale), slug: "home" } })) ?? {
      page: homeStatic,
      publishedLocales: [...locales],
    },
  head: ({ loaderData, params }) =>
    generateMeta({
      doc: loaderData?.page,
      locale: toLocale(params.locale),
      publishedLocales: loaderData?.publishedLocales,
      relationTo: "pages",
    }),
  component: HomePage,
});

function HomePage() {
  return <PageView page={Route.useLoaderData().page} />;
}
