import { createFileRoute } from "@tanstack/react-router";

import { toLocale } from "#/i18n/locales";
import { messages } from "#/i18n/messages";
import { getPosts } from "#/server/content.functions";
import { toHeadTags } from "#/utilities/generateMeta";
import { siteName } from "#/utilities/siteName";

import { PostsArchive } from "./index";

export const Route = createFileRoute("/_frontend/$locale/posts/page/$pageNumber")({
  loader: ({ params }) =>
    getPosts({ data: { locale: toLocale(params.locale), page: Number(params.pageNumber) } }),
  head: ({ params }) => {
    const t = messages[toLocale(params.locale)];
    return toHeadTags({
      path: `/posts/page/${params.pageNumber}`,
      title: `${t.posts} – ${t.pageNumber(Number(params.pageNumber))} | ${siteName}`,
    });
  },
  component: PostsPage,
});

function PostsPage() {
  return <PostsArchive posts={Route.useLoaderData()} />;
}
