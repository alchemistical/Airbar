/**
 * Design System Utilities
 * Silicon Valley-grade utility functions for consistent styling
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { designTokens, componentTokens } from './tokens';

/**
 * Enhanced className utility that merges Tailwind classes intelligently
 * Prevents conflicts and maintains specificity
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Typography utility functions
 * Consistent typography throughout the app
 */
export const typography = {
  // Display typography
  display: {
    '2xl': 'text-6xl font-bold leading-tight tracking-tight',
    'xl': 'text-5xl font-bold leading-tight tracking-tight',
    'lg': 'text-4xl font-bold leading-tight tracking-tight',
    'md': 'text-3xl font-bold leading-tight tracking-tight',
    'sm': 'text-2xl font-semibold leading-tight',
  },
  
  // Heading typography
  heading: {
    'xl': 'text-xl font-semibold leading-normal tracking-tight',
    'lg': 'text-lg font-semibold leading-normal tracking-tight',
    'md': 'text-base font-semibold leading-normal',
    'sm': 'text-sm font-semibold leading-normal',
    'xs': 'text-xs font-semibold leading-normal',
  },
  
  // Body typography
  body: {
    'xl': 'text-lg leading-relaxed',
    'lg': 'text-base leading-relaxed',
    'md': 'text-sm leading-normal',
    'sm': 'text-xs leading-normal',
    'xs': 'text-xs leading-tight',
  },
  
  // Label typography
  label: {
    'xl': 'text-sm font-medium leading-normal',
    'lg': 'text-xs font-medium leading-normal',
    'md': 'text-xs font-medium leading-tight',
    'sm': 'text-xs font-medium leading-tight tracking-wide',
  },
} as const;

/**
 * Spacing utility functions
 * Consistent spacing using design tokens
 */
export const spacing = {
  // Padding utilities
  p: (size: keyof typeof designTokens.spacing) => `p-${size}`,
  px: (size: keyof typeof designTokens.spacing) => `px-${size}`,
  py: (size: keyof typeof designTokens.spacing) => `py-${size}`,
  pt: (size: keyof typeof designTokens.spacing) => `pt-${size}`,
  pr: (size: keyof typeof designTokens.spacing) => `pr-${size}`,
  pb: (size: keyof typeof designTokens.spacing) => `pb-${size}`,
  pl: (size: keyof typeof designTokens.spacing) => `pl-${size}`,
  
  // Margin utilities
  m: (size: keyof typeof designTokens.spacing) => `m-${size}`,
  mx: (size: keyof typeof designTokens.spacing) => `mx-${size}`,
  my: (size: keyof typeof designTokens.spacing) => `my-${size}`,
  mt: (size: keyof typeof designTokens.spacing) => `mt-${size}`,
  mr: (size: keyof typeof designTokens.spacing) => `mr-${size}`,
  mb: (size: keyof typeof designTokens.spacing) => `mb-${size}`,
  ml: (size: keyof typeof designTokens.spacing) => `ml-${size}`,
  
  // Gap utilities
  gap: (size: keyof typeof designTokens.spacing) => `gap-${size}`,
  gapX: (size: keyof typeof designTokens.spacing) => `gap-x-${size}`,
  gapY: (size: keyof typeof designTokens.spacing) => `gap-y-${size}`,
} as const;

/**
 * Color utility functions
 * Semantic color access
 */
export const colors = {
  // Brand colors
  brand: (shade: keyof typeof designTokens.colors.brand = 500) => 
    `text-brand-${shade}`,
  brandBg: (shade: keyof typeof designTokens.colors.brand = 500) => 
    `bg-brand-${shade}`,
  brandBorder: (shade: keyof typeof designTokens.colors.brand = 500) => 
    `border-brand-${shade}`,
  
  // Semantic colors
  success: (shade: keyof typeof designTokens.colors.success = 500) => 
    `text-success-${shade}`,
  successBg: (shade: keyof typeof designTokens.colors.success = 500) => 
    `bg-success-${shade}`,
  
  error: (shade: keyof typeof designTokens.colors.error = 500) => 
    `text-error-${shade}`,
  errorBg: (shade: keyof typeof designTokens.colors.error = 500) => 
    `bg-error-${shade}`,
  
  warning: (shade: keyof typeof designTokens.colors.warning = 500) => 
    `text-warning-${shade}`,
  warningBg: (shade: keyof typeof designTokens.colors.warning = 500) => 
    `bg-warning-${shade}`,
  
  info: (shade: keyof typeof designTokens.colors.info = 500) => 
    `text-info-${shade}`,
  infoBg: (shade: keyof typeof designTokens.colors.info = 500) => 
    `bg-info-${shade}`,
  
  // Neutral colors
  neutral: (shade: keyof typeof designTokens.colors.neutral = 500) => 
    `text-neutral-${shade}`,
  neutralBg: (shade: keyof typeof designTokens.colors.neutral = 500) => 
    `bg-neutral-${shade}`,
} as const;

