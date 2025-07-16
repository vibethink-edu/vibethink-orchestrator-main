import React, { useState } from "react";
import { faComments, faFolderOpen, faChartBar, faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const navItems = [
  { icon: faComments, label: "Conversaciones" },
  { icon: faFolderOpen, label: "Repositorios" },
  { icon: faChartBar, label: "Analítica" },
  { icon: faCog, label: "Configuración" },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-full bg-white/80 dark:bg-neutral-900/80 border-r border-gray-200 dark:border-neutral-800 transition-all duration-300 ease-in-out flex flex-col ${collapsed ? "w-16" : "w-56"}`}
      aria-label="Barra lateral de navegación"
    >
      <div className="flex items-center justify-between p-4">
        <span className={`font-bold text-lg tracking-tight text-gray-800 dark:text-gray-100 transition-opacity ${collapsed ? "opacity-0 pointer-events-none" : "opacity-100"}`}>AI Studio</span>
        <button
          className="ml-auto p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label={collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
          onClick={() => setCollapsed((c) => !c)}
        >
          <FontAwesomeIcon icon={faCog} spin={collapsed} className="text-gray-500" />
        </button>
      </div>
      <nav className="flex-1 flex flex-col gap-2 mt-4">
        {navItems.map((item) => (
          <div key={item.label} className="relative group flex items-center">
            <button
              className={`flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 gap-3 ${collapsed ? "justify-center" : ""}`}
              tabIndex={0}
              aria-label={item.label}
            >
              <FontAwesomeIcon icon={item.icon} className="text-xl text-gray-600 dark:text-gray-300" />
              {!collapsed && <span className="text-gray-800 dark:text-gray-100 font-medium">{item.label}</span>}
            </button>
            {collapsed && (
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-lg whitespace-nowrap">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}; 