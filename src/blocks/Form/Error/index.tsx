import * as React from "react";
import { useFormContext } from "react-hook-form";

import { useMessages } from "#/i18n/useLocale";

export const Error = ({ name }: { name: string }) => {
  const {
    formState: { errors },
  } = useFormContext();
  const t = useMessages();
  return (
    <div className="mt-2 text-sm text-red-500">
      {(errors[name]?.message as string) || t.fieldRequired}
    </div>
  );
};
