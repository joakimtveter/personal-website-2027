import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";
import { createFolderField, createTagField } from "payload";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      required: true,
    },
    createFolderField({ relationTo: "folders" }),
    createTagField({ relationTo: "tags" }),
    {
      name: "caption",
      type: "richText",
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()];
        },
      }),
    },
  ],
  upload: {
    adminThumbnail: "thumbnail",
  },
};

export const mediaSharpOptions = {
  focalPoint: true,
  variants: [
    {
      name: "thumbnail",
      width: 300,
    },
    {
      name: "square",
      width: 500,
      height: 500,
    },
    {
      name: "small",
      width: 600,
    },
    {
      name: "medium",
      width: 900,
    },
    {
      name: "large",
      width: 1400,
    },
    {
      name: "xlarge",
      width: 1920,
    },
    {
      name: "og",
      width: 1200,
      height: 630,
      crop: "center",
    },
  ],
};
