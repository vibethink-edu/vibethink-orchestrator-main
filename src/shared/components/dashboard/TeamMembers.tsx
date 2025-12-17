import React from "react";
import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";

/**
 * TeamMembers
 * Componente desacoplado para mostrar la sección de miembros del equipo en el dashboard.
 * Replica la experiencia visual del demo Bundui Premium, pero usando solo componentes propios.
 */

const members = [
  { name: "Toby Belhome", email: "contact@bundui.io", role: "Viewer" },
  { name: "Jackson Lee", email: "pre@example.com", role: "Developer" },
  { name: "Hally Gray", email: "hally@site.com", role: "Viewer" },
];

const roleColor = {
  Viewer: "bg-gray-200 text-gray-800 dark:bg-neutral-800 dark:text-gray-200",
  Developer: "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

export const TeamMembers: React.FC = () => (
  <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-sm p-6">
    <h3 className="text-lg font-medium mb-4">Team Members</h3>
    <ul className="space-y-4">
      {members.map((m, i) => (
        <li key={i} className="flex items-center gap-4">
          <Avatar className="w-10 h-10" />
          <div className="flex-1">
            <div className="font-semibold">{m.name}</div>
            <div className="text-xs text-muted-foreground">{m.email}</div>
          </div>
          <Badge className={roleColor[m.role as keyof typeof roleColor] + " px-2 py-1 rounded text-xs font-semibold"}>
            {m.role}
          </Badge>
        </li>
      ))}
    </ul>
  </div>
);

// Ejemplo de uso:
// <TeamMembers /> 
