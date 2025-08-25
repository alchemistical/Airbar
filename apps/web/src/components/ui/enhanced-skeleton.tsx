/**
 * Enhanced Skeleton Loading System - Silicon Valley Grade
 * Advanced loading states with smart animations and accessibility
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { designTokens } from "@/design-system/tokens";

const skeletonVariants = cva(
  cn(
    "animate-pulse rounded-md bg-neutral-200",
    "dark:bg-neutral-800",
    // Accessibility - screen readers should know this is loading content
    "sr-only:not-sr-only",
    // Reduce motion for accessibility
    "motion-reduce:animate-none motion-reduce:bg-neutral-300"
  ),
  {
    variants: {
      variant: {
        default: "bg-neutral-200 dark:bg-neutral-800",
        shimmer: cn(
          "relative overflow-hidden bg-neutral-200 dark:bg-neutral-800",
          "before:absolute before:inset-0",
          "before:-translate-x-full before:animate-[shimmer_2s_infinite]",
          "before:bg-gradient-to-r",
          "before:from-transparent before:via-neutral-100/60 before:to-transparent",
          "dark:before:via-neutral-700/60"
        ),
        wave: "animate-[wave_1.5s_ease-in-out_infinite]",
        pulse: "animate-pulse",
      },
      size: {
        xs: "h-3",
        sm: "h-4", 
        md: "h-5",
        lg: "h-6",
        xl: "h-8",
        "2xl": "h-10",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md", 
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "shimmer",
      size: "md",
      rounded: "md",
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  lines?: number;
  spacing?: "sm" | "md" | "lg";
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded,
    width,
    height,
    circle,
    lines,
    spacing = "md",
    ...props 
  }, ref) => {
    
    const spacingClasses = {
      sm: "space-y-2",
      md: "space-y-3",
      lg: "space-y-4",
    };
    
    // Single skeleton
    if (!lines || lines === 1) {
      return (
        <div
          ref={ref}
          className={cn(
            skeletonVariants({ 
              variant, 
              size, 
              rounded: circle ? "full" : rounded 
            }),
            className
          )}
          style={{
            width: width || (circle ? height : undefined),
            height: height,
            ...(circle && { aspectRatio: "1 / 1" }),
          }}
          aria-label="Loading content"
          role="status"
          {...props}
        />
      );
    }
    
    // Multiple skeleton lines
    return (
      <div 
        ref={ref}
        className={cn("w-full", spacingClasses[spacing])}
        role="status" 
        aria-label="Loading content"
        {...props}
      >
        {Array.from({ length: lines }, (_, index) => {
          // Make last line shorter for more realistic appearance
          const isLastLine = index === lines - 1;
          const lineWidth = isLastLine && !width ? "75%" : width;
          
          return (
            <div
              key={index}
              className={cn(
                skeletonVariants({ variant, size, rounded }),
                className
              )}
              style={{
                width: lineWidth,
                height: height,
              }}
            />
          );
        })}
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

// Pre-built skeleton components for common use cases
export const SkeletonCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    showImage?: boolean;
    showActions?: boolean;
  }
>(({ className, showImage = true, showActions = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-neutral-200 p-6 shadow-sm",
      "dark:border-neutral-800",
      className
    )}
    {...props}
  >
    {showImage && (
      <Skeleton 
        variant="shimmer" 
        height="12rem" 
        rounded="lg" 
        className="mb-4"
      />
    )}
    <div className="space-y-3">
      <Skeleton variant="shimmer" height="1.5rem" width="80%" />
      <Skeleton variant="shimmer" lines={2} spacing="sm" />
      {showActions && (
        <div className="flex gap-3 pt-2">
          <Skeleton variant="shimmer" height="2.5rem" width="6rem" rounded="lg" />
          <Skeleton variant="shimmer" height="2.5rem" width="4rem" rounded="lg" />
        </div>
      )}
    </div>
  </div>
));

export const SkeletonAvatar = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & {
    showName?: boolean;
    showSubtext?: boolean;
  }
>(({ showName = true, showSubtext = false, size = "md", ...props }, ref) => {
  const avatarSizes = {
    xs: "h-6 w-6",
    sm: "h-8 w-8", 
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
    "2xl": "h-20 w-20",
  };
  
  return (
    <div ref={ref} className="flex items-center gap-3" {...props}>
      <Skeleton
        circle
        className={avatarSizes[size || "md"]}
        variant="shimmer"
      />
      {(showName || showSubtext) && (
        <div className="space-y-1">
          {showName && (
            <Skeleton 
              variant="shimmer" 
              height="1rem" 
              width="6rem" 
            />
          )}
          {showSubtext && (
            <Skeleton 
              variant="shimmer" 
              height="0.875rem" 
              width="8rem" 
            />
          )}
        </div>
      )}
    </div>
  );
});

export const SkeletonTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    rows?: number;
    columns?: number;
    showHeader?: boolean;
  }
>(({ 
  className, 
  rows = 5, 
  columns = 4, 
  showHeader = true,
  ...props 
}, ref) => (
  <div 
    ref={ref}
    className={cn("w-full space-y-3", className)}
    role="status"
    aria-label="Loading table data"
    {...props}
  >
    {/* Table Header */}
    {showHeader && (
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton 
            key={`header-${index}`}
            variant="shimmer" 
            height="1.25rem" 
            width="70%"
          />
        ))}
      </div>
    )}
    
    {/* Table Rows */}
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div 
          key={`row-${rowIndex}`}
          className="grid gap-4" 
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton 
              key={`cell-${rowIndex}-${colIndex}`}
              variant="shimmer" 
              height="1rem"
              width={colIndex === 0 ? "90%" : "60%"}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
));

