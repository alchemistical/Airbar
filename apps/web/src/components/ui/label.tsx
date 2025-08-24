import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none transition-colors duration-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-gray-700",
        premium: "text-gray-800 font-semibold",
        required:
          "text-gray-700 after:content-['*'] after:text-red-500 after:ml-1",
        optional:
          "text-gray-600 after:content-['(optional)'] after:text-gray-400 after:ml-2 after:text-xs after:font-normal",
        success: "text-green-600",
        error: "text-red-500",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, variant, size, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant, size }), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
