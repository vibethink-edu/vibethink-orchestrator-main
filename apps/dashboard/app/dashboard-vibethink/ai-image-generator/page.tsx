import { Metadata } from "next";
import AiImageGeneratorClient from "./AiImageGeneratorClient";

export const metadata: Metadata = {
  title: "AI Image Generator - VibeThink Orchestrator",
  description:
    "UI components and application template for AI image generation tools. Built with Tailwind CSS, React, Next.js. shadcn/ui is compatible and contains Typescript files."
};

export default function Page() {
  return <AiImageGeneratorClient />;
}


