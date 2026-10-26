import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { renderSitemapIndex, xmlResponse } = await import("#/server/sitemap.server");
        return xmlResponse(renderSitemapIndex());
      },
    },
  },
});
