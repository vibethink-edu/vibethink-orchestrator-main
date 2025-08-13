/**
 * Empty State 03 - Access Blocked
 * VibeThink Orchestrator Dashboard
 * 
 * Following bundui-reference pattern with VibeThink adaptations
 */

'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

export default function EmptyState03Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex h-[calc(100vh-6rem)] flex-col items-center justify-center">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-10">
            <div className="w-72 h-48 bg-muted rounded mx-auto animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted rounded mx-auto animate-pulse"></div>
            <div className="h-4 w-80 bg-muted rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <figure className="mb-10">
          <Image
            src="/403.svg"
            width={300}
            height={200}
            className="mx-auto"
            unoptimized
            alt="Access Blocked"
          />
        </figure>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Access to this page is blocked!</h2>
          <p className="text-muted-foreground">
            Please try another way or make sure you have the necessary permissions.
          </p>
        </div>
      </div>
    </div>
  );
}
