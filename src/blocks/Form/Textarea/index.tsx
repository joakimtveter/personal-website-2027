import type { TextField } from "@payloadcms/plugin-form-builder/types";
import { FC } from "react";

import { Label } from "#/components/ui/label";
import { Textarea as TextAreaComponent } from "#/components/ui/textarea";

import { Error } from "../Error";
import { useFieldContext } from "../form";
import { Width } from "../Width";

export const Textarea: FC<TextField & { rows?: number }> = ({
  name,
  label,
  required,
  rows = 3,
  width,
}) => {
  const field = useFieldContext<string>();

  return (
    <Width width={width}>
      <Label htmlFor={name}>
        {label}

        {required && (
          <span className="required">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>

      <TextAreaComponent
        aria-invalid={!field.state.meta.isValid}
        id={name}
        name={name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        rows={rows}
        value={field.state.value}
      />

      <Error />
    </Width>
  );
};
