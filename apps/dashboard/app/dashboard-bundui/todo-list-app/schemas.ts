import * as z from "zod";
import { EnumTodoPriority, EnumTodoStatus } from "./enum";

export const todoFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assignedTo: z.array(z.string()).min(1, "At least one assignee is required"),
  status: z.nativeEnum(EnumTodoStatus),
  priority: z.nativeEnum(EnumTodoPriority),
  dueDate: z.date().optional().nullable(),
  reminderDate: z.date().optional().nullable()
});

export type TodoFormValues = z.infer<typeof todoFormSchema>;