export const SkeletonList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    items?: number;
    showAvatar?: boolean;
    showActions?: boolean;
  }
>(({ 
  className, 
  items = 5, 
  showAvatar = true, 
  showActions = false,
  ...props 
}, ref) => (
  <div 
    ref={ref}
    className={cn("space-y-4", className)}
    role="status"
    aria-label="Loading list items"
    {...props}
  >
    {Array.from({ length: items }, (_, index) => (
      <div key={index} className="flex items-center gap-4">
        {showAvatar && (
          <Skeleton circle className="h-10 w-10" variant="shimmer" />
        )}
        <div className="flex-1 space-y-2">
          <Skeleton variant="shimmer" height="1rem" width="70%" />
          <Skeleton variant="shimmer" height="0.875rem" width="50%" />
        </div>
        {showActions && (
          <div className="flex gap-2">
            <Skeleton 
              variant="shimmer" 
              height="2rem" 
              width="4rem" 
              rounded="lg"
            />
          </div>
        )}
      </div>
    ))}
  </div>
));

// Animated skeleton wrapper for staggered loading
export const SkeletonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    stagger?: number;
    children: React.ReactNode;
  }
>(({ children, stagger = 0.1, className, onDrag, onDragEnd, onDragStart, onDragEnter, onDragExit, onDragLeave, onDragOver, onDrop, onAnimationStart, onAnimationEnd, onAnimationIteration, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={className}
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: stagger,
        },
      },
    }}
    {...props}
  >
    {React.Children.map(children, (child, index) => (
      <motion.div
        key={index}
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: designTokens.animation.spring.light
          },
        }}
      >
        {child}
      </motion.div>
    ))}
  </motion.div>
));

// Enhanced skeleton with data-loading state management
export const SkeletonWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    loading: boolean;
    children: React.ReactNode;
    skeleton: React.ReactNode;
    delay?: number;
  }
>(({ loading, children, skeleton, delay = 200, className, ...props }, ref) => {
  const [showSkeleton, setShowSkeleton] = React.useState(false);
  
  React.useEffect(() => {
    let timer: number;
    
    if (loading) {
      timer = setTimeout(() => setShowSkeleton(true), delay);
    } else {
      setShowSkeleton(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, delay]);
  
  return (
    <div ref={ref} className={className} {...props}>
      {loading && showSkeleton ? skeleton : children}
    </div>
  );
});

// Add custom animations to CSS (would go in global styles)
export const skeletonAnimations = `
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
  
  @keyframes wave {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.8;
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    .animate-pulse,
    .animate-[shimmer_2s_infinite],
    .animate-[wave_1.5s_ease-in-out_infinite] {
      animation: none;
    }
  }
`;

SkeletonCard.displayName = "SkeletonCard";
SkeletonAvatar.displayName = "SkeletonAvatar";
SkeletonTable.displayName = "SkeletonTable";
SkeletonList.displayName = "SkeletonList";
SkeletonGroup.displayName = "SkeletonGroup";
SkeletonWrapper.displayName = "SkeletonWrapper";

export { 
  Skeleton, 
  skeletonVariants
};