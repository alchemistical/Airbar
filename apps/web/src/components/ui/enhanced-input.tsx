/**
 * Enhanced Input Component - Silicon Valley Grade
 * Full accessibility compliance, micro-interactions, and advanced features
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  Info,
  X,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { designTokens } from "@/design-system/tokens";

const inputVariants = cva(
  cn(
    // Base styles
    "flex w-full rounded-lg border bg-white px-3 py-2",
    "text-sm text-neutral-900 placeholder:text-neutral-500",
    "transition-all duration-200 ease-out",
    
    // Focus styles - WCAG compliant
    "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
    "focus:border-brand-500",
    
    // File input specific
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "file:text-neutral-700 file:hover:text-neutral-800",
    
    // Disabled state
    "disabled:cursor-not-allowed disabled:opacity-50",
    "disabled:bg-neutral-100 disabled:border-neutral-200",
    
    // Dark mode
    "dark:bg-neutral-900 dark:text-neutral-100",
    "dark:border-neutral-700 dark:placeholder:text-neutral-400",
    "dark:focus:border-brand-400",
    
    // High contrast mode
    "contrast-more:border-2 contrast-more:border-neutral-800",
    
    // Reduced motion
    "motion-reduce:transition-none"
  ),
  {
    variants: {
      variant: {
        default: "border-neutral-300",
        error: cn(
          "border-error-500 focus:border-error-600 focus:ring-error-500",
          "text-error-900 placeholder:text-error-600"
        ),
        success: cn(
          "border-success-500 focus:border-success-600 focus:ring-success-500",
          "text-success-900"
        ),
        warning: cn(
          "border-warning-500 focus:border-warning-600 focus:ring-warning-500",
          "text-warning-900"
        ),
      },
      size: {
        sm: "h-8 px-2 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
      hasIcon: {
        true: "",
        left: "pl-10",
        right: "pr-10",
        both: "px-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      hasIcon: true,
    },
  }
);

const iconVariants = cva(
  "absolute top-1/2 -translate-y-1/2 text-neutral-500 transition-colors duration-200",
  {
    variants: {
      position: {
        left: "left-3",
        right: "right-3",
      },
      size: {
        sm: "h-3 w-3",
        md: "h-4 w-4", 
        lg: "h-5 w-5",
      },
      variant: {
        default: "text-neutral-500",
        error: "text-error-500",
        success: "text-success-500",
        warning: "text-warning-500",
      },
    },
    defaultVariants: {
      position: "left",
      size: "md",
      variant: "default",
    },
  }
);

export interface EnhancedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  
  // Enhanced props
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  warning?: string;
  
  // Icon props  
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Advanced features
  clearable?: boolean;
  onClear?: () => void;
  loading?: boolean;
  
  // Password field
  showPasswordToggle?: boolean;
  
  // Container props
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  
  // Accessibility
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({
    className,
    type,
    variant,
    size,
    label,
    description, 
    error,
    success,
    warning,
    leftIcon,
    rightIcon,
    clearable,
    onClear,
    loading,
    showPasswordToggle,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    disabled,
    value,
    id,
    ...props
  }, ref) => {
    
    // Generate unique ID if not provided
    const inputId = id || React.useId();
    const descriptionId = description ? `${inputId}-description` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const successId = success ? `${inputId}-success` : undefined;
    const warningId = warning ? `${inputId}-warning` : undefined;
    
    // Password visibility state
    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordField = type === 'password';
    const actualType = isPasswordField && showPassword ? 'text' : type;
    
    // Determine current variant based on state
    const currentVariant = error 
      ? 'error' 
      : success 
      ? 'success' 
      : warning 
      ? 'warning' 
      : variant || 'default';
    
    // Determine icon positioning
    const hasLeftIcon = leftIcon || loading;
    const hasRightIcon = rightIcon || clearable || showPasswordToggle;
    const hasIconPosition = hasLeftIcon && hasRightIcon 
      ? 'both' 
      : hasLeftIcon 
      ? 'left' 
      : hasRightIcon 
      ? 'right' 
      : true;
    
    // Clear function
    const handleClear = React.useCallback(() => {
      if (onClear) {
        onClear();
      }
      // Focus back to input
      if (ref && 'current' in ref && ref.current) {
        ref.current.focus();
      }
    }, [onClear, ref]);
    
    // Password toggle
    const togglePasswordVisibility = React.useCallback(() => {
      setShowPassword(prev => !prev);
    }, []);
    
    // Build aria-describedby
    const ariaDescribedBy = [
      descriptionId,
      errorId,
      successId,
      warningId,
      props['aria-describedby']
    ].filter(Boolean).join(' ') || undefined;
    
    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-neutral-700",
              "dark:text-neutral-300",
              "cursor-pointer",
              labelClassName
            )}
          >
            {label}
            {props.required && (
              <span className="ml-1 text-error-500" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        
        {/* Description */}
        {description && (
          <p
            id={descriptionId}
            className={cn(
              "text-xs text-neutral-600 dark:text-neutral-400",
              descriptionClassName
            )}
          >
            {description}
          </p>
        )}
        
        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {hasLeftIcon && (
            <div
              className={cn(
                iconVariants({ 
                  position: "left", 
                  size, 
                  variant: currentVariant 
                })
              )}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                >
                  <Search className="h-4 w-4" />
                </motion.div>
              ) : leftIcon}
            </div>
          )}
          
          {/* Input Field */}
          <input
            id={inputId}
            ref={ref}
            type={actualType}
            className={cn(
              inputVariants({ 
                variant: currentVariant, 
                size, 
                hasIcon: hasIconPosition 
              }),
              className
            )}
            disabled={disabled || loading}
            value={value}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
            {...props}
          />
          
          {/* Right Icons Container */}
          {hasRightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {/* Clear Button */}
              {clearable && value && !disabled && (
                <motion.button
                  type="button"
                  onClick={handleClear}
                  className={cn(
                    "rounded-full p-0.5 text-neutral-500",
                    "hover:text-neutral-700 hover:bg-neutral-100",
                    "focus:outline-none focus:ring-1 focus:ring-brand-500",
                    "dark:text-neutral-400 dark:hover:text-neutral-200",
                    "dark:hover:bg-neutral-800"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Clear input"
                >
                  <X className="h-3 w-3" />
                </motion.button>
              )}
              
              {/* Password Toggle */}
              {showPasswordToggle && isPasswordField && (
                <motion.button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={cn(
                    "rounded-full p-0.5 text-neutral-500",
                    "hover:text-neutral-700 hover:bg-neutral-100",
                    "focus:outline-none focus:ring-1 focus:ring-brand-500",
                    "dark:text-neutral-400 dark:hover:text-neutral-200",
                    "dark:hover:bg-neutral-800"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </motion.button>
              )}
              
              {/* Custom Right Icon */}
              {rightIcon && (
                <div 
                  className={cn(
                    iconVariants({ 
                      position: "right", 
                      size, 
                      variant: currentVariant 
                    }),
                    "relative right-0 translate-x-0"
                  )}
                >
                  {rightIcon}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Status Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={designTokens.animation.spring.light}
              id={errorId}
              className={cn(
                "flex items-center gap-1.5 text-xs text-error-600",
                "dark:text-error-400",
                errorClassName
              )}
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
          
          {success && !error && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={designTokens.animation.spring.light}
              id={successId}
              className="flex items-center gap-1.5 text-xs text-success-600 dark:text-success-400"
              role="status"
              aria-live="polite"
            >
              <CheckCircle className="h-3 w-3 shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}
          
          {warning && !error && !success && (
            <motion.div
              key="warning"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={designTokens.animation.spring.light}
              id={warningId}
              className="flex items-center gap-1.5 text-xs text-warning-600 dark:text-warning-400"
              role="alert"
              aria-live="polite"
            >
              <Info className="h-3 w-3 shrink-0" />
              <span>{warning}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";

export { EnhancedInput, inputVariants };