import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "#/utilities/ui";

// select-none stops double-clicking the label from selecting its text
const labelVariants = cva(
  "text-sm font-medium leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 peer-data-[disabled]:cursor-not-allowed peer-data-[disabled]:opacity-70",
);

// Base UI has no standalone label primitive, so this is a plain <label>
const Label: React.FC<React.ComponentProps<"label"> & VariantProps<typeof labelVariants>> = ({
  children,
  className,
  htmlFor,
  ...props
}) => (
  <label data-slot="label" className={cn(labelVariants(), className)} htmlFor={htmlFor} {...props}>
    {children}
  </label>
);

export { Label };
