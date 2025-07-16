import React, { useState, useRef, useEffect } from 'react';
import UserMenuDropdown from './UserMenuDropdown';

interface HeaderMenuProps {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

/**
 * Header minimalista, solo menús y cajas sobrepuestas.
 * Incluye menú usuario, campanita de notificaciones y accesos rápidos.
 */
const HeaderMenu: React.FC<HeaderMenuProps> = ({ theme, setTheme }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Cierra el menú si se hace click fuera
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  return (
    <header className="flex items-center justify-end gap-4 px-6 py-3 relative z-10">
      <button className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition" title="Notificaciones">
        <i className="far fa-bell text-xl" />
      </button>
      <a href="#" className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition" title="Documentación">
        <i className="far fa-file-alt text-xl" />
      </a>
      <a href="#" className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition" title="Dashboard">
        <i className="fas fa-th-large text-xl" />
      </a>
      <button
        className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
        title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'} text-xl`} />
      </button>
      <div className="relative" ref={userMenuRef}>
        <button
          className="flex items-center gap-2 p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
          title="Usuario"
          onClick={() => setUserMenuOpen((v) => !v)}
        >
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-400 to-neutral-700 flex items-center justify-center text-lg font-bold text-white">M</span>
          <i className="fas fa-caret-down text-xs ml-1" />
        </button>
        <UserMenuDropdown open={userMenuOpen} />
      </div>
    </header>
  );
};

export default HeaderMenu; 