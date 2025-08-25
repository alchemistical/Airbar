import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type MotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { designTokens } from "@/design-system/tokens";

const buttonVariants = cva(
  cn(
    // Base styles
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-semibold leading-none",
    "ring-offset-background transition-all duration-200",
    
    // Focus styles - WCAG compliant
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
    "focus-visible:ring-offset-2 focus:ring-offset-background",
    
    // Accessibility
    "disabled:pointer-events-none disabled:opacity-50",
    "disabled:cursor-not-allowed",
    "[&[aria-pressed=true]]:bg-opacity-90",
    
    // Icon styling
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "[&_svg]:transition-transform [&_svg]:duration-200",
    
    // Motion and interaction
    "transform-gpu will-change-transform",
    "active:scale-[0.96] hover:shadow-lg",
    "transition-all duration-200 ease-out",
    
    // High contrast mode support
    "contrast-more:border-2 contrast-more:border-current",
    
    // Reduced motion support
    "motion-reduce:transition-none motion-reduce:transform-none"
  ),
  {
    variants: {
      variant: {
        // Primary - brand colors with enhanced accessibility
        primary: cn(
          "bg-gradient-to-r from-brand-600 to-brand-700 text-white",
          "shadow-lg shadow-brand-600/25",
          "hover:from-brand-700 hover:to-brand-800",
          "hover:shadow-xl hover:shadow-brand-600/30",
          "focus-visible:ring-brand-500",
          "active:from-brand-800 active:to-brand-900",
          "dark:from-brand-500 dark:to-brand-600",
          "contrast-more:bg-brand-700 contrast-more:border-brand-800"
        ),
        
        // Secondary - neutral with subtle gradients
        secondary: cn(
          "bg-gradient-to-r from-neutral-100 to-neutral-200",
          "text-neutral-800 shadow-sm border border-neutral-300/50",
          "hover:from-neutral-200 hover:to-neutral-300",
          "hover:border-neutral-400/50 hover:shadow-md",
          "focus-visible:ring-neutral-500",
          "active:from-neutral-300 active:to-neutral-400",
          "dark:from-neutral-700 dark:to-neutral-800 dark:text-neutral-100",
          "dark:border-neutral-600 dark:hover:from-neutral-600"
        ),
        
        // Success - green semantic color
        success: cn(
          "bg-gradient-to-r from-success-600 to-success-700 text-white",
          "shadow-lg shadow-success-600/25",
          "hover:from-success-700 hover:to-success-800",
          "hover:shadow-xl hover:shadow-success-600/30",
          "focus-visible:ring-success-500",
          "active:from-success-800 active:to-success-900"
        ),
        
        // Error/Destructive - red semantic color
        destructive: cn(
          "bg-gradient-to-r from-error-600 to-error-700 text-white",
          "shadow-lg shadow-error-600/25",
          "hover:from-error-700 hover:to-error-800",
          "hover:shadow-xl hover:shadow-error-600/30",
          "focus-visible:ring-error-500",
          "active:from-error-800 active:to-error-900"
        ),
        
        // Warning - amber semantic color
        warning: cn(
          "bg-gradient-to-r from-warning-600 to-warning-700 text-white",
          "shadow-lg shadow-warning-600/25",
          "hover:from-warning-700 hover:to-warning-800",
          "hover:shadow-xl hover:shadow-warning-600/30",
          "focus-visible:ring-warning-500",
          "active:from-warning-800 active:to-warning-900"
        ),
        
        // Outline - high contrast borders
        outline: cn(
          "border-2 border-neutral-300 bg-white text-neutral-700",
          "shadow-sm hover:bg-neutral-50",
          "hover:border-neutral-400 hover:shadow-md",
          "focus-visible:ring-neutral-500",
          "active:bg-neutral-100",
          "dark:bg-neutral-900 dark:border-neutral-600",
          "dark:text-neutral-100 dark:hover:bg-neutral-800",
          "contrast-more:border-black contrast-more:text-black"
        ),
        
        // Ghost - subtle hover states
        ghost: cn(
          "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
          "focus-visible:ring-neutral-500",
          "active:bg-neutral-200",
          "dark:text-neutral-300 dark:hover:bg-neutral-800",
          "dark:hover:text-neutral-100"
        ),
        
        // Link - text-only with underlines
        link: cn(
          "text-brand-600 underline-offset-4",
          "hover:underline hover:text-brand-700",
          "focus-visible:ring-brand-500 focus-visible:rounded-sm",
          "active:text-brand-800",
          "dark:text-brand-400 dark:hover:text-brand-300"
        ),
        
        // Premium - special gradient for premium features
        premium: cn(
          "bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700",
          "text-white shadow-xl shadow-purple-600/30",
          "hover:from-purple-700 hover:via-purple-800 hover:to-indigo-800",
          "hover:shadow-2xl hover:shadow-purple-600/40",
          "focus-visible:ring-purple-500",
          "active:from-purple-800 active:to-indigo-900",
          "before:absolute before:inset-0 before:rounded-lg",
          "before:bg-gradient-to-r before:from-white/10 before:to-transparent",
          "before:opacity-0 before:transition-opacity before:duration-200",
          "hover:before:opacity-100 relative overflow-hidden"
        ),
        
        // Default - alias for primary (backward compatibility)
        default: cn(
          "bg-gradient-to-r from-brand-600 to-brand-700 text-white",
          "shadow-lg shadow-brand-600/25",
          "hover:from-brand-700 hover:to-brand-800",
          "hover:shadow-xl hover:shadow-brand-600/30",
          "focus-visible:ring-brand-500",
          "active:from-brand-800 active:to-brand-900",
          "dark:from-brand-500 dark:to-brand-600",
          "contrast-more:bg-brand-700 contrast-more:border-brand-800"
        ),
      },
      size: {
        xs: "h-8 px-3 text-xs rounded-md min-w-[2rem]",
        sm: "h-9 px-4 text-xs rounded-md min-w-[2.25rem]", 
        md: "h-10 px-6 py-2.5 text-sm rounded-lg min-w-[2.5rem]",
        lg: "h-12 px-8 text-base rounded-xl min-w-[3rem]",
        xl: "h-14 px-10 text-lg font-semibold rounded-xl min-w-[3.5rem]",
        "2xl": "h-16 px-12 text-xl font-bold rounded-2xl min-w-[4rem]",
        
        // Icon variants with proper touch targets (44px minimum)
        "icon-xs": "h-8 w-8 rounded-md",
        "icon-sm": "h-9 w-9 rounded-md",
        "icon-md": "h-10 w-10 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-xl",
        "icon-xl": "h-14 w-14 rounded-xl",
        
        // Default - alias for md (backward compatibility)
        default: "h-10 px-6 py-2.5 text-sm rounded-lg min-w-[2.5rem]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  
  // Loading state
  loading?: boolean;
  loadingText?: string;
  
  // Icon props
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Accessibility props
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  
  // Animation props
  whileHover?: MotionProps['whileHover'];
  whileTap?: MotionProps['whileTap'];
  animate?: MotionProps['animate'];
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    children,
    disabled,
    whileHover,
    whileTap,
    animate,
    // Exclude HTML drag and animation handlers that conflict with Framer Motion
    onDrag,
    onDragEnd,
    onDragStart,
    onDragEnter,
    onDragExit,
    onDragLeave,
    onDragOver,
    onDrop,
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;
    
    // Default animations with spring physics
    const defaultWhileHover = whileHover || {
      scale: 1.02,
      transition: designTokens.animation.spring.light,
    };
    
    const defaultWhileTap = whileTap || {
      scale: 0.96,
      transition: designTokens.animation.spring.light,
    };
    
    const content = (
      <>
        {/* Left icon or loading spinner */}
        {loading ? (
          <Loader2 
            className="animate-spin" 
            size={16}
            aria-hidden="true"
          />
        ) : leftIcon ? (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}
        
        {/* Button text content */}
        <span className={cn(
          "inline-flex items-center justify-center",
          loading && "opacity-70"
        )}>
          {loading && loadingText ? loadingText : children}
        </span>
        
        {/* Right icon (hidden during loading) */}
        {rightIcon && !loading && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </>
    );
    
    const buttonClassName = cn(
      buttonVariants({ variant, size }),
      className
    );
    
    if (asChild) {
      return (
        <Slot
          className={buttonClassName}
          ref={ref}
          {...props}
        >
          {content}
        </Slot>
      );
    }
    
    return (
      <motion.button
        ref={ref}
        className={buttonClassName}
        disabled={isDisabled}
        whileHover={!isDisabled ? defaultWhileHover : undefined}
        whileTap={!isDisabled ? defaultWhileTap : undefined}
        animate={animate}
        // Accessibility attributes
        aria-busy={loading}
        aria-disabled={isDisabled}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
