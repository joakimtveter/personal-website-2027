import { getServerSideURL } from "./getURL";
import { siteName } from "./siteName";

export type OpenGraph = {
  description?: string;
  image?: string;
  title?: string;
  type?: "article" | "website";
  url?: string;
};

const defaultOpenGraph: Required<Omit<OpenGraph, "url">> = {
  description: "",
  image: `${getServerSideURL()}/og-default.webp`,
  title: siteName,
  type: "website",
};

export const mergeOpenGraph = (og?: OpenGraph): OpenGraph => {
  return {
    ...defaultOpenGraph,
    ...og,
    image: og?.image || defaultOpenGraph.image,
  };
};
