import { Metadata } from "next";
import { generateMeta } from "@/shared/lib/utils";

import SocialMediaClient from "./SocialMediaClient";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Social Media App",
    description:
      "Social media app is a ui template used to connect, share and interact with users online. Built with shadcn/ui, Tailwind CSS, Next.js and React.",
    canonical: "/dashboard-bundui/social-media"
  });
}

export default function Page() {
  return <SocialMediaClient />;
}

