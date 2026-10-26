export const locales = ["nb", "en"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "nb";

export const localeLabels: Record<AppLocale, string> = {
  nb: "Norsk bokmål",
  en: "English",
};

export const isLocale = (value: unknown): value is AppLocale =>
  typeof value === "string" && (locales as readonly string[]).includes(value);

/** Narrows a `$locale` route param, which the locale layout route has already validated */
export const toLocale = (value: string): AppLocale => (isLocale(value) ? value : defaultLocale);
