import { FC, useSyncExternalStore } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { useMessages } from "#/i18n/useLocale";

import { useTheme } from "..";
import { themeIsValid } from "../types";
import { themeLocalStorageKey } from "./types";

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getPreference = () => window.localStorage.getItem(themeLocalStorageKey) ?? "auto";

// No value on the server, so the stored preference only shows up after hydration
const getServerPreference = () => null;

export const ThemeSelector: FC = () => {
  const { setTheme } = useTheme();
  const value = useSyncExternalStore(subscribe, getPreference, getServerPreference);
  const t = useMessages();

  const onThemeChange = (themeToSet: string | null) => {
    if (themeToSet === "auto") {
      setTheme(null);
    } else if (themeIsValid(themeToSet)) {
      setTheme(themeToSet);
    } else {
      return;
    }
    listeners.forEach((listener) => listener());
  };

  return (
    <Select
      items={{ auto: t.themeAuto, dark: t.themeDark, light: t.themeLight }}
      onValueChange={onThemeChange}
      value={value}
    >
      <SelectTrigger
        aria-label={t.theme}
        className="w-auto gap-2 border-none bg-transparent pl-0 md:pl-3"
      >
        <SelectValue placeholder={t.theme} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">{t.themeAuto}</SelectItem>
        <SelectItem value="light">{t.themeLight}</SelectItem>
        <SelectItem value="dark">{t.themeDark}</SelectItem>
      </SelectContent>
    </Select>
  );
};
