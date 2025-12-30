"use client";

import ImageGenerator from "./components/image-generator";
import { TooltipProvider } from "@vibethink/ui";

export default function Page() {
  return (
    <TooltipProvider>
      <ImageGenerator />
    </TooltipProvider>
  );
}


