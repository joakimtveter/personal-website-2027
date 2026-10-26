import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { searchPlugin } from "@payloadcms/plugin-search";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { GenerateTitle, GenerateURL } from "@payloadcms/plugin-seo/types";
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { Plugin } from "payload";

import { defaultLocale, isLocale } from "#/i18n/locales";
import { Page, Post } from "#/payload-types";
import { beforeSyncWithSearch } from "#/search/beforeSync";
import { searchFields } from "#/search/fieldOverrides";
import { getServerSideURL } from "#/utilities/getURL";
import { siteName } from "#/utilities/siteName";

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | ${siteName}` : siteName;
};

const generateURL: GenerateURL<Post | Page> = ({ collectionConfig, doc, locale }) => {
  const url = `${getServerSideURL()}/${isLocale(locale) ? locale : defaultLocale}`;

  if (!doc?.slug || (collectionConfig?.slug === "pages" && doc.slug === "home")) return url;

  return collectionConfig?.slug === "posts" ? `${url}/posts/${doc.slug}` : `${url}/${doc.slug}`;
};

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ["pages", "posts"],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ("name" in field && field.name === "from") {
            return {
              ...field,
              admin: {
                description: "Include the locale prefix, e.g. /nb/old-page.",
              },
            };
          }
          return field;
        });
      },
    },
  }),
  nestedDocsPlugin({
    collections: ["categories"],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug as string}`, ""),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ("name" in field && field.name === "confirmationMessage") {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
                  ];
                },
              }),
            };
          }
          return field;
        });
      },
    },
  }),
  searchPlugin({
    collections: ["posts"],
    localize: true,
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields];
      },
    },
  }),
];
