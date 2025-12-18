import Onboarding from "./components/onboarding";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding Flow - VibeThink Orchestrator",
  description:
    "Onboarding flow screens are a step-by-step process that asks users questions to personalize their experience. Built with shadcn/ui, Tailwind CSS, Next.js."
};

export default function Page() {
  return <Onboarding />;
}