/**
 * Animation utility functions
 * Consistent animations using design tokens
 */
export const animations = {
  // Transition classes
  transition: {
    fast: 'transition-all duration-150 ease-out',
    normal: 'transition-all duration-250 ease-out',
    slow: 'transition-all duration-350 ease-out',
    spring: 'transition-all duration-300 ease-spring',
    bounce: 'transition-all duration-400 ease-bounce',
  },
  
  // Transform utilities
  hover: {
    lift: 'hover:-translate-y-1 hover:shadow-lg',
    scale: 'hover:scale-105',
    scaleDown: 'hover:scale-95',
    rotate: 'hover:rotate-1',
  },
  
  // Active states
  active: {
    scale: 'active:scale-95',
    scaleDown: 'active:scale-90',
  },
  
  // Focus states
  focus: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
    glow: 'focus:outline-none focus:shadow-outline',
  },
} as const;

/**
 * Layout utility functions
 * Consistent layouts and containers
 */
export const layouts = {
  // Container utilities
  container: {
    sm: 'max-w-sm mx-auto',
    md: 'max-w-md mx-auto',
    lg: 'max-w-lg mx-auto',
    xl: 'max-w-xl mx-auto',
    '2xl': 'max-w-2xl mx-auto',
    '3xl': 'max-w-3xl mx-auto',
    '4xl': 'max-w-4xl mx-auto',
    '5xl': 'max-w-5xl mx-auto',
    '6xl': 'max-w-6xl mx-auto',
    '7xl': 'max-w-7xl mx-auto',
    full: 'w-full',
  },
  
  // Grid utilities
  grid: {
    cols1: 'grid grid-cols-1',
    cols2: 'grid grid-cols-2',
    cols3: 'grid grid-cols-3',
    cols4: 'grid grid-cols-4',
    cols6: 'grid grid-cols-6',
    cols12: 'grid grid-cols-12',
    responsive: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  },
  
  // Flex utilities
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    colCenter: 'flex flex-col items-center justify-center',
  },
} as const;

/**
 * Component style generators
 * Pre-built component styling functions
 */
