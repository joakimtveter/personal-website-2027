import type { CheckboxField } from "@payloadcms/plugin-form-builder/types";
import { FC } from "react";

import { Checkbox as CheckboxUi } from "#/components/ui/checkbox";
import { Label } from "#/components/ui/label";

import { Error } from "../Error";
import { useFieldContext } from "../form";
import { Width } from "../Width";

export const Checkbox: FC<CheckboxField> = ({ name, label, required, width }) => {
  const field = useFieldContext<boolean>();

  return (
    <Width width={width}>
      <div className="flex items-center gap-2">
        <CheckboxUi
          aria-invalid={!field.state.meta.isValid}
          checked={field.state.value}
          id={name}
          name={name}
          onCheckedChange={(checked) => field.handleChange(checked)}
        />
        <Label htmlFor={name}>
          {required && (
            <span className="required">
              * <span className="sr-only">(required)</span>
            </span>
          )}
          {label}
        </Label>
      </div>
      <Error />
    </Width>
  );
};
