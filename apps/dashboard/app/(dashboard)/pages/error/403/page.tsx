/**
 * 403 Error Page - Unauthorized Access
 * VibeThink Orchestrator Dashboard
 * 
 * Following bundui-reference pattern with VibeThink adaptations
 */

'use client';

import { useState, useEffect } from "react";
import { Button } from '@vibethink/ui';
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Error403Page() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoHome = () => {
    router.push('/');
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex h-[calc(100vh-6rem)] items-center justify-center">
        <div className="text-center">
          <div className="m-auto w-40 lg:w-60 bg-muted rounded animate-pulse h-32"></div>
          <div className="mt-6 space-y-4 lg:mt-8">
            <div className="h-8 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded animate-pulse max-w-md mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] items-center justify-center">
      <div className="text-center">
        <figure className="m-auto w-40 lg:w-60">
          <Image
            width={300}
            height={200}
            src="/403.svg"
            className="w-full"
            alt="403 - No Authorization"
            unoptimized
          />
        </figure>
        <div className="mt-6 space-y-4 lg:mt-8">
          <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">No Authorization</h1>
          <p className="text-muted-foreground">
            You do not appear to have permission to access this page
          </p>
        </div>
        <div className="mt-6 lg:mt-8">
          <Button size="lg" onClick={handleGoHome}>
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
