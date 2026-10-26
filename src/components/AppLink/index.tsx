import { useRouter } from "@tanstack/react-router";
import React from "react";

import { isInternalHref } from "#/utilities/localizeHref";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  ref?: React.Ref<HTMLAnchorElement>;
};

// Payload's own routes are served outside the frontend router, so they need a full page load
const isRouterHref = (href: string) => isInternalHref(href) && !/^\/(admin|api)(\/|$)/.test(href);

/**
 * An anchor that navigates client-side for internal hrefs. CMS content provides arbitrary hrefs
 * rather than known route paths, so TanStack's typed `<Link to>` doesn't fit here.
 */
export const AppLink: React.FC<Props> = ({ children, href, onClick, target, ...rest }) => {
  const router = useRouter();

  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event);

        const isModified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
        const opensElsewhere = target && target !== "_self";

        if (event.defaultPrevented || event.button !== 0 || isModified || opensElsewhere) return;
        if (!isRouterHref(href)) return;

        event.preventDefault();
        void router.navigate({ href });
      }}
      target={target}
      {...rest}
    >
      {children}
    </a>
  );
};
