import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts-sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { renderCollectionSitemap, xmlResponse } = await import("#/server/sitemap.server");
        return xmlResponse(await renderCollectionSitemap("posts"));
      },
    },
  },
});
