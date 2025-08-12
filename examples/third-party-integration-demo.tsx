/**
 * Example: Third-Party Component Integration Demo
 * 
 * Demonstrates how to use validated third-party components
 * in VibeThink with full Bundui-Premium compatibility
 */

"use client";

import React from 'react';
import { VibeThinkFloatingNav } from '@/shared/components/third-party/aceternity-ui/FloatingNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { Home, BarChart3, Settings, Users, Shield } from 'lucide-react';

/**
 * Demo Page: Third-Party Integration Showcase
 */
export default function ThirdPartyIntegrationDemo() {
  // Example navigation items with permissions
  const navigationItems = [
    { 
      name: "Home", 
      link: "/", 
      icon: <Home className="h-4 w-4" />
    },
    { 
      name: "Dashboard", 
      link: "/dashboard", 
      icon: <BarChart3 className="h-4 w-4" />,
      permission: "EMPLOYEE" 
    },
    { 
      name: "Analytics", 
      link: "/analytics", 
      icon: <BarChart3 className="h-4 w-4" />,
      permission: "MANAGER" 
    },
    { 
      name: "Team Management", 
      link: "/team", 
      icon: <Users className="h-4 w-4" />,
      permission: "ADMIN" 
    },
    { 
      name: "System Settings", 
      link: "/settings", 
      icon: <Settings className="h-4 w-4" />,
      permission: "SUPER_ADMIN" 
    }
  ];

  // Example user context (in real app, this would come from auth)
  const currentUser = {
    role: "MANAGER" as const,
    companyId: "demo-company-123"
  };

  // Theme presets to demo company-specific theming
  const themePresets = [
    { name: "Default", value: "default" },
    { name: "Rose Garden", value: "rose-garden" },
    { name: "Ocean Breeze", value: "ocean-breeze" },
    { name: "Forest Whisper", value: "forest-whisper" }
  ];

  const [currentTheme, setCurrentTheme] = React.useState("default");

  return (
    <div className="min-h-screen bg-background" data-theme-preset={currentTheme}>
      {/* ✅ THIRD-PARTY COMPONENT INTEGRATION */}
      <VibeThinkFloatingNav
        navItems={navigationItems}
        companyId={currentUser.companyId}
        userRole={currentUser.role}
        themePreset={currentTheme}
        className="border-2 border-primary/20" // Custom styling
      />

      <div className="container mx-auto p-8 pt-24">
        <div className="space-y-8">
          
          {/* Demo Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Third-Party Component Integration Demo</CardTitle>
              </div>
              <CardDescription>
                Demonstrating validated third-party component (Aceternity UI Floating Navbar) 
                integrated with VibeThink's multitenant architecture and Bundui-Premium theming.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">✅ APPROVED</Badge>
                <Badge variant="outline">93% Compatibility Score</Badge>
                <Badge variant="outline">Low Integration Effort</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Current User Context */}
          <Card>
            <CardHeader>
              <CardTitle>Current User Context</CardTitle>
              <CardDescription>
                The floating navbar above adapts based on user role and company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">User Role</p>
                  <p className="font-semibold text-primary">{currentUser.role}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company ID</p>
                  <p className="font-mono text-sm">{currentUser.companyId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Switching Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Company Theme Override Demo</CardTitle>
              <CardDescription>
                Switch themes to see how the floating navbar adapts to company-specific styling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {themePresets.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => setCurrentTheme(theme.value)}
                    className={`p-3 rounded-lg border transition-colors ${
                      currentTheme === theme.value 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-sm font-medium">{theme.name}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Current theme: <code className="font-mono">{currentTheme}</code>
              </p>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Integration Technical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">✅ Validation Results:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                  <li>• shadcn/ui Compatibility: Uses standard patterns</li>
                  <li>• Bundui Integration: CSS variables compatible</li>
                  <li>• VibeThink Safe: Pure UI, multitenant secure</li>
                  <li>• Performance: Acceptable scroll animations</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">🔧 Adaptations Made:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                  <li>• Added data-attribute theming support</li>
                  <li>• Integrated role-based navigation filtering</li>
                  <li>• Mapped colors to Bundui CSS variables</li>
                  <li>• Added company-specific theme overrides</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <code className="text-xs">
                  {`<VibeThinkFloatingNav
  navItems={navigationItems}
  companyId="${currentUser.companyId}"
  userRole="${currentUser.role}"
  themePreset="${currentTheme}"
/>`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Scroll Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Try It Out!</CardTitle>
              <CardDescription>
                Scroll down to see the floating navbar appear with smooth animations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">The floating navbar:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Appears when scrolling down</li>
                  <li>• Hides when scrolling up</li>
                  <li>• Shows only navigation items for your role level</li>
                  <li>• Adapts to the selected company theme</li>
                  <li>• Maintains Bundui-Premium visual standards</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Spacer for scroll testing */}
          <div className="h-screen flex items-center justify-center">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Scroll up to see the floating navbar in action! ⬆️
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Key Integration Features Demonstrated:
 * 
 * 1. ✅ Component Validation: 93% compatibility score
 * 2. 🎨 Bundui Theme Integration: CSS variables, data attributes
 * 3. 🛡️ Multitenant Security: Company-specific theming, role filtering
 * 4. 🏗️ Monorepo Architecture: Proper import paths maintained
 * 5. 📱 Responsive Design: Mobile-first patterns preserved
 * 6. ♿ Accessibility: Semantic HTML and ARIA patterns maintained
 * 
 * This demonstrates how third-party shadcn/ui components can be
 * safely and effectively integrated into the VibeThink ecosystem
 * while maintaining all architectural requirements.
 */