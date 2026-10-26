import { useNavigate } from "@tanstack/react-router";
import { FC, useEffect, useRef, useState } from "react";

import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { useLocale, useMessages } from "#/i18n/useLocale";
import { useDebounce } from "#/utilities/useDebounce";

export const Search: FC<{ initialValue?: string }> = ({ initialValue = "" }) => {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();
  const locale = useLocale();
  const t = useMessages();
  const isFirstRender = useRef(true);

  const debouncedValue = useDebounce(value);

  useEffect(() => {
    // The initial value already matches the URL, so only navigate on user input
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    void navigate({
      to: "/$locale/search",
      params: { locale },
      search: debouncedValue ? { q: debouncedValue } : {},
      replace: true,
    });
  }, [debouncedValue, locale, navigate]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Label htmlFor="search" className="sr-only">
          {t.search}
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value);
          }}
          placeholder={t.search}
          value={value}
        />
        <button type="submit" className="sr-only">
          {t.submit}
        </button>
      </form>
    </div>
  );
};
