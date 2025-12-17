import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { cn } from "../lib/utils"

interface ProjectCardProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

/**
 * ProjectCard - Card para proyectos
 * Reemplazo de bundui-ui ProjectCard usando shadcn/ui Card
 */
function ProjectCard({ 
  title, 
  description, 
  children, 
  className 
}: ProjectCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  )
}

export { ProjectCard }
export default ProjectCard

