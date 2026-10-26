import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import { CollectionArchive } from "#/components/CollectionArchive";
import { PageRange } from "#/components/PageRange";
import { Pagination } from "#/components/Pagination";
import { toLocale } from "#/i18n/locales";
import { messages } from "#/i18n/messages";
import { useMessages } from "#/i18n/useLocale";
import { HeaderTheme } from "#/providers/HeaderTheme/HeaderTheme";
import { getPosts, postsPerPage } from "#/server/content.functions";
import { toHeadTags } from "#/utilities/generateMeta";
import { siteName } from "#/utilities/siteName";

export const Route = createFileRoute("/_frontend/$locale/posts/")({
  loader: ({ params }) => getPosts({ data: { locale: toLocale(params.locale), page: 1 } }),
  head: ({ params }) =>
    toHeadTags({
      path: "/posts",
      title: `${messages[toLocale(params.locale)].posts} | ${siteName}`,
    }),
  component: PostsPage,
});

function PostsPage() {
  return <PostsArchive posts={Route.useLoaderData()} />;
}

export const PostsArchive: React.FC<{ posts: Awaited<ReturnType<typeof getPosts>> }> = ({
  posts,
}) => {
  const t = useMessages();

  return (
    <div className="pt-24 pb-24">
      <HeaderTheme theme="light" />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{t.posts}</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange currentPage={posts.page} limit={postsPerPage} totalDocs={posts.totalDocs} />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  );
};
