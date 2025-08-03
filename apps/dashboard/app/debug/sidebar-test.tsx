'use client'

// =============================================================================
// SIDEBAR DEBUG TEST COMPONENT
// =============================================================================
// 
// Test component to debug sidebar layout issues
// Displays CSS variables and calculated margins in real-time
//
// VThink 1.0 Compliance:
// - ✅ Debug-only component
// - ✅ Real-time CSS variable monitoring
// - ✅ Responsive behavior testing
// =============================================================================

import React, { useState, useEffect } from 'react'
import { useSidebar } from '@/shared/components/bundui-premium/components/ui/sidebar'
import { Button } from '@/shared/components/bundui-premium/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card'
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge'

export function SidebarDebugPanel() {
  const { state, open, isMobile, toggleSidebar } = useSidebar()
  const [cssVars, setCssVars] = useState<Record<string, string>>({})
  const [computedMargin, setComputedMargin] = useState<string>('')

  useEffect(() => {
    const updateCssVars = () => {
      const root = document.documentElement
      const computedStyle = getComputedStyle(root)
      
      setCssVars({
        'sidebar-width': computedStyle.getPropertyValue('--sidebar-width') || 'NOT SET',
        'sidebar-width-icon': computedStyle.getPropertyValue('--sidebar-width-icon') || 'NOT SET',
        'sidebar-width-mobile': computedStyle.getPropertyValue('--sidebar-width-mobile') || 'NOT SET',
      })

      // Get computed margin of the sidebar inset
      const sidebarInset = document.querySelector('[data-slot="sidebar-inset"]')
      if (sidebarInset) {
        const insetStyle = getComputedStyle(sidebarInset as Element)
        setComputedMargin(insetStyle.marginLeft || '0px')
      }
    }

    updateCssVars()
    const interval = setInterval(updateCssVars, 500)
    return () => clearInterval(interval)
  }, [state])

  return (
    <Card className="fixed top-4 right-4 z-50 w-80 bg-background/95 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          🐛 Sidebar Debug Panel
          <Badge variant={state === 'expanded' ? 'default' : 'secondary'}>
            {state}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div>
          <h4 className="font-medium mb-1">Sidebar State</h4>
          <div className="grid grid-cols-2 gap-1">
            <div>Open: <Badge variant={open ? 'default' : 'outline'}>{open.toString()}</Badge></div>
            <div>Mobile: <Badge variant={isMobile ? 'destructive' : 'outline'}>{isMobile.toString()}</Badge></div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-1">CSS Variables</h4>
          <div className="space-y-1">
            {Object.entries(cssVars).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-muted-foreground">--{key}:</span>
                <Badge variant={value === 'NOT SET' ? 'destructive' : 'outline'} className="text-xs">
                  {value}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-1">Computed Values</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Margin Left:</span>
              <Badge variant="outline" className="text-xs">{computedMargin}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expected:</span>
              <Badge variant="outline" className="text-xs">
                {isMobile ? '0px' : state === 'expanded' ? '256px' : '80px'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button onClick={toggleSidebar} size="sm" className="w-full">
            Toggle Sidebar
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Expected values:</p>
          <p>• Expanded: 256px (16rem)</p>
          <p>• Collapsed: 80px (5rem)</p>
          <p>• Mobile: 0px</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SidebarTestPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sidebar Layout Test</h1>
        <p className="text-muted-foreground">
          This page tests the sidebar layout and margin calculations.
          The debug panel shows real-time CSS variables and computed values.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Area 1</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This content should have proper margins applied based on sidebar state.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              If the sidebar is overlapping this content, the margin calculations are not working correctly.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Area 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is additional content to test the layout.</p>
            <div className="mt-4 p-4 bg-muted rounded">
              <p className="text-sm">
                Expected behavior:
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Expanded: Content starts after 160px from left</li>
                <li>• Collapsed: Content starts after 64px from left</li>
                <li>• Mobile: Sidebar overlays, content starts at 0px</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <SidebarDebugPanel />
    </div>
  )
}