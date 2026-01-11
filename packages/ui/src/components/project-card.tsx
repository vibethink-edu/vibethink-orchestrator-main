import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { cn } from "../lib/utils"
import { Badge } from "./badge"
import { Progress } from "./progress"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

interface ProjectMember {
  name: string
  avatar: string
  role: string
}

interface ProjectCardProps {
  title: string
  description?: string
  status?: "active" | "pending" | "completed" | "archived"
  progress?: number
  members?: ProjectMember[]
  dueDate?: string
  budget?: string
  category?: string
  priority?: "low" | "medium" | "high"
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
  status,
  progress,
  members = [],
  dueDate,
  budget,
  category,
  priority,
  children,
  className
}: ProjectCardProps) {
  return (
    <Card className={cn("overflow-hidden flex flex-col h-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-1">
          {category && <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{category}</Badge>}
          {status && (
            <Badge
              variant={status === 'completed' ? 'default' : 'secondary'}
              className={cn("capitalize text-[10px]", {
                "bg-green-500/10 text-green-500 hover:bg-green-500/20": status === 'completed',
                "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20": status === 'active',
                "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20": status === 'pending',
                "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20": status === 'archived',
              })}
            >
              {status}
            </Badge>
          )}
        </div>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        {description && <CardDescription className="line-clamp-2 min-h-[40px]">{description}</CardDescription>}
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-xs">
          {dueDate && (
            <div className="space-y-1">
              <span className="text-muted-foreground block">Due Date</span>
              <span className="font-medium">{dueDate}</span>
            </div>
          )}
          {budget && (
            <div className="space-y-1">
              <span className="text-muted-foreground block">Budget</span>
              <span className="font-medium">{budget}</span>
            </div>
          )}
        </div>

        {members.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground block">Team</span>
            <div className="flex -space-x-2 overflow-hidden">
              {members.map((member, i) => (
                <Avatar key={i} className="border-2 border-background w-8 h-8">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        )}

        {children}
      </CardContent>
    </Card>
  )
}

export { ProjectCard }
export default ProjectCard

