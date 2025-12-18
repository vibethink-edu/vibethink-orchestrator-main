/**
 * 🏷️ DASHBOARD BADGE COMPONENT
 * 
 * Badge visual discreto para identificar dashboards mock/reference.
 * 
 * @see docs/references/DASHBOARDS_MOCK_REFERENCE.md
 */

"use client";

import { Badge } from "@vibethink/ui";
import { usePathname } from "next/navigation";
import { shouldShowBadge, getDashboardMetadata } from "../../config/dashboards-metadata";

interface DashboardBadgeProps {
  /** Forzar mostrar badge (override metadata) */
  forceShow?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Badge discreto que se muestra en dashboards mock/reference
 * 
 * Se muestra automáticamente basado en metadata de `dashboards-metadata.ts`
 */
export function DashboardBadge({ forceShow = false, className = "" }: DashboardBadgeProps) {
  const pathname = usePathname();
  const metadata = getDashboardMetadata(pathname);
  
  // Mostrar si está forzado, o si metadata indica que debe mostrarse
  const shouldShow = forceShow || shouldShowBadge(pathname);
  
  if (!shouldShow) {
    return null;
  }

  // Determinar texto del badge basado en tipo y categoría
  let badgeText = "Demo / Reference";
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";

  if (metadata) {
    if (metadata.type === "hybrid") {
      badgeText = "Demo Mode";
    } else if (metadata.category === "demo") {
      badgeText = "Demo";
    } else if (metadata.migrationPlanned) {
      badgeText = "Reference (Migration Planned)";
    }
  }

  return (
    <Badge 
      variant={badgeVariant} 
      className={`text-xs font-normal ${className}`}
      title="Este dashboard usa datos simulados para referencia de diseño"
    >
      {badgeText}
    </Badge>
  );
}

