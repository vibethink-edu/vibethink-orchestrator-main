import React from "react";
import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";

/**
 * RecentActivity
 * Componente desacoplado para mostrar la actividad reciente en el dashboard.
 * Replica la experiencia visual del demo Bundui Premium, pero usando solo componentes propios.
 */

const activities = [
  { user: "Sofia Davis", email: "m@example.com", action: "New message", time: "2m ago", type: "message" },
  { user: "James Wilson", email: "james34@outlook.com", action: "Payment processed", time: "10m ago", type: "payment" },
  { user: "Maria Garcia", email: "maria@gmail.com", action: "Subscription upgraded", time: "1h ago", type: "subscription" },
  { user: "Silas Johnson", email: "silas22@gmail.com", action: "Account updated", time: "2h ago", type: "update" },
];

const typeColor = {
  message: "bg-blue-100 text-blue-800",
  payment: "bg-green-100 text-green-800",
  subscription: "bg-yellow-100 text-yellow-800",
  update: "bg-gray-100 text-gray-800",
};

export const RecentActivity: React.FC = () => (
  <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-sm p-6">
    <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
    <ul className="space-y-4">
      {activities.map((a, i) => (
        <li key={i} className="flex items-center gap-4">
          <Avatar className="w-8 h-8" />
          <div className="flex-1">
            <div className="font-semibold">{a.user}</div>
            <div className="text-xs text-muted-foreground">{a.email}</div>
          </div>
          <Badge className={typeColor[a.type as keyof typeof typeColor] + " px-2 py-1 rounded text-xs font-semibold"}>
            {a.action}
          </Badge>
          <span className="text-xs text-muted-foreground ml-2">{a.time}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Ejemplo de uso:
// <RecentActivity /> 