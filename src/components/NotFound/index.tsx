import { FC } from "react";

import { AppLink } from "#/components/AppLink";
import { Button } from "#/components/ui/button";
import { useLocale, useMessages } from "#/i18n/useLocale";

export const NotFound: FC = () => {
  const locale = useLocale();
  const t = useMessages();

  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>{t.notFoundTitle}</h1>
        <p className="mb-4">{t.notFoundText}</p>
      </div>
      <Button render={<AppLink href={`/${locale}`} />} variant="default">
        {t.goHome}
      </Button>
    </div>
  );
};
