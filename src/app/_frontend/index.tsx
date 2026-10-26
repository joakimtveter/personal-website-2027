import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

import { defaultLocale, isLocale } from "#/i18n/locales";

/** Picks the first supported language from the Accept-Language header */
const getPreferredLocale = createServerFn({ method: "GET" }).handler(() => {
  const preferred = (getRequestHeader("accept-language") ?? "")
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase().split("-")[0])
    // Norwegian browsers often send `no` or `nn` rather than `nb`
    .map((language) => (language === "no" || language === "nn" ? "nb" : language))
    .find(isLocale);

  return preferred ?? defaultLocale;
});

export const Route = createFileRoute("/_frontend/")({
  beforeLoad: async () => {
    throw redirect({ to: "/$locale", params: { locale: await getPreferredLocale() } });
  },
});
