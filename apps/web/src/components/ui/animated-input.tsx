import * as React from "react";
import { motion } from "framer-motion";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface AnimatedInputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  variant?: "default" | "premium" | "search";
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ label, error, variant = "default", className, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative space-y-2"
      >
        {label && (
          <motion.div
            animate={{
              scale: isFocused || hasValue ? 1 : 1,
              color: error ? "#ef4444" : isFocused ? "#3b82f6" : "#6b7280",
            }}
            transition={{ duration: 0.2 }}
          >
            <Label
              htmlFor={inputId}
              className={cn(
                "text-sm font-medium transition-colors duration-200",
                error && "text-red-500",
                isFocused && !error && "text-blue-600"
              )}
            >
              {label}
            </Label>
          </motion.div>
        )}

        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Input
            ref={ref}
            id={inputId}
            variant={variant}
            className={cn(
              error &&
                "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20",
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-red-500 flex items-center gap-1"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);
AnimatedInput.displayName = "AnimatedInput";

export { AnimatedInput };
