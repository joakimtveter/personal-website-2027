import type { EmailField } from "@payloadcms/plugin-form-builder/types";
import { FC } from "react";

import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";

import { Error } from "../Error";
import { useFieldContext } from "../form";
import { Width } from "../Width";

export const Email: FC<EmailField> = ({ name, label, required, width }) => {
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
      <Input
        aria-invalid={!field.state.meta.isValid}
        id={name}
        name={name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        type="text"
        value={field.state.value}
      />
      <Error />
    </Width>
  );
};
