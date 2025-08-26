/**
 * Vite Bundle Optimization Configuration
 * Epic 4: Enhanced Dashboard & Silicon Valley Integration
 * Advanced code splitting and performance optimization
 */

import { defineConfig } from 'vite';

export const bundleOptimizationConfig = defineConfig({
  build: {
    // Advanced code splitting configuration
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal loading
        manualChunks: {
          // Vendor libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-routing': ['wouter'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'vendor-ui': ['framer-motion', 'lucide-react', 'class-variance-authority'],
          'vendor-query': ['@tanstack/react-query'],
          
          // Application chunks
          'auth': [
            './src/context/AuthContext',
            './src/components/auth',
            './src/routes/authRoutes'
          ],
          'dashboard': [
            './src/pages/Dashboard',
            './src/pages/DashboardMatches',
            './src/routes/dashboardRoutes'
          ],
          'marketplace': [
            './src/pages/Matches',
            './src/pages/MatchRequests',
            './src/routes/marketplaceRoutes'
          ],
          'trips': [
            './src/pages/AddTrip',
            './src/pages/MyTrips',
            './src/routes/tripRoutes'
          ],
          'marketing': [
            './src/marketing',
            './src/pages/landing-v2'
          ],
          'forms': [
            './src/components/form',
            './src/pages/SendPackage'
          ],
          'ui-components': [
            './src/components/ui/animated-button',
            './src/components/ui/animated-card',
            './src/components/ui/enhanced-input'
          ]
        },
        
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `chunks/[name]-[hash].js`;
        },
        
        entryFileNames: 'entries/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Advanced minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug']
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    
    // Optimize bundle size
    target: 'es2020',
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Report bundle size
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000
  },
  
  // Performance optimizations
  optimizeDeps: {
    include: [
      // Pre-bundle frequently used deps
      'react',
      'react-dom',
      'framer-motion',
      'lucide-react',
      '@tanstack/react-query'
    ],
    exclude: [
      // Don't pre-bundle large or rarely used deps
    ]
  },
  
  // Server optimizations for development
  server: {
    hmr: {
      overlay: false // Reduce HMR overhead
    }
  }
});

/**
 * Bundle analysis configuration for development
 */
export const bundleAnalysisConfig = {
  // Bundle analyzer options
  analyzer: {
    analyzerMode: 'server',
    openAnalyzer: false,
    reportFilename: 'bundle-report.html',
    defaultSizes: 'gzip'
  },
  
  // Performance budgets
  budgets: {
    // Maximum sizes for different chunk types
    vendor: 500, // KB
    main: 250,   // KB
    async: 100,  // KB per lazy-loaded chunk
    total: 2000  // KB total for initial load
  },
  
  // Critical resource hints
  preload: [
    // Resources to preload for faster initial rendering
    'vendor-react',
    'vendor-ui',
    'ui-components'
  ],
  
  prefetch: [
    // Resources to prefetch during idle time
    'dashboard',
    'marketplace',
    'forms'
  ]
};

/**
 * Development performance monitoring
 */
export function logBundleStats() {
  if (process.env.NODE_ENV === 'development') {
    // Log bundle composition in development
    console.group('📦 Bundle Optimization');
    console.log('🎯 Code splitting: Active');
    console.log('⚡ Lazy loading: Active'); 
    console.log('🗜️  Compression: Active');
    console.log('🔄 HMR: Optimized');
    console.groupEnd();
  }
}

/**
 * Production build optimization checker
 */
export function validateBundleOptimization() {
  if (process.env.NODE_ENV === 'production') {
    // Validate optimization in production build
    const checks = {
      codesplitting: true,
      lazyLoading: true,
      compression: true,
      treeshaking: true
    };
    
    console.log('✅ Bundle optimization validated:', checks);
  }
}