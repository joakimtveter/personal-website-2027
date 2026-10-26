import type { AppLocale } from "#/i18n/locales";

// A fixed time zone keeps server-rendered and hydrated dates identical
export const formatDateTime = (timestamp: string, locale: AppLocale): string => {
  const date = timestamp ? new Date(timestamp) : new Date();

  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "Europe/Oslo" }).format(
    date,
  );
};
