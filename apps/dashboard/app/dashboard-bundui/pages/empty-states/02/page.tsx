import CreateProjectEmptyState from "./components/create-project-empty-state";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Empty States 02 - VibeThink Orchestrator",
  description:
    "Empty states show placeholder content when no data is available. Built with shadcn/ui, Tailwind CSS, Next.js and React."
};

export default function Page() {
  return <CreateProjectEmptyState />;
}


