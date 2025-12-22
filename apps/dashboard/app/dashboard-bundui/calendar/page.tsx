import { generateMeta } from "@/shared/lib/utils";
import { Metadata } from "next";

import EventCalendarApp from "./components/event-calendar-app";

export async function generateMetadata(): Promise<Metadata> {
  // TODO: Use translations for metadata (requires async term() or getSnapshot)
  // For now, using hardcoded strings as fallback
  return generateMeta({
    title: "Event Calendar",
    description: "Plan your events or tasks in an organized way with the Calendar app template. Built with shadcn/ui, Next.js, Tailwind CSS and React.",
    canonical: "/apps/calendar"
  });
}

export default function Page() {
  return <EventCalendarApp />;
}
