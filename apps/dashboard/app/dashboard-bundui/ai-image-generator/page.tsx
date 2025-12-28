import ImageGenerator from "./components/image-generator";
import { TooltipProvider } from "@vibethink/ui";

export const metadata = {
  title: "AI Image Generator - VibeThink Orchestrator",
  description:
    "UI components and application template for AI image generation tools. Built with Tailwind CSS, React, Next.js. shadcn/ui is compatible and contains Typescript files."
};

export default function Page() {
  return (
    <TooltipProvider>
      <ImageGenerator />
    </TooltipProvider>
  );
}


