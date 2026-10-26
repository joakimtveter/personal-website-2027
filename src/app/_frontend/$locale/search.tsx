import { createFileRoute } from "@tanstack/react-router";

import type { CardPostData } from "#/components/Card";
import { CollectionArchive } from "#/components/CollectionArchive";
import { toLocale } from "#/i18n/locales";
import { messages } from "#/i18n/messages";
import { useMessages } from "#/i18n/useLocale";
import { HeaderTheme } from "#/providers/HeaderTheme/HeaderTheme";
import { Search } from "#/search/Component";
import { searchPosts } from "#/server/content.functions";
import { toHeadTags } from "#/utilities/generateMeta";
import { siteName } from "#/utilities/siteName";

export const Route = createFileRoute("/_frontend/$locale/search")({
  validateSearch: (search: Record<string, unknown>): { q?: string } =>
    typeof search.q === "string" && search.q ? { q: search.q } : {},
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: ({ deps, params }) =>
    searchPosts({ data: { locale: toLocale(params.locale), query: deps.q } }),
  head: ({ params }) =>
    toHeadTags({
      path: "/search",
      title: `${messages[toLocale(params.locale)].search} | ${siteName}`,
    }),
  component: SearchPage,
});

function SearchPage() {
  const posts = Route.useLoaderData();
  const { q } = Route.useSearch();
  const t = useMessages();

  return (
    <div className="pt-24 pb-24">
      <HeaderTheme theme="light" />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">{t.search}</h1>

          <div className="mx-auto max-w-[50rem]">
            <Search initialValue={q} />
          </div>
        </div>
      </div>

      {posts.length > 0 ? (
        <CollectionArchive posts={posts as CardPostData[]} />
      ) : (
        <div className="container">{t.noResults}</div>
      )}
    </div>
  );
}
