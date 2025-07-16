import React, { useState } from "react";
import { faBell, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeToggle } from "./ThemeToggle";

export const HeaderMenu: React.FC = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-30 flex items-center justify-end gap-4 px-8 py-3 pointer-events-none select-none" style={{height: 64}}>
      <div className="flex items-center gap-4 pointer-events-auto">
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none"
          aria-label="Notificaciones"
          onClick={() => setNotifOpen((o) => !o)}
        >
          <FontAwesomeIcon icon={faBell} className="text-xl text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>
        {notifOpen && (
          <div className="absolute right-24 top-16 bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-4 min-w-[220px] transition-opacity duration-200 animate-fade-in z-40">
            <span className="text-gray-700 dark:text-gray-200 text-sm">No hay notificaciones nuevas.</span>
          </div>
        )}
        <ThemeToggle />
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none"
          aria-label="Menú de usuario"
          onClick={() => setUserOpen((o) => !o)}
        >
          <FontAwesomeIcon icon={faUserCircle} className="text-2xl text-gray-600 dark:text-gray-300" />
        </button>
        {userOpen && (
          <div className="absolute right-8 top-16 bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-4 min-w-[180px] transition-opacity duration-200 animate-fade-in z-40">
            <span className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Usuario Demo</span>
            <button className="w-full text-left text-sm text-gray-600 dark:text-gray-300 py-1 hover:underline">Perfil</button>
            <button className="w-full text-left text-sm text-gray-600 dark:text-gray-300 py-1 hover:underline">Cerrar sesión</button>
          </div>
        )}
      </div>
    </header>
  );
}; 