export const components = {
  // Button styles
  button: {
    base: cn(
      'inline-flex items-center justify-center gap-2',
      'whitespace-nowrap rounded-lg text-sm font-semibold',
      'ring-offset-background transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      'active:scale-[0.98] hover:shadow-md'
    ),
    
    variants: {
      primary: cn(
        'bg-gradient-to-r from-brand-600 to-brand-700',
        'text-white shadow-lg shadow-brand-600/25',
        'hover:from-brand-700 hover:to-brand-800',
        'focus:ring-brand-500'
      ),
      
      secondary: cn(
        'bg-gradient-to-r from-neutral-100 to-neutral-200',
        'text-neutral-800 shadow-sm',
        'hover:from-neutral-200 hover:to-neutral-300',
        'focus:ring-neutral-400'
      ),
      
      success: cn(
        'bg-gradient-to-r from-success-600 to-success-700',
        'text-white shadow-lg shadow-success-600/25',
        'hover:from-success-700 hover:to-success-800',
        'focus:ring-success-500'
      ),
      
      error: cn(
        'bg-gradient-to-r from-error-600 to-error-700',
        'text-white shadow-lg shadow-error-600/25',
        'hover:from-error-700 hover:to-error-800',
        'focus:ring-error-500'
      ),
      
      outline: cn(
        'border-2 border-neutral-200 bg-white',
        'text-neutral-700 shadow-sm',
        'hover:bg-neutral-50 hover:border-neutral-300',
        'focus:ring-neutral-400'
      ),
      
      ghost: cn(
        'text-neutral-700',
        'hover:bg-neutral-100 hover:text-neutral-900',
        'focus:ring-neutral-400'
      ),
      
      link: cn(
        'text-brand-600 underline-offset-4',
        'hover:underline hover:text-brand-700',
        'focus:ring-brand-500'
      ),
    },
    
    sizes: {
      sm: 'h-9 px-4 text-xs rounded-md',
      md: 'h-10 px-6 py-2.5',
      lg: 'h-12 px-10 text-base rounded-xl',
      xl: 'h-14 px-12 text-lg font-bold rounded-xl',
      icon: 'h-10 w-10',
    },
  },
  
  // Card styles
  card: {
    base: cn(
      'rounded-2xl bg-white shadow-lg',
      'border border-neutral-200/50',
      'transition-all duration-200'
    ),
    
    variants: {
      default: '',
      interactive: 'hover:shadow-xl hover:-translate-y-0.5 cursor-pointer',
      elevated: 'shadow-xl',
      outlined: 'border-2 border-neutral-300',
    },
    
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  
  // Input styles
  input: {
    base: cn(
      'flex w-full rounded-lg border border-neutral-300',
      'bg-white px-3 py-2 text-sm',
      'ring-offset-background transition-colors',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-neutral-500',
      'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50'
    ),
    
    variants: {
      default: '',
      error: 'border-error-500 focus:ring-error-500',
      success: 'border-success-500 focus:ring-success-500',
    },
    
    sizes: {
      sm: 'h-8 px-2 text-xs',
      md: 'h-10 px-3',
      lg: 'h-12 px-4 text-base',
    },
  },
} as const;

/**
 * Responsive utility functions
 * Consistent responsive design patterns
 */
export const responsive = {
  // Common responsive patterns
  stack: 'flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6',
  grid: 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
  gridAuto: 'grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6',
  
  // Text scaling
  textScale: 'text-sm md:text-base lg:text-lg',
  headingScale: 'text-xl md:text-2xl lg:text-3xl',
  displayScale: 'text-3xl md:text-4xl lg:text-5xl',
  
  // Spacing scaling
  padding: 'p-4 md:p-6 lg:p-8',
  margin: 'm-4 md:m-6 lg:m-8',
  gap: 'gap-4 md:gap-6 lg:gap-8',
} as const;

/**
 * Accessibility utilities
 * WCAG compliant styling helpers
 */
export const a11y = {
  // Screen reader utilities
  srOnly: 'sr-only',
  notSrOnly: 'not-sr-only',
  
  // Focus utilities
  focusVisible: cn(
    'focus:outline-none focus-visible:outline-2',
    'focus-visible:outline-offset-2 focus-visible:outline-brand-600'
  ),
  
  // Skip links
  skipLink: cn(
    'absolute -top-10 left-6 z-50 px-4 py-2',
    'bg-brand-600 text-white rounded-md',
    'focus:top-6 transition-all duration-200'
  ),
  
  // High contrast mode
  highContrast: 'contrast-more:border-2 contrast-more:border-black',
  
  // Reduced motion
  reducedMotion: 'motion-reduce:transition-none motion-reduce:transform-none',
} as const;

/**
 * Theme utilities
 * Dark mode and theme switching helpers
 */
export const theme = {
  // Dark mode classes
  dark: {
    bg: 'dark:bg-neutral-900',
    text: 'dark:text-neutral-100',
    border: 'dark:border-neutral-800',
    card: 'dark:bg-neutral-800',
  },
  
  // Light mode classes (explicit)
  light: {
    bg: 'bg-white',
    text: 'text-neutral-900',
    border: 'border-neutral-200',
    card: 'bg-white',
  },
  
  // System preference
  system: 'dark:bg-neutral-900 dark:text-neutral-100',
} as const;

/**
 * Performance utilities
 * Optimization helpers
 */
export const perf = {
  // GPU acceleration
  gpu: 'transform-gpu',
  
  // Will-change hints
  willChange: {
    transform: 'will-change-transform',
    scroll: 'will-change-scroll',
    contents: 'will-change-contents',
  },
  
  // Containment
  contain: {
    layout: 'contain-layout',
    style: 'contain-style',
    paint: 'contain-paint',
    strict: 'contain-strict',
  },
} as const;