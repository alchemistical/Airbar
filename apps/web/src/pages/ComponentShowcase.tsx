/**
 * Silicon Valley Component Showcase Dashboard
 * Demonstrates all enhanced components with real functionality
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { Skeleton, SkeletonCard, SkeletonAvatar, SkeletonTable } from '@/components/ui/enhanced-skeleton';
import { usePWA } from '@/hooks/usePWA';
import { useVirtualization } from '@/hooks/useVirtualization';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Zap, 
  Palette, 
  Database, 
  Globe, 
  Layers,
  Sparkles,
  Eye,
  Gauge,
  Lock
} from 'lucide-react';

const ComponentShowcase: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    search: ''
  });

  const { canInstall, installApp, isOnline } = usePWA();

  // Mock data for virtualization demo
  const mockItems = Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
  }));

  const virtualization = useVirtualization(mockItems.length, {
    itemHeight: 60,
    containerHeight: 400,
    overscan: 5,
  });

  // Enhanced query demo
  const { data: demoData, isLoading, metrics } = useOptimizedQuery({
    queryKey: ['showcase-demo'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: 'Data loaded successfully!', timestamp: new Date().toISOString() };
    },
    staleTime: 30000,
  });

  const triggerLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 md:p-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-brand-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
            Silicon Valley Components
          </h1>
        </div>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Production-ready components with advanced animations, accessibility, and performance optimizations
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-brand-50 to-brand-100 border-brand-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-600 text-sm font-medium">Components</p>
                  <p className="text-2xl font-bold text-brand-900">12+</p>
                </div>
                <Layers className="h-8 w-8 text-brand-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-success-50 to-success-100 border-success-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-success-600 text-sm font-medium">Performance</p>
                  <p className="text-2xl font-bold text-success-900">A+</p>
                </div>
                <Gauge className="h-8 w-8 text-success-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Accessibility</p>
                  <p className="text-2xl font-bold text-purple-900">WCAG AA</p>
                </div>
                <Eye className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">PWA Ready</p>
                  <p className="text-2xl font-bold text-amber-900">{isOnline ? 'Online' : 'Offline'}</p>
                </div>
                <Globe className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Component Sections */}
      <Tabs defaultValue="buttons" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="buttons">AnimatedButtons</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="loading">Loading</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="pwa">PWA</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
        </TabsList>

        {/* AnimatedButton Showcase */}
        <TabsContent value="buttons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                AnimatedButton Variants with Spring Animations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-neutral-600">Variants</h4>
                  <div className="flex flex-wrap gap-2">
                    <AnimatedButton variant="primary">Primary</AnimatedButton>
                    <AnimatedButton variant="secondary">Secondary</AnimatedButton>
                    <AnimatedButton variant="success">Success</AnimatedButton>
                    <AnimatedButton variant="destructive">Destructive</AnimatedButton>
                    <AnimatedButton variant="warning">Warning</AnimatedButton>
                    <AnimatedButton variant="outline">Outline</AnimatedButton>
                    <AnimatedButton variant="ghost">Ghost</AnimatedButton>
                    <AnimatedButton variant="link">Link</AnimatedButton>
                    <AnimatedButton variant="premium">Premium ✨</AnimatedButton>
                    <AnimatedButton variant="default">Default</AnimatedButton>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-neutral-600">Sizes</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <AnimatedButton size="xs">Extra Small</AnimatedButton>
                    <AnimatedButton size="sm">Small</AnimatedButton>
                    <AnimatedButton size="md">Medium</AnimatedButton>
                    <AnimatedButton size="lg">Large</AnimatedButton>
                    <AnimatedButton size="xl">Extra Large</AnimatedButton>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-neutral-600">States & Icons</h4>
                  <div className="space-y-2">
                    <AnimatedButton loading leftIcon={<Zap />}>Loading</AnimatedButton>
                    <AnimatedButton disabled>Disabled</AnimatedButton>
                    <AnimatedButton leftIcon={<Lock />} rightIcon={<Sparkles />}>
                      With Icons
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forms Showcase */}
        <TabsContent value="forms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Enhanced Forms with Validation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <EnhancedInput
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    description="We'll never share your email"
                  />
                  
                  <EnhancedInput
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    showPasswordToggle
                  />
                  
                  <EnhancedInput
                    label="Search"
                    placeholder="Search anything..."
                    value={formData.search}
                    onChange={(e) => setFormData(prev => ({ ...prev, search: e.target.value }))}
                    showClearAnimatedButton
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-neutral-600">Form Features</h4>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">✓ Auto-generated IDs</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">✓ ARIA labels</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">✓ Validation states</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">✓ Password toggle</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">✓ Clear button</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">✓ Focus management</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loading States Showcase */}
        <TabsContent value="loading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Advanced Loading States
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4 mb-6">
                <AnimatedButton onClick={triggerLoading}>
                  Trigger Loading Demo
                </AnimatedButton>
                <Badge variant={loading ? "warning" : "success"}>
                  {loading ? 'Loading...' : 'Ready'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-neutral-600">Skeleton Variants</h4>
                  <SkeletonCard showImage showActions />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-neutral-600">Skeleton Components</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <SkeletonAvatar />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[160px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <SkeletonTable />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Showcase */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Performance Optimizations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-neutral-600">Optimized Query Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">Cache Hit Rate</span>
                      <Badge variant="success">{metrics.cacheHit ? 'Hit' : 'Miss'}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">Fetch Time</span>
                      <Badge variant="secondary">{metrics.fetchTime.toFixed(0)}ms</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">Retry Count</span>
                      <Badge variant="outline">{metrics.retryCount}</Badge>
                    </div>
                  </div>
                  
                  {demoData && (
                    <div className="mt-4 p-3 bg-success-50 rounded-lg border border-success-200">
                      <p className="text-sm text-success-800">✓ {demoData.message}</p>
                      <p className="text-xs text-success-600 mt-1">{demoData.timestamp}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-neutral-600">Virtualization Demo</h4>
                  <div className="text-sm text-neutral-600 mb-2">
                    Rendering {virtualization.virtualItems.length} of {mockItems.length} items
                  </div>
                  <div 
                    {...virtualization.scrollElementProps}
                    className="border rounded-lg bg-white"
                  >
                    <div style={{ height: virtualization.totalHeight, position: 'relative' }}>
                      {virtualization.virtualItems.map((item) => {
                        const mockItem = mockItems[item.index];
                        return (
                          <div
                            key={item.index}
                            {...virtualization.getItemProps(item.index)}
                            className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between hover:bg-neutral-50"
                          >
                            <div>
                              <p className="font-medium text-sm">{mockItem.name}</p>
                              <p className="text-xs text-neutral-500">{mockItem.description}</p>
                            </div>
                            <Badge variant="outline">#{mockItem.id}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PWA Showcase */}
        <TabsContent value="pwa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Progressive Web App Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-neutral-600">PWA Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Online Status</span>
                      <Badge variant={isOnline ? "success" : "destructive"}>
                        {isOnline ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Installable</span>
                      <Badge variant={canInstall ? "success" : "secondary"}>
                        {canInstall ? 'Yes' : 'Already Installed'}
                      </Badge>
                    </div>
                  </div>
                  
                  {canInstall && (
                    <AnimatedButton onClick={installApp} className="w-full">
                      Install AirBar App
                    </AnimatedButton>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-neutral-600">PWA Features</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="success">✓ App Manifest</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">✓ Service Worker</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">✓ Offline Support</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">✓ Install Prompts</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">✓ App Shortcuts</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">✓ Share API</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mobile Showcase */}
        <TabsContent value="mobile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Mobile-First Responsive Design
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-8 bg-gradient-to-br from-brand-50 to-purple-50 rounded-lg border border-brand-200">
                <Smartphone className="h-16 w-16 text-brand-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-brand-900 mb-2">
                  Optimized for All Devices
                </h3>
                <p className="text-brand-600 text-sm max-w-md mx-auto">
                  All components are built mobile-first and scale perfectly across devices. 
                  Try resizing your browser or viewing on mobile!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <h4 className="font-medium text-sm mb-2">Mobile (≥320px)</h4>
                  <Badge variant="success">✓ Optimized</Badge>
                </Card>
                <Card className="p-4 text-center">
                  <h4 className="font-medium text-sm mb-2">Tablet (≥768px)</h4>
                  <Badge variant="success">✓ Optimized</Badge>
                </Card>
                <Card className="p-4 text-center">
                  <h4 className="font-medium text-sm mb-2">Desktop (≥1024px)</h4>
                  <Badge variant="success">✓ Optimized</Badge>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComponentShowcase;