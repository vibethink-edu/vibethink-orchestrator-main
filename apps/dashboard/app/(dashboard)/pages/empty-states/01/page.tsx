/**
 * Empty State 01 - No Projects
 * VibeThink Orchestrator Dashboard
 * 
 * Following bundui-reference pattern with VibeThink adaptations
 */

'use client';

import { useState, useEffect } from "react";
import { FolderPlus, Plus } from "lucide-react";
import { Button } from '@vibethink/ui';

export default function EmptyState01Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex h-[calc(100vh-6rem)] flex-col items-center justify-center">
        <div className="mx-auto max-w-md text-center space-y-4">
          <div className="h-16 w-16 bg-muted rounded-full mx-auto animate-pulse"></div>
          <div className="h-6 bg-muted rounded mx-auto max-w-32 animate-pulse"></div>
          <div className="h-4 bg-muted rounded mx-auto max-w-48 animate-pulse"></div>
          <div className="h-10 w-32 bg-muted rounded mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <FolderPlus className="text-muted-foreground mx-auto h-16 w-16" />
        <h2 className="mt-6 text-xl font-semibold">No projects</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Get started by creating a new project.
        </p>
        <div className="mt-6">
          <Button>
            <Plus />
            New Project
          </Button>
        </div>
      </div>
    </div>
  );
}
