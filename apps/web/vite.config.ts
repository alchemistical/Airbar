import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // Remove console logs in production
          ...(process.env.NODE_ENV === 'production' 
            ? [['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }]]
            : [])
        ]
      }
    }),
    // Bundle analyzer - only run when ANALYZE environment variable is set
    ...(process.env.ANALYZE 
      ? [visualizer({ 
          filename: 'dist/bundle-analysis.html',
          open: true,
          gzipSize: true,
          brotliSize: true
        })]
      : [])
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@airbar/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@shared/schema': path.resolve(__dirname, '../../packages/shared/src/schema'),
    },
  },
  build: {
    // Enable minification
    minify: 'esbuild',
    // Generate source maps for production debugging
    sourcemap: process.env.NODE_ENV === 'development',
    // Chunk splitting strategy
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor chunk for third-party libraries
          vendor: [
            'react', 
            'react-dom', 
            'react-router-dom',
            'wouter'
          ],
          // UI chunk for component libraries
          ui: [
            'lucide-react',
            'framer-motion',
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip'
          ],
          // Form handling chunk
          forms: [
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ],
          // Charts and data visualization
          charts: [
            'recharts'
          ]
        },
        // Optimize chunk names for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? path.basename(chunkInfo.facadeModuleId, path.extname(chunkInfo.facadeModuleId))
            : 'unknown'
          return `assets/[name]-[hash].js`
        }
      }
    },
    // Optimize bundle size
    target: 'esnext',
    // Set chunk size warning limit (500KB)
    chunkSizeWarningLimit: 500,
    // Enable CSS code splitting
    cssCodeSplit: true
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
    },
  },
  preview: {
    port: 3000,
    host: '0.0.0.0'
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'wouter',
      'lucide-react',
      'framer-motion',
      'react-hook-form',
      'zod'
    ]
  }
})