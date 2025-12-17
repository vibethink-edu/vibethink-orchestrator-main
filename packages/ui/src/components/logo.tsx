import * as React from "react"
import { cn } from "../lib/utils"

interface LogoProps {
  className?: string
  src?: string
  alt?: string
}

/**
 * Logo - Componente simple de logo
 * Reemplazo de bundui-ui Logo
 */
function Logo({ 
  className, 
  src = "/logo.svg", 
  alt = "Logo" 
}: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {src ? (
        <img src={src} alt={alt} className="h-8 w-auto" />
      ) : (
        <span className="text-xl font-bold">Logo</span>
      )}
    </div>
  )
}

export { Logo }
export default Logo

