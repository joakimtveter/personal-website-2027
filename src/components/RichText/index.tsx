import {
  SerializedBlockNode,
  SerializedLinkNode,
  WithDefaultNodes,
} from "@payloadcms/richtext-lexical";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from "@payloadcms/richtext-lexical/react";
import { useMemo } from "react";

import { BannerBlock } from "#/blocks/Banner/Component";
import { CallToActionBlock } from "#/blocks/CallToAction/Component";
import { CodeBlock, CodeBlockProps } from "#/blocks/Code/Component";
import { MediaBlock } from "#/blocks/MediaBlock/Component";
import type { AppLocale } from "#/i18n/locales";
import { useLocale } from "#/i18n/useLocale";
import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from "#/payload-types";
import { getDocHref } from "#/utilities/localizeHref";
import { cn } from "#/utilities/ui";

type NodeTypes = WithDefaultNodes<
  | SerializedBlockNode<BannerBlockProps>
  | SerializedBlockNode<CTABlockProps>
  | SerializedBlockNode<CodeBlockProps>
  | SerializedBlockNode<MediaBlockProps>
>;

const createInternalDocToHref =
  (locale: AppLocale) =>
  ({ linkNode }: { linkNode: SerializedLinkNode }) => {
    const { value, relationTo } = linkNode.fields.doc!;
    if (typeof value !== "object") {
      throw new Error("Expected value to be an object");
    }
    const slug = typeof value.slug === "string" ? value.slug : null;
    return getDocHref({ relationTo: relationTo === "posts" ? "posts" : "pages", slug }, locale);
  };

const createJSXConverters =
  (locale: AppLocale): JSXConvertersFunction<NodeTypes> =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref: createInternalDocToHref(locale) }),
    blocks: {
      banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
      mediaBlock: ({ node }) => (
        <MediaBlock
          className="col-span-3 col-start-1"
          imgClassName="m-0"
          {...node.fields}
          captionClassName="mx-auto max-w-[48rem]"
          enableGutter={false}
          disableInnerContainer={true}
        />
      ),
      code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
      cta: ({ node }) => <CallToActionBlock {...node.fields} />,
    },
  });

type Props = {
  data: SerializedEditorState;
  enableGutter?: boolean;
  enableProse?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props;
  const locale = useLocale();
  const converters = useMemo(() => createJSXConverters(locale), [locale]);

  return (
    <ConvertRichText
      converters={converters}
      className={cn(
        "payload-richtext",
        {
          container: enableGutter,
          "max-w-none": !enableGutter,
          "mx-auto prose md:prose-md dark:prose-invert": enableProse,
        },
        className,
      )}
      {...rest}
    />
  );
}
