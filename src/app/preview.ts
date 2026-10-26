import { createFileRoute } from "@tanstack/react-router";

import type { PreviewSearchParams } from "#/utilities/generatePreviewPath";

const forbidden = () => new Response("You are not allowed to preview this page", { status: 403 });

/**
 * Entry point for the admin panel's preview button and live preview iframe. Verifies the preview
 * secret and the admin session, then sets the draft cookie and redirects to the page.
 */
export const Route = createFileRoute("/preview")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { draftCookie, getPayloadClient } = await import("#/server/payload.server");
        const searchParams = new URL(request.url).searchParams;
        const path = searchParams.get("path" satisfies keyof PreviewSearchParams);
        const previewSecret = searchParams.get("previewSecret" satisfies keyof PreviewSearchParams);

        if (!process.env.PREVIEW_SECRET || previewSecret !== process.env.PREVIEW_SECRET) {
          return forbidden();
        }

        if (!path) {
          return new Response("Insufficient search params", { status: 404 });
        }

        if (!path.startsWith("/") || path.startsWith("//")) {
          return new Response("This endpoint can only be used for relative previews", {
            status: 500,
          });
        }

        const payload = await getPayloadClient();

        try {
          const { user } = await payload.auth({ headers: request.headers });
          if (!user) return forbidden();
        } catch (err) {
          payload.logger.error({ err, msg: "Error verifying token for live preview" });
          return forbidden();
        }

        return new Response(null, {
          headers: {
            "Cache-Control": "no-store",
            Location: path,
            "Set-Cookie": draftCookie.serialize(true, request),
          },
          status: 307,
        });
      },
    },
  },
});
