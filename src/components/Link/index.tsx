import React from "react";

import { AppLink } from "#/components/AppLink";
import { Button, type ButtonProps } from "#/components/ui/button";
import { useLocale } from "#/i18n/useLocale";
import type { Page, Post } from "#/payload-types";
import { getDocHref, localizeHref } from "#/utilities/localizeHref";
import { cn } from "#/utilities/ui";

type CMSLinkType = {
  appearance?: "inline" | ButtonProps["variant"];
  children?: React.ReactNode;
  className?: string;
  label?: string | null;
  newTab?: boolean | null;
  reference?: {
    relationTo: "pages" | "posts";
    value: Page | Post | string | number;
  } | null;
  size?: ButtonProps["size"] | null;
  type?: "custom" | "reference" | null;
  url?: string | null;
};

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = "inline",
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props;
  const locale = useLocale();

  const href =
    type === "reference" && typeof reference?.value === "object" && reference.value.slug
      ? getDocHref({ relationTo: reference.relationTo, slug: reference.value.slug }, locale)
      : url && localizeHref(url, locale);

  if (!href) return null;

  const size = appearance === "link" ? "clear" : sizeFromProps;
  const newTabProps = newTab ? { rel: "noopener noreferrer", target: "_blank" } : {};

  /* Ensure we don't break any styles set by richText */
  if (appearance === "inline") {
    return (
      <AppLink className={cn(className)} href={href} {...newTabProps}>
        {label}
        {children}
      </AppLink>
    );
  }

  return (
    <Button
      className={className}
      render={<AppLink href={href} {...newTabProps} />}
      size={size}
      variant={appearance}
    >
      {label}
      {children}
    </Button>
  );
};
