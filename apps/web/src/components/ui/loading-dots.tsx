import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingDotsProps {
  size?: "sm" | "default" | "lg";
  variant?: "default" | "primary" | "accent";
  className?: string;
}

const LoadingDots = ({
  size = "default",
  variant = "default",
  className,
}: LoadingDotsProps) => {
  const sizeClasses = {
    sm: "w-1 h-1",
    default: "w-2 h-2",
    lg: "w-3 h-3",
  };

  const variantClasses = {
    default: "bg-gray-600",
    primary: "bg-blue-600",
    accent: "bg-purple-600",
  };

  const containerAnimation = {
    animate: {
      transition: {
        staggerChildren: 0.2,
        repeat: Infinity,
        repeatDelay: 0.5,
      },
    },
  };

  const dotAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className={cn("flex items-center justify-center space-x-1", className)}
      variants={containerAnimation}
      animate="animate"
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "rounded-full",
            sizeClasses[size],
            variantClasses[variant]
          )}
          variants={dotAnimation}
        />
      ))}
    </motion.div>
  );
};

export { LoadingDots };
