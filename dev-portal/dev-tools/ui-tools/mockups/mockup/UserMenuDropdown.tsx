import React from 'react';

interface UserMenuDropdownProps {
  open: boolean;
}

/**
 * Menú desplegable de usuario, elegante y minimalista.
 */
const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({ open }) => {
  if (!open) return null;
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 z-50 animate-fade-in">
      <ul className="py-2">
        <li>
          <a href="#" className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">Perfil</a>
        </li>
        <li>
          <a href="#" className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">Configuración</a>
        </li>
        <li>
          <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">Cerrar sesión</a>
        </li>
      </ul>
    </div>
  );
};

export default UserMenuDropdown; 