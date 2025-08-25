/**
 * AirBar Design Token System
 * Silicon Valley-grade design tokens following industry best practices
 * Inspired by systems from Stripe, Linear, and Vercel
 */

export const designTokens = {
  // === SPACING SYSTEM ===
  // Based on 4px grid system (0.25rem base unit)
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',   // 2px
    1: '0.25rem',      // 4px
    1.5: '0.375rem',   // 6px
    2: '0.5rem',       // 8px
    2.5: '0.625rem',   // 10px
    3: '0.75rem',      // 12px
    3.5: '0.875rem',   // 14px
    4: '1rem',         // 16px
    5: '1.25rem',      // 20px
    6: '1.5rem',       // 24px
    7: '1.75rem',      // 28px
    8: '2rem',         // 32px
    9: '2.25rem',      // 36px
    10: '2.5rem',      // 40px
    11: '2.75rem',     // 44px
    12: '3rem',        // 48px
    14: '3.5rem',      // 56px
    16: '4rem',        // 64px
    20: '5rem',        // 80px
    24: '6rem',        // 96px
    28: '7rem',        // 112px
    32: '8rem',        // 128px
    36: '9rem',        // 144px
    40: '10rem',       // 160px
    44: '11rem',       // 176px
    48: '12rem',       // 192px
    52: '13rem',       // 208px
    56: '14rem',       // 224px
    60: '15rem',       // 240px
    64: '16rem',       // 256px
    72: '18rem',       // 288px
    80: '20rem',       // 320px
    96: '24rem',       // 384px
  },

  // === SEMANTIC SPACING ===
  semanticSpacing: {
    'space-3xs': '0.125rem',    // 2px  - Micro adjustments
    'space-2xs': '0.25rem',     // 4px  - Fine details
    'space-xs': '0.5rem',       // 8px  - Small gaps
    'space-sm': '0.75rem',      // 12px - Compact spacing
    'space-md': '1rem',         // 16px - Base unit
    'space-lg': '1.5rem',       // 24px - Comfortable spacing
    'space-xl': '2rem',         // 32px - Large gaps
    'space-2xl': '2.5rem',      // 40px - Section spacing
    'space-3xl': '3rem',        // 48px - Major sections
    'space-4xl': '4rem',        // 64px - Page sections
    'space-5xl': '5rem',        // 80px - Hero sections
    'space-6xl': '6rem',        // 96px - Major layout
  },

  // === TYPOGRAPHY SYSTEM ===
  typography: {
    // Display typography - for heroes, major headlines
    display: {
      '2xl': {
        fontSize: '4.5rem',      // 72px
        lineHeight: '1.1',
        fontWeight: '800',
        letterSpacing: '-0.02em',
      },
      xl: {
        fontSize: '3.75rem',     // 60px
        lineHeight: '1.1',
        fontWeight: '800',
        letterSpacing: '-0.02em',
      },
      lg: {
        fontSize: '3rem',        // 48px
        lineHeight: '1.1',
        fontWeight: '700',
        letterSpacing: '-0.01em',
      },
      md: {
        fontSize: '2.25rem',     // 36px
        lineHeight: '1.2',
        fontWeight: '700',
        letterSpacing: '-0.01em',
      },
      sm: {
        fontSize: '1.875rem',    // 30px
        lineHeight: '1.2',
        fontWeight: '600',
      },
    },

    // Heading typography - for section headers
    heading: {
      xl: {
        fontSize: '1.5rem',      // 24px
        lineHeight: '1.3',
        fontWeight: '600',
        letterSpacing: '-0.01em',
      },
      lg: {
        fontSize: '1.25rem',     // 20px
        lineHeight: '1.3',
        fontWeight: '600',
        letterSpacing: '-0.005em',
      },
      md: {
        fontSize: '1.125rem',    // 18px
        lineHeight: '1.4',
        fontWeight: '600',
      },
      sm: {
        fontSize: '1rem',        // 16px
        lineHeight: '1.4',
        fontWeight: '600',
      },
      xs: {
        fontSize: '0.875rem',    // 14px
        lineHeight: '1.4',
        fontWeight: '600',
      },
    },

    // Body typography - for content
    body: {
      xl: {
        fontSize: '1.125rem',    // 18px
        lineHeight: '1.6',
        fontWeight: '400',
      },
      lg: {
        fontSize: '1rem',        // 16px
        lineHeight: '1.6',
        fontWeight: '400',
      },
      md: {
        fontSize: '0.875rem',    // 14px
        lineHeight: '1.5',
        fontWeight: '400',
      },
      sm: {
        fontSize: '0.75rem',     // 12px
        lineHeight: '1.5',
        fontWeight: '400',
      },
      xs: {
        fontSize: '0.6875rem',   // 11px
        lineHeight: '1.4',
        fontWeight: '400',
      },
    },

    // Label typography - for forms, captions
    label: {
      xl: {
        fontSize: '0.875rem',    // 14px
        lineHeight: '1.4',
        fontWeight: '500',
      },
      lg: {
        fontSize: '0.75rem',     // 12px
        lineHeight: '1.4',
        fontWeight: '500',
      },
      md: {
        fontSize: '0.6875rem',   // 11px
        lineHeight: '1.4',
        fontWeight: '500',
      },
      sm: {
        fontSize: '0.625rem',    // 10px
        lineHeight: '1.3',
        fontWeight: '500',
        letterSpacing: '0.01em',
      },
    },
  },

  // === COLOR SYSTEM ===
  colors: {
    // Brand colors
    brand: {
      50: '#f0fdf9',
      100: '#ccfbef',
      200: '#99f6e0',
      300: '#5feacd',
      400: '#2dd4b8',
      500: '#01a268',  // Primary brand
      600: '#00905d',
      700: '#007d50',
      800: '#006b43',
      900: '#004d30',
      950: '#002818',
    },

    // Semantic colors
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },

    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },

    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },

    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },

    // Neutral colors - for backgrounds, text, borders
    neutral: {
      0: '#ffffff',
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },

    // Alpha colors - for overlays, shadows
    alpha: {
      white: {
        5: 'rgba(255, 255, 255, 0.05)',
        10: 'rgba(255, 255, 255, 0.1)',
        20: 'rgba(255, 255, 255, 0.2)',
        30: 'rgba(255, 255, 255, 0.3)',
        40: 'rgba(255, 255, 255, 0.4)',
        50: 'rgba(255, 255, 255, 0.5)',
        60: 'rgba(255, 255, 255, 0.6)',
        70: 'rgba(255, 255, 255, 0.7)',
        80: 'rgba(255, 255, 255, 0.8)',
        90: 'rgba(255, 255, 255, 0.9)',
      },
      black: {
        5: 'rgba(0, 0, 0, 0.05)',
        10: 'rgba(0, 0, 0, 0.1)',
        20: 'rgba(0, 0, 0, 0.2)',
        30: 'rgba(0, 0, 0, 0.3)',
        40: 'rgba(0, 0, 0, 0.4)',
        50: 'rgba(0, 0, 0, 0.5)',
        60: 'rgba(0, 0, 0, 0.6)',
        70: 'rgba(0, 0, 0, 0.7)',
        80: 'rgba(0, 0, 0, 0.8)',
        90: 'rgba(0, 0, 0, 0.9)',
      },
    },
  },

  // === ANIMATION SYSTEM ===
  animation: {
    // Easing curves - for natural movement
    easing: {
      linear: 'cubic-bezier(0, 0, 1, 1)',
      ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
      easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
      // Custom Silicon Valley curves
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      snappy: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },

    // Duration scales
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      slower: '500ms',
      slowest: '750ms',
    },

    // Spring configurations
    spring: {
      // Light spring - subtle interactions
      light: {
        type: 'spring',
        stiffness: 400,
        damping: 30,
      },
      // Medium spring - button presses, cards
      medium: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
      // Heavy spring - page transitions
      heavy: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
      // Bouncy - playful interactions
      bouncy: {
        type: 'spring',
        stiffness: 600,
        damping: 15,
      },
    },
  },

  // === SHADOW SYSTEM ===
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    // Brand-colored shadows
    brand: {
      sm: '0 1px 3px 0 rgba(1, 162, 104, 0.1), 0 1px 2px -1px rgba(1, 162, 104, 0.1)',
      md: '0 4px 6px -1px rgba(1, 162, 104, 0.1), 0 2px 4px -2px rgba(1, 162, 104, 0.1)',
      lg: '0 10px 15px -3px rgba(1, 162, 104, 0.1), 0 4px 6px -4px rgba(1, 162, 104, 0.1)',
    },
  },

  // === BORDER RADIUS ===
  borderRadius: {
    none: '0',
    xs: '0.125rem',     // 2px
    sm: '0.25rem',      // 4px
    md: '0.375rem',     // 6px
    lg: '0.5rem',       // 8px
    xl: '0.75rem',      // 12px
    '2xl': '1rem',      // 16px
    '3xl': '1.5rem',    // 24px
    full: '9999px',
  },

  // === BREAKPOINTS ===
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // === Z-INDEX SCALE ===
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

