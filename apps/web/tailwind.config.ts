import type { Config } from "tailwindcss";
import { designTokens } from "./src/design-system/tokens";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "../../packages/shared/src/**/*.{ts,tsx,js,jsx,mdx}"
  ],
  theme: {
    extend: {
      // Import design tokens
      spacing: designTokens.spacing,
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        ...designTokens.borderRadius,
      },
      
      // Typography from design tokens
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-lg': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-xl': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-lg': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-md': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-sm': ['1rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-xs': ['0.875rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-xl': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-lg': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-xs': ['0.6875rem', { lineHeight: '1.4', fontWeight: '400' }],
        'label-xl': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
        'label-lg': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        'label-md': ['0.6875rem', { lineHeight: '1.4', fontWeight: '500' }],
        'label-sm': ['0.625rem', { lineHeight: '1.3', fontWeight: '500' }],
      },
      
      // Enhanced shadows
      boxShadow: {
        ...designTokens.shadows,
        'elevation-1': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'elevation-2': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevation-3': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'elevation-4': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glow-brand': '0 0 20px rgba(1, 162, 104, 0.3)',
        'glow-success': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-error': '0 0 20px rgba(239, 68, 68, 0.3)',
      },
      
      // Animation timing functions
      transitionTimingFunction: {
        ...designTokens.animation.easing,
      },
      
      // Animation durations
      transitionDuration: {
        ...designTokens.animation.duration,
      },
      colors: {
        // Enhanced brand colors from design tokens
        brand: {
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5feacd',
          400: '#2dd4b8',
          500: '#01a268',
          600: '#00905d',
          700: '#007d50',
          800: '#006b43',
          900: '#004d30',
          950: '#002818',
        },
        
        // Semantic colors
        success: designTokens.colors.success,
        error: designTokens.colors.error,
        warning: designTokens.colors.warning,
        info: designTokens.colors.info,
        neutral: designTokens.colors.neutral,
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5feacd',
          400: '#2dd4b8',
          500: "#01a268",
          600: "#00905d", 
          700: "#007d50",
          800: "#006b43",
          900: "#004d30",
          dark: "#00905D",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        danger: "var(--danger)",
        success: "var(--success)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      // Enhanced keyframes and animations
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Custom animations
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        wave: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounce: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0,-30px,0)' },
          '70%': { transform: 'translate3d(0,-15px,0)' },
          '90%': { transform: 'translate3d(0,-4px,0)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Custom animations
        shimmer: 'shimmer 2s infinite',
        wave: 'wave 1.5s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'bounce-in': 'bounce 1s ease-out',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    // Custom plugin for design token utilities
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        // Typography utilities
        '.text-display-2xl': {
          fontSize: theme('fontSize.display-2xl[0]'),
          lineHeight: theme('fontSize.display-2xl[1].lineHeight'),
          fontWeight: theme('fontSize.display-2xl[1].fontWeight'),
        },
        '.text-display-xl': {
          fontSize: theme('fontSize.display-xl[0]'),
          lineHeight: theme('fontSize.display-xl[1].lineHeight'),
          fontWeight: theme('fontSize.display-xl[1].fontWeight'),
        },
        '.text-display-lg': {
          fontSize: theme('fontSize.display-lg[0]'),
          lineHeight: theme('fontSize.display-lg[1].lineHeight'),
          fontWeight: theme('fontSize.display-lg[1].fontWeight'),
        },
        
        // Elevation utilities
        '.elevation-1': {
          boxShadow: theme('boxShadow.elevation-1'),
        },
        '.elevation-2': {
          boxShadow: theme('boxShadow.elevation-2'),
        },
        '.elevation-3': {
          boxShadow: theme('boxShadow.elevation-3'),
        },
        '.elevation-4': {
          boxShadow: theme('boxShadow.elevation-4'),
        },
        
        // Glow utilities
        '.glow-brand': {
          boxShadow: theme('boxShadow.glow-brand'),
        },
        '.glow-success': {
          boxShadow: theme('boxShadow.glow-success'),
        },
        '.glow-error': {
          boxShadow: theme('boxShadow.glow-error'),
        },
        
        // GPU acceleration
        '.gpu': {
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        },
      };
      
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;

// Note: This config integrates our Silicon Valley-grade design system
// with Tailwind CSS for consistent, scalable styling throughout the app
