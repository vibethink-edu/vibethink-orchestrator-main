"use client";

import { useState, useEffect } from "react";
import ImageGenerator from "./components/image-generator";
import { TooltipProvider } from "@/shared/components/ui/tooltip";

/**
 * AI Image Generator Dashboard Page
 * VibeThink Orchestrator
 * 
 * Complete AI-powered image generation system with advanced prompt engineering,
 * style controls, and comprehensive image management tools. Optimized for
 * creative professionals, content creators, and design teams.
 * 
 * Features:
 * - Advanced AI image generation with multiple models
 * - Intelligent prompt engineering and suggestions
 * - Style presets and artistic filters
 * - Batch generation and processing queues
 * - Image history and gallery management
 * - Download and export in multiple formats
 * - Real-time generation progress tracking
 * - Custom model parameter controls
 * 
 * Architecture:
 * - Multi-tenant security with company_id filtering
 * - Responsive grid layout optimized for creative workflows
 * - HSL color variables for seamless theme integration
 * - Real-time generation updates via WebSocket connections
 * - VibeThink 1.0 methodology compliance with CMMI-ML3
 * - Integration with leading AI image generation APIs
 * 
 * AI Model Support:
 * - DALL-E integration for creative generation
 * - Stable Diffusion for customizable outputs
 * - Midjourney API for artistic styles
 * - Custom model parameter fine-tuning
 */
export default function AiImageGeneratorDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <ImageGenerator />
    </TooltipProvider>
  );
}