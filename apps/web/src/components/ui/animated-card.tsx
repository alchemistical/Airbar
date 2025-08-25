import * as React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "interactive" | "premium";
  hover?: boolean;
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  (
    { children, variant = "default", hover = true, className, ...props },
    ref
  ) => {
    const hoverAnimation = hover
      ? {
          whileHover: {
            y: -4,
            transition: { type: "spring", stiffness: 300, damping: 20 },
          },
        }
      : {};

    // Filter out HTML event handlers that conflict with framer-motion
    const { 
      onDrag, 
      onDragStart, 
      onDragEnd, 
      onAnimationStart,
      onAnimationEnd,
      onAnimationIteration,
      ...motionProps 
    } = props;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        {...hoverAnimation}
        className={cn("w-full", className)}
        {...motionProps}
      >
        <Card variant={variant}>{children}</Card>
      </motion.div>
    );
  }
);
AnimatedCard.displayName = "AnimatedCard";

// Export all card components for convenience
export {
  AnimatedCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
