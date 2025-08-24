import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "default" | "lg";
  variant?: "default" | "primary" | "accent";
  className?: string;
}

const LoadingSpinner = ({
  size = "default",
  variant = "default",
  className,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const variantClasses = {
    default: "border-gray-300 border-t-gray-900",
    primary: "border-blue-200 border-t-blue-600",
    accent: "border-purple-200 border-t-purple-600",
  };

  return (
    <motion.div
      className={cn(
        "inline-block rounded-full border-2 border-solid animate-spin",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

export { LoadingSpinner };
