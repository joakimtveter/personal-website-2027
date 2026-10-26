import type { SelectField } from "@payloadcms/plugin-form-builder/types";
import { FC } from "react";

import { Label } from "#/components/ui/label";
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";

import { Error } from "../Error";
import { useFieldContext } from "../form";
import { Width } from "../Width";

export const Select: FC<SelectField> = ({ name, label, options, required, width }) => {
  const field = useFieldContext<string>();
  const controlledValue = options.find((t) => t.value === field.state.value);

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
      <SelectComponent
        items={options}
        name={name}
        onValueChange={(val) => field.handleChange(val ?? "")}
        value={controlledValue?.value ?? null}
      >
        <SelectTrigger
          aria-invalid={!field.state.meta.isValid}
          className="w-full"
          id={name}
          onBlur={field.handleBlur}
        >
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ label, value }) => {
            return (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </SelectComponent>
      <Error />
    </Width>
  );
};
