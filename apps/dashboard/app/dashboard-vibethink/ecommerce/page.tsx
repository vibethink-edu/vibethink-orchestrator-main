import { Metadata } from "next";
import EcommerceClient from "./EcommerceClient";

export const metadata: Metadata = {
  title: "Ecommerce Admin Dashboard - VibeThink Orchestrator",
  description:
    "The e-commerce admin dashboard template is an admin template that you can use for your e-commerce website projects. Built with shadcn/ui, Tailwind CSS, Next.js."
};

export default function Page() {
  return <EcommerceClient />;
}
