import { FC } from "react";

import { CollectionArchive } from "#/components/CollectionArchive";
import RichText from "#/components/RichText";
import type { Post } from "#/payload-types";
import type { ArchiveBlockWithDocs } from "#/server/content.functions";

export const ArchiveBlock: FC<
  ArchiveBlockWithDocs & {
    id?: string;
  }
> = (props) => {
  const { id, introContent, populateBy, populatedDocs, selectedDocs } = props;

  // Collection queries are resolved by the page loader, see `populateArchiveBlocks`
  const posts: Post[] =
    populateBy === "collection"
      ? (populatedDocs ?? [])
      : (selectedDocs ?? []).flatMap((post) =>
          typeof post.value === "object" ? [post.value] : [],
        );

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts} />
    </div>
  );
};
