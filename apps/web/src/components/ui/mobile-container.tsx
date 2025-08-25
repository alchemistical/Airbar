/**
 * Mobile Container Component - Silicon Valley Grade
 * Ensures consistent mobile layout patterns across the application
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const containerVariants = cva(
  cn(
    // Base responsive container
    "w-full mx-auto",
    // Mobile-first padding
    "px-4 sm:px-6 lg:px-8",
    // Consistent max-widths
    "max-w-7xl"
  ),
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
        full: "max-w-7xl",
        none: "max-w-none"
      },
      padding: {
        none: "p-0",
        sm: "px-2 sm:px-4 lg:px-6",
        md: "px-4 sm:px-6 lg:px-8", 
        lg: "px-6 sm:px-8 lg:px-12",
        xl: "px-8 sm:px-12 lg:px-16"
      },
      spacing: {
        none: "space-y-0",
        sm: "space-y-4",
        md: "space-y-6", 
        lg: "space-y-8",
        xl: "space-y-12"
      }
    },
    defaultVariants: {
      size: "full",
      padding: "md",
      spacing: "md"
    }
  }
);

export interface MobileContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  children: React.ReactNode;
}

const MobileContainer = React.forwardRef<HTMLDivElement, MobileContainerProps>(
  ({ className, size, padding, spacing, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(containerVariants({ size, padding, spacing }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MobileContainer.displayName = "MobileContainer";

/**
 * Mobile-optimized grid component
 */
const mobileGridVariants = cva(
  "grid gap-4",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      },
      gap: {
        none: "gap-0",
        sm: "gap-2 sm:gap-3",
        md: "gap-4 sm:gap-6",
        lg: "gap-6 sm:gap-8",
        xl: "gap-8 sm:gap-12"
      }
    },
    defaultVariants: {
      cols: 3,
      gap: "md"
    }
  }
);

export interface MobileGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mobileGridVariants> {
  children: React.ReactNode;
}

const MobileGrid = React.forwardRef<HTMLDivElement, MobileGridProps>(
  ({ className, cols, gap, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(mobileGridVariants({ cols, gap }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MobileGrid.displayName = "MobileGrid";

/**
 * Mobile-friendly flex component
 */
const mobileFlexVariants = cva(
  "flex",
  {
    variants: {
      direction: {
        row: "flex-row",
        "row-reverse": "flex-row-reverse",
        col: "flex-col",
        "col-reverse": "flex-col-reverse",
        "mobile-col": "flex-col sm:flex-row",
        "mobile-col-reverse": "flex-col-reverse sm:flex-row-reverse"
      },
      align: {
        start: "items-start",
        center: "items-center", 
        end: "items-end",
        stretch: "items-stretch"
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around"
      },
      wrap: {
        nowrap: "flex-nowrap",
        wrap: "flex-wrap",
        "wrap-reverse": "flex-wrap-reverse"
      },
      gap: {
        none: "gap-0",
        sm: "gap-2 sm:gap-3",
        md: "gap-4 sm:gap-6",
        lg: "gap-6 sm:gap-8"
      }
    },
    defaultVariants: {
      direction: "row",
      align: "center",
      justify: "start",
      wrap: "nowrap",
      gap: "md"
    }
  }
);

export interface MobileFlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mobileFlexVariants> {
  children: React.ReactNode;
}

const MobileFlex = React.forwardRef<HTMLDivElement, MobileFlexProps>(
  ({ className, direction, align, justify, wrap, gap, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(mobileFlexVariants({ direction, align, justify, wrap, gap }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MobileFlex.displayName = "MobileFlex";

/**
 * Mobile-responsive section component
 */
export interface MobileSectionProps
  extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  title?: string;
  description?: string;
  centered?: boolean;
  fullHeight?: boolean;
}

const MobileSection = React.forwardRef<HTMLElement, MobileSectionProps>(
  ({ className, title, description, centered, fullHeight, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "w-full",
          "py-8 sm:py-12 lg:py-16",
          fullHeight && "min-h-screen flex flex-col justify-center",
          className
        )}
        {...props}
      >
        <MobileContainer>
          {(title || description) && (
            <div className={cn(
              "mb-8 sm:mb-12",
              centered && "text-center"
            )}>
              {title && (
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          )}
          {children}
        </MobileContainer>
      </section>
    );
  }
);

MobileSection.displayName = "MobileSection";

export { MobileContainer, MobileGrid, MobileFlex, MobileSection, containerVariants, mobileGridVariants, mobileFlexVariants };