// === SEMANTIC COMPONENT TOKENS ===
export const componentTokens = {
  // Button tokens
  button: {
    height: {
      sm: designTokens.spacing[8],     // 32px
      md: designTokens.spacing[10],    // 40px
      lg: designTokens.spacing[12],    // 48px
      xl: designTokens.spacing[14],    // 56px
    },
    padding: {
      sm: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,  // 8px 12px
      md: `${designTokens.spacing[2.5]} ${designTokens.spacing[4]}`, // 10px 16px
      lg: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,   // 12px 24px
      xl: `${designTokens.spacing[4]} ${designTokens.spacing[8]}`,   // 16px 32px
    },
    borderRadius: {
      sm: designTokens.borderRadius.md,
      md: designTokens.borderRadius.lg,
      lg: designTokens.borderRadius.xl,
      xl: designTokens.borderRadius['2xl'],
    },
  },

  // Card tokens
  card: {
    padding: {
      sm: designTokens.spacing[4],     // 16px
      md: designTokens.spacing[6],     // 24px
      lg: designTokens.spacing[8],     // 32px
    },
    borderRadius: designTokens.borderRadius['2xl'], // 16px
    shadow: designTokens.shadows.lg,
  },

  // Form tokens
  form: {
    field: {
      height: designTokens.spacing[10],  // 40px
      padding: designTokens.spacing[3],  // 12px
      borderRadius: designTokens.borderRadius.lg,
    },
    label: {
      marginBottom: designTokens.spacing[1.5], // 6px
    },
    error: {
      marginTop: designTokens.spacing[1],      // 4px
    },
  },
};

// Type definitions for TypeScript
export type DesignTokens = typeof designTokens;
export type ComponentTokens = typeof componentTokens;
export type SpacingToken = keyof typeof designTokens.spacing;
export type ColorToken = keyof typeof designTokens.colors;
export type TypographyToken = keyof typeof designTokens.typography;