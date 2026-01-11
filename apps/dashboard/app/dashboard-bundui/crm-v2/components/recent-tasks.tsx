"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { PlusCircle } from "@vibethink/ui/icons";

import { Button } from "@vibethink/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@vibethink/ui/components/card";
import { Checkbox } from "@vibethink/ui/components/checkbox";
import { useTranslation } from "@/lib/i18n";

type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: "high" | "medium" | "low";
};

const createInitialTasks = (t: (key: string) => string): Task[] => [
  {
    id: "1",
    title: t('tasks.sample.followUp'),
    description: t('tasks.sample.sendProposal'),
    completed: false,
    dueDate: t('tasks.today'),
    priority: "high"
  },
  {
    id: "2",
    title: t('tasks.sample.prepareReport'),
    description: t('tasks.sample.compileData'),
    completed: false,
    dueDate: t('tasks.tomorrow'),
    priority: "medium"
  },
  {
    id: "3",
    title: t('tasks.sample.updateProfiles'),
    description: t('tasks.sample.verifyContact'),
    completed: true,
    dueDate: t('tasks.sample.oct15'),
    priority: "low"
  }
];

export function RecentTasks() {
  const { t } = useTranslation('crm-v2');
  const [tasks, setTasks] = useState<Task[]>(() => createInitialTasks(t));

  const toggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('cards.recentTasks.title')}</CardTitle>
        <CardDescription>{t('cards.recentTasks.description')}</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <PlusCircle className="mr-2 size-4" /> {t('tasks.addTask')}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-start space-x-3 rounded-md border p-3 transition-colors",
              task.completed && "bg-muted/50"
            )}>
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTaskStatus(task.id)}
              className="mt-1"
            />
            <div className="space-y-1">
              <p
                className={cn(
                  "text-sm leading-none font-medium",
                  task.completed && "text-muted-foreground line-through"
                )}>
                {task.title}
              </p>
              <p className={cn("text-muted-foreground text-xs", task.completed && "line-through")}>
                {task.description}
              </p>
              <div className="flex items-center pt-1">
                <div
                  className={cn(
                    "mr-2 rounded-full px-2 py-0.5 text-xs font-medium",
                    task.priority === "high" && "bg-red-100 text-red-700",
                    task.priority === "medium" && "bg-amber-100 text-amber-700",
                    task.priority === "low" && "bg-green-100 text-green-700"
                  )}>
                  {t(`tasks.priority.${task.priority}`)}
                </div>
                <span className="text-muted-foreground text-xs">{t('tasks.due')} {task.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
