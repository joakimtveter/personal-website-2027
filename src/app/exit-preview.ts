import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/exit-preview")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { draftCookie } = await import("#/server/payload.server");

        return new Response("Draft mode is disabled", {
          headers: {
            "Cache-Control": "no-store",
            "Set-Cookie": draftCookie.serialize(false, request),
          },
        });
      },
    },
  },
});
