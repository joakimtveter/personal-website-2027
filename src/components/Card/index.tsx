import { FC, Fragment } from "react";

import { AppLink } from "#/components/AppLink";
import { Media } from "#/components/Media";
import { useLocale, useMessages } from "#/i18n/useLocale";
import type { Post } from "#/payload-types";
import { getDocHref } from "#/utilities/localizeHref";
import { cn } from "#/utilities/ui";
import useClickableCard from "#/utilities/useClickableCard";

export type CardPostData = Pick<Post, "slug" | "categories" | "meta" | "title">;

export const Card: FC<{
  alignItems?: "center";
  className?: string;
  doc?: CardPostData;
  relationTo?: "posts";
  showCategories?: boolean;
  title?: string;
}> = (props) => {
  const { cardRef, linkRef } = useClickableCard<HTMLElement>({});
  const locale = useLocale();
  const t = useMessages();
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props;

  const { slug, categories, meta, title } = doc || {};
  const { description, image: metaImage } = meta || {};

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0;
  const titleToUse = titleFromProps || title;
  const sanitizedDescription = description?.replace(/\s/g, " "); // replace non-breaking space with white space
  const href = getDocHref({ relationTo: relationTo ?? "posts", slug }, locale);

  return (
    <article
      className={cn(
        "border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer",
        className,
      )}
      ref={cardRef}
    >
      <div className="relative w-full">
        {!metaImage && <div className="">{t.noImage}</div>}
        {metaImage && typeof metaImage !== "string" && <Media resource={metaImage} size="33vw" />}
      </div>
      <div className="p-4">
        {showCategories && hasCategories && (
          <div className="mb-4 text-sm uppercase">
            {categories?.map((category, index) => {
              if (typeof category === "object") {
                const { title: titleFromCategory } = category;

                const categoryTitle = titleFromCategory || t.untitledCategory;

                const isLast = index === categories.length - 1;

                return (
                  <Fragment key={index}>
                    {categoryTitle}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                );
              }

              return null;
            })}
          </div>
        )}
        {titleToUse && (
          <div className="prose">
            <h3>
              <AppLink className="not-prose" href={href} ref={linkRef}>
                {titleToUse}
              </AppLink>
            </h3>
          </div>
        )}
        {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
      </div>
    </article>
  );
};
