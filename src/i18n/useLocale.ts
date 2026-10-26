import { useParams } from "@tanstack/react-router";

import { defaultLocale, isLocale, type AppLocale } from "./locales";
import { messages } from "./messages";

/** The locale of the current `/$locale/...` route, or the default locale outside of it */
export const useLocale = (): AppLocale => {
  const { locale } = useParams({ strict: false });
  return isLocale(locale) ? locale : defaultLocale;
};

export const useMessages = () => messages[useLocale()];
