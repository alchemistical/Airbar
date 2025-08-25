/**
 * Component-specific design system utilities
 * Type-safe component configurations and variants
 */

import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// === CARD COMPONENT SYSTEM ===
export const cardVariants = cva(
  cn(
    "rounded-2xl bg-white shadow-sm border border-neutral-200/50",
    "transition-all duration-200 ease-out",
    "dark:bg-neutral-900 dark:border-neutral-800"
  ),
  {
    variants: {
      variant: {
        default: "",
        interactive: cn(
          "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
          "hover:border-neutral-300/50 dark:hover:border-neutral-700"
        ),
        elevated: "shadow-lg",
        outlined: "border-2 border-neutral-300 dark:border-neutral-600",
        gradient: cn(
          "bg-gradient-to-br from-white to-neutral-50",
          "dark:from-neutral-900 dark:to-neutral-900/50"
        ),
        glass: cn(
          "backdrop-blur-md bg-white/80 border-white/20",
          "dark:bg-neutral-900/80 dark:border-neutral-800/20"
        ),
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6", 
        lg: "p-8",
        xl: "p-10",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      shadow: "sm",
    },
  }
);

// === FORM COMPONENT SYSTEM ===
export const formFieldVariants = cva(
  "space-y-2",
  {
    variants: {
      layout: {
        stacked: "space-y-2",
        horizontal: "grid grid-cols-3 gap-4 items-center space-y-0",
        inline: "flex items-center space-y-0 space-x-4",
      },
    },
    defaultVariants: {
      layout: "stacked",
    },
  }
);

export const labelVariants = cva(
  cn(
    "text-sm font-medium text-neutral-700 dark:text-neutral-300",
    "cursor-pointer transition-colors"
  ),
  {
    variants: {
      variant: {
        default: "",
        required: "after:content-['*'] after:ml-1 after:text-error-500",
        optional: "after:content-['(optional)'] after:ml-1 after:text-neutral-500 after:text-xs",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      disabled: false,
    },
  }
);

// === NAVIGATION COMPONENT SYSTEM ===
export const navItemVariants = cva(
  cn(
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
    "transition-all duration-200 ease-out",
    "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
  ),
  {
    variants: {
      variant: {
        default: cn(
          "text-neutral-700 hover:text-neutral-900",
          "hover:bg-neutral-100 dark:text-neutral-300",
          "dark:hover:text-neutral-100 dark:hover:bg-neutral-800"
        ),
        active: cn(
          "bg-brand-600 text-white shadow-sm",
          "hover:bg-brand-700 dark:bg-brand-500",
          "dark:hover:bg-brand-600"
        ),
        ghost: cn(
          "text-neutral-600 hover:text-neutral-800",
          "hover:bg-neutral-50 dark:text-neutral-400",
          "dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50"
        ),
      },
      size: {
        sm: "px-2 py-1.5 text-xs gap-2",
        md: "px-3 py-2 text-sm gap-3",
        lg: "px-4 py-3 text-base gap-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// === STATUS COMPONENT SYSTEM ===
export const statusVariants = cva(
  cn(
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
    "border transition-colors"
  ),
  {
    variants: {
      variant: {
        success: cn(
          "bg-success-50 text-success-700 border-success-200",
          "dark:bg-success-900/20 dark:text-success-300 dark:border-success-800/30"
        ),
        error: cn(
          "bg-error-50 text-error-700 border-error-200",
          "dark:bg-error-900/20 dark:text-error-300 dark:border-error-800/30"
        ),
        warning: cn(
          "bg-warning-50 text-warning-700 border-warning-200",
          "dark:bg-warning-900/20 dark:text-warning-300 dark:border-warning-800/30"
        ),
        info: cn(
          "bg-info-50 text-info-700 border-info-200",
          "dark:bg-info-900/20 dark:text-info-300 dark:border-info-800/30"
        ),
        neutral: cn(
          "bg-neutral-50 text-neutral-700 border-neutral-200",
          "dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700"
        ),
        brand: cn(
          "bg-brand-50 text-brand-700 border-brand-200",
          "dark:bg-brand-900/20 dark:text-brand-300 dark:border-brand-800/30"
        ),
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs", 
        lg: "px-3 py-1.5 text-sm",
      },
      dot: {
        true: "before:w-1.5 before:h-1.5 before:rounded-full before:bg-current before:mr-1",
        false: "",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md", 
      dot: false,
    },
  }
);

// === METRIC COMPONENT SYSTEM ===
export const metricCardVariants = cva(
  cn(
    "rounded-2xl p-6 transition-all duration-200",
    "border border-neutral-200/50 bg-white",
    "dark:bg-neutral-900 dark:border-neutral-800"
  ),
  {
    variants: {
      variant: {
        default: "",
        highlighted: cn(
          "ring-2 ring-brand-500/20 border-brand-200",
          "dark:ring-brand-400/20 dark:border-brand-800"
        ),
        success: cn(
          "ring-2 ring-success-500/20 border-success-200",
          "dark:ring-success-400/20 dark:border-success-800"
        ),
        warning: cn(
          "ring-2 ring-warning-500/20 border-warning-200",
          "dark:ring-warning-400/20 dark:border-warning-800"
        ),
        error: cn(
          "ring-2 ring-error-500/20 border-error-200",
          "dark:ring-error-400/20 dark:border-error-800"
        ),
      },
      interactive: {
        true: "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
    },
  }
);

// === LOADING STATE SYSTEM ===
export const loadingVariants = cva("", {
  variants: {
    type: {
      spinner: "animate-spin",
      pulse: "animate-pulse",
      bounce: "animate-bounce",
      ping: "animate-ping",
      wave: "animate-wave",
    },
    size: {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
    },
  },
  defaultVariants: {
    type: "spinner",
    size: "md",
  },
});

// === MOTION PRESETS ===
export const motionPresets = {
  // Entrance animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: "easeOut" },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: "easeOut" },
  },
  
  // Interaction animations
  hover: {
    scale: 1.02,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 30 
    },
  },
  
  tap: {
    scale: 0.96,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 30 
    },
  },
  
  // List animations
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  
  staggerItem: {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  },
} as const;

// === RESPONSIVE BREAKPOINTS ===
export const responsiveUtils = {
  // Container queries
  container: {
    xs: "max-w-sm",
    sm: "max-w-md", 
    md: "max-w-lg",
    lg: "max-w-xl",
    xl: "max-w-2xl",
    "2xl": "max-w-4xl",
    "3xl": "max-w-6xl",
    "4xl": "max-w-7xl",
    full: "max-w-full",
  },
  
  // Grid patterns
  grid: {
    auto: "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
    responsive: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    dashboard: "grid-cols-1 lg:grid-cols-3 xl:grid-cols-4",
    cards: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    metrics: "grid-cols-2 lg:grid-cols-4",
  },
  
  // Spacing patterns
  spacing: {
    section: "space-y-8 lg:space-y-12",
    stack: "space-y-4 lg:space-y-6",
    list: "space-y-2 lg:space-y-3",
    inline: "space-x-2 lg:space-x-4",
  },
} as const;

// === THEME UTILITIES ===
export const themeUtils = {
  // Color scheme detection
  prefersDark: "(prefers-color-scheme: dark)",
  prefersLight: "(prefers-color-scheme: light)",
  
  // Reduced motion
  prefersReducedMotion: "(prefers-reduced-motion: reduce)",
  
  // High contrast
  prefersHighContrast: "(prefers-contrast: high)",
  
  // Touch device detection
  hasHover: "(hover: hover)",
  hasTouch: "(pointer: coarse)",
} as const;

// Type exports for TypeScript
export type CardVariant = Parameters<typeof cardVariants>[0];
export type StatusVariant = Parameters<typeof statusVariants>[0];
export type NavItemVariant = Parameters<typeof navItemVariants>[0];
export type MetricCardVariant = Parameters<typeof metricCardVariants>[0];