import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & {
    variant?: "default" | "premium" | "search";
  }
>(({ className, type, variant = "default", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full px-4 py-3 text-sm font-medium transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        {
          "h-12 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/10 focus-visible:shadow-lg":
            variant === "default",
          "h-14 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-white via-purple-50/50 to-blue-50/50 hover:border-purple-300 focus-visible:border-purple-500 focus-visible:ring-4 focus-visible:ring-purple-500/20 focus-visible:shadow-xl shadow-lg":
            variant === "premium",
          "h-12 rounded-full border-2 border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 focus-visible:bg-white focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/10 pl-6":
            variant === "search",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
