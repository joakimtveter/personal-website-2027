import { describe, expect, it } from "vitest";

import { toLocale } from "#/i18n/locales";
import { generatePreviewPath } from "#/utilities/generatePreviewPath";
import { getDocHref, getLocaleFromPath, localizeHref } from "#/utilities/localizeHref";

describe("localizeHref", () => {
  it("prefixes internal paths with the locale", () => {
    expect(localizeHref("/posts", "en")).toBe("/en/posts");
    expect(localizeHref("/", "nb")).toBe("/nb");
  });

  it("leaves localized, external and Payload paths alone", () => {
    expect(localizeHref("/nb/posts", "en")).toBe("/nb/posts");
    expect(localizeHref("https://example.com", "en")).toBe("https://example.com");
    expect(localizeHref("//example.com/x", "en")).toBe("//example.com/x");
    expect(localizeHref("/admin", "en")).toBe("/admin");
    expect(localizeHref("/api/media/file/a.webp", "en")).toBe("/api/media/file/a.webp");
  });
});

describe("getDocHref", () => {
  it("builds locale-prefixed document paths", () => {
    expect(getDocHref({ relationTo: "pages", slug: "home" }, "nb")).toBe("/nb");
    expect(getDocHref({ relationTo: "pages", slug: "about" }, "en")).toBe("/en/about");
    expect(getDocHref({ relationTo: "posts", slug: "hello" }, "nb")).toBe("/nb/posts/hello");
  });
});

describe("locale helpers", () => {
  it("reads the locale from a path, falling back to the default", () => {
    expect(getLocaleFromPath("/en/old-page")).toBe("en");
    expect(getLocaleFromPath("/old-page")).toBe("nb");
    expect(toLocale("xx")).toBe("nb");
  });
});

describe("generatePreviewPath", () => {
  it("points at the preview route with a locale-prefixed path", () => {
    const url = new URL(
      generatePreviewPath({ collection: "posts", locale: "en", slug: "a b" })!,
      "http://localhost",
    );

    expect(url.pathname).toBe("/preview");
    expect(url.searchParams.get("path")).toBe("/en/posts/a%20b");
  });

  it("previews the home page at the locale root", () => {
    const url = new URL(
      generatePreviewPath({ collection: "pages", locale: "nb", slug: "home" })!,
      "http://localhost",
    );

    expect(url.searchParams.get("path")).toBe("/nb");
  });
});
