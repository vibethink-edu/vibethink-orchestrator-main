import { Metadata } from "next";
import { generateMeta } from "@/lib/utils";
import { PricingContent } from "./pricing-content";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Pricing - Column Layout",
    description:
      "Compare your services with flexible and user-friendly pricing tables. Offer your customers the most suitable plan with transparent pricing options.",
    canonical: "/pages/pricing/column"
  });
}

export default function Page() {
  return <PricingContent />;
}

