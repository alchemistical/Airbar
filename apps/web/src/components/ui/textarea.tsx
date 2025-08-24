import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "premium" | "minimal";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex w-full px-4 py-3 text-sm font-medium transition-all duration-200 resize-y placeholder:text-gray-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          {
            "min-h-[120px] rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/10 focus-visible:shadow-lg":
              variant === "default",
            "min-h-[140px] rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-white via-purple-50/50 to-blue-50/50 hover:border-purple-300 focus-visible:border-purple-500 focus-visible:ring-4 focus-visible:ring-purple-500/20 focus-visible:shadow-xl shadow-lg":
              variant === "premium",
            "min-h-[100px] rounded-lg border border-gray-300 bg-transparent hover:bg-gray-50/50 focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400/20":
              variant === "minimal",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
