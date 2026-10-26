import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { Check } from "lucide-react";
import { FC } from "react";

import { cn } from "#/utilities/ui";

const Checkbox: FC<CheckboxPrimitive.Root.Props> = ({ className, ...props }) => (
  <CheckboxPrimitive.Root
    data-slot="checkbox"
    className={cn(
      "peer border-input data-[checked]:bg-primary data-[checked]:text-primary-foreground data-[checked]:border-primary ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 flex size-4 shrink-0 items-center justify-center rounded-[4px] border shadow-xs transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-invalid:focus-visible:ring-0",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      className="flex items-center justify-center text-current"
    >
      <Check className="size-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);

export { Checkbox };
