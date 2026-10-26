import { FC, Fragment } from "react";
import { Media } from "#/components/Media";
import { useLocale, useMessages } from "#/i18n/useLocale";
import type { Post } from "#/payload-types";
import { formatAuthors } from "#/utilities/formatAuthors";
import { formatDateTime } from "#/utilities/formatDateTime";

export const PostHero: FC<{
  post: Post;
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post;
  const locale = useLocale();
  const t = useMessages();

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== "";

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="relative z-10 container pb-8 text-white lg:grid lg:grid-cols-[1fr_48rem_1fr]">
        <div className="col-span-1 col-start-1 md:col-span-2 md:col-start-2">
          <div className="mb-6 text-sm uppercase">
            {categories?.map((category, index) => {
              if (typeof category === "object" && category !== null) {
                const { title: categoryTitle } = category;

                const titleToUse = categoryTitle || t.untitledCategory;

                const isLast = index === categories.length - 1;

                return (
                  <Fragment key={index}>
                    {titleToUse}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                );
              }
              return null;
            })}
          </div>

          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:gap-16">
            {hasAuthors && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm">{t.author}</p>

                  <p>{formatAuthors(populatedAuthors)}</p>
                </div>
              </div>
            )}
            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">{t.datePublished}</p>

                <time dateTime={publishedAt}>{formatDateTime(publishedAt, locale)}</time>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {heroImage && typeof heroImage !== "string" && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
        )}
        <div className="pointer-events-none absolute bottom-0 left-0 h-1/2 w-full bg-linear-to-t from-black to-transparent" />
      </div>
    </div>
  );
};
