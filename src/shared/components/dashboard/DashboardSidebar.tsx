import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Sidebar reutilizable para dashboards VibeThink.
 * Permite personalizar los enlaces y el comportamiento de cierre.
 *
 * @param title Título del sidebar (por defecto: VibeThink)
 * @param links Enlaces principales de navegación
 * @param modules Lista de módulos a mostrar
 * @param onClose Función para cerrar el sidebar (opcional)
 */
export interface DashboardSidebarProps {
  title?: string;
  links?: { label: string; to: string }[];
  modules?: string[];
  onClose?: () => void;
}

const defaultLinks = [
  { label: 'Ir a Dashboard 1', to: '/dashboard' },
  { label: 'Ir a Dashboard 2', to: '/dashboard2' },
  { label: 'Ir a Dashboard 3', to: '/dashboard3' },
];

const defaultModules = [
  'Dashboard',
  'CRM & Sales',
  'AI & Automation',
  'Documentos',
  'Comunicación',
  'Administración',
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  title = 'VibeThink',
  links = defaultLinks,
  modules = defaultModules,
  onClose,
}) => {
  return (
    <aside className="w-64 h-full bg-white border-r flex flex-col font-sans">
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 flex items-center justify-center rounded bg-gradient-to-br from-purple-600 to-pink-600">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <span className="font-bold text-lg tracking-tight">{title}</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">✕</button>
        )}
      </div>
      {/* Navegación principal y enlaces a otros dashboards */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="block px-2 py-1 rounded hover:bg-gray-100 font-medium text-blue-700">
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-4 text-xs text-gray-400 uppercase tracking-wider">Módulos</li>
          {modules.map((mod) => (
            <li key={mod}>
              <a href="#" className="block px-2 py-1 rounded hover:bg-gray-100">{mod}</a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar; 