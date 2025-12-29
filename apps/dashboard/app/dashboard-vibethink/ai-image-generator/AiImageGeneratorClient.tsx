"use client";

import { TooltipProvider } from "@vibethink/ui";
import ImageGenerator from "./components/image-generator";

export default function AiImageGeneratorClient() {
  return (
    <TooltipProvider>
      <ImageGenerator />
    </TooltipProvider>
  );
}
