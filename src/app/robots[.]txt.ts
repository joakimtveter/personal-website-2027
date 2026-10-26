import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const { getServerSideURL } = await import("#/utilities/getURL");

        const body = [
          "User-agent: *",
          "Disallow: /admin",
          "",
          `Sitemap: ${getServerSideURL()}/sitemap.xml`,
        ];

        return new Response(body.join("\n") + "\n", {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      },
    },
  },
});
