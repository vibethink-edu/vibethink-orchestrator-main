/**
 * Onboarding Flow Page
 * VibeThink Orchestrator Dashboard
 * 
 * Multi-step onboarding process for new users
 */

"use client";

import { useState, useEffect } from "react";
import Onboarding from "./components/onboarding";

export default function OnboardingFlowPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="mx-auto max-w-3xl lg:pt-10">
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-2 w-16 rounded-full bg-muted animate-pulse" />
            <div className="h-2 w-16 rounded-full bg-muted animate-pulse" />
            <div className="h-2 w-16 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
        <div className="space-y-8">
          <div className="h-8 w-64 bg-muted rounded mx-auto animate-pulse"></div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome to VibeThink</h1>
        <p className="text-muted-foreground">
          Let's personalize your experience in just a few steps.
        </p>
      </div>
      
      <Onboarding />
    </div>
  );
}
