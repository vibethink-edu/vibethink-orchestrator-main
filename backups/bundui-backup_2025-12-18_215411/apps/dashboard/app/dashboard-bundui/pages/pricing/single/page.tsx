import { Metadata } from "next";
import { generateMeta } from "@/lib/utils";
import { PricingContent } from "./pricing-content";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Pricing - Single Plan",
    description:
      "Choose your learning journey with our comprehensive e-learning platform. Unlock a world of knowledge with flexible pricing options.",
    canonical: "/pages/pricing/single"
  });
}

export default function Page() {
  return <PricingContent />;
}

