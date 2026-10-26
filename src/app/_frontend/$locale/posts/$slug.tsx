import { createFileRoute } from "@tanstack/react-router";

import { RelatedPosts } from "#/blocks/RelatedPosts/Component";
import RichText from "#/components/RichText";
import { PostHero } from "#/heros/PostHero";
import { toLocale } from "#/i18n/locales";
import { HeaderTheme } from "#/providers/HeaderTheme/HeaderTheme";
import { getPost } from "#/server/content.functions";
import { generateMeta } from "#/utilities/generateMeta";

export const Route = createFileRoute("/_frontend/$locale/posts/$slug")({
  // Decode to support slugs with special characters
  loader: ({ params }) =>
    getPost({ data: { locale: toLocale(params.locale), slug: decodeURIComponent(params.slug) } }),
  head: ({ loaderData, params }) =>
    generateMeta({
      doc: loaderData?.post,
      locale: toLocale(params.locale),
      publishedLocales: loaderData?.publishedLocales,
      relationTo: "posts",
    }),
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();

  return (
    <article className="pt-16 pb-16">
      <HeaderTheme theme="dark" />

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="mx-auto max-w-[48rem]" data={post.content} enableGutter={false} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="col-span-3 col-start-1 mt-12 max-w-[52rem] grid-rows-[2fr] lg:grid lg:grid-cols-subgrid"
              docs={post.relatedPosts.filter((post) => typeof post === "object")}
            />
          )}
        </div>
      </div>
    </article>
  );
}
