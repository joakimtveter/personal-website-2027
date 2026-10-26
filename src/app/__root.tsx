import { withPayloadRoot } from "@payloadcms/tanstack-start/client";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { ReactNode } from "react";

import { useLocale } from "#/i18n/useLocale";

export const Route = createRootRoute({
  shellComponent: withPayloadRoot(FrontendRoot),
});

function FrontendRoot({ children }: { children: ReactNode }) {
  const locale = useLocale();

  // The <title> is rendered by <HeadContent /> from each route's head()
  // noinspection HtmlRequiredTitleElement
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
