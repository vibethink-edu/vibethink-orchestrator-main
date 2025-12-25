import { Metadata } from "next";
import { generateMeta } from "@/shared/lib/utils";
import { PricingContent } from "./pricing-content";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Pricing - Table Layout",
    description:
      "Compare pricing plans side by side with our comprehensive pricing table. Choose the plan that best fits your needs.",
    canonical: "/pages/pricing/table"
  });
}

export default function Page() {
  return <PricingContent />;
}

