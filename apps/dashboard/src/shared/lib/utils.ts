/**
 * Utility functions for the dashboard app
 */

import { cn as cnUtil } from "@vibethink/utils";
import { Metadata } from "next";

/**
 * Class name utility function (re-exported from @vibethink/utils)
 */
export { cnUtil as cn };

/**
 * Generates avatar fallback text from a name
 * @param name - The full name of the user
 * @returns The initials (up to 2 characters) in uppercase
 * @example
 * generateAvatarFallback("John Doe") // "JD"
 * generateAvatarFallback("Alice") // "A"
 */
export function generateAvatarFallback(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Alias for generateAvatarFallback to match Bundui Premium imports
 */
export const getInitials = generateAvatarFallback;

/**
 * Generates metadata for Next.js pages
 * @param options - Metadata options
 * @returns Next.js Metadata object
 */
export function generateMeta({
  title,
  description,
  canonical
}: {
  title: string;
  description: string;
  canonical: string;
}): Metadata {
  return {
    title: `${title} - VibeThink Orchestrator`,
    description: description,
    metadataBase: new URL(`https://shadcnuikit.com`),
    alternates: {
      canonical: `/dashboard${canonical}`
    },
    openGraph: {
      images: [`/assets/images/seo.jpg`]
    }
  };
}


