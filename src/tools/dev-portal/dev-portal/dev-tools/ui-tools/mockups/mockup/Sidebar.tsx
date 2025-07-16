import React from 'react';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

/**
 * Sidebar colapsable, minimalista, con iconos FontAwesome y tooltips.
 * Inspirado en Google AI Studio.
 */
const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  return (
    <aside className={`transition-all duration-300 bg-neutral-900 text-neutral-100 h-full flex flex-col ${open ? 'w-56' : 'w-16'} shadow-lg z-20`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-800">
        <span className="font-bold text-lg tracking-tight">{open ? 'AI Studio' : 'AI'}</span>
        <button onClick={onToggle} className="p-2 rounded hover:bg-neutral-800 transition" title="Colapsar barra">
          <i className={`fas fa-angle-${open ? 'left' : 'right'}`}></i>
        </button>
      </div>
      <nav className="flex-1 flex flex-col gap-2 mt-4">
        <SidebarItem icon="fas fa-comments" label="Chat" open={open} />
        <SidebarItem icon="fas fa-wave-square" label="Stream" open={open} />
        <SidebarItem icon="fas fa-image" label="Generate Media" open={open} />
        <SidebarItem icon="fas fa-cubes" label="Build" open={open} />
        <SidebarItem icon="fas fa-history" label="History" open={open} />
      </nav>
    </aside>
  );
};

interface SidebarItemProps {
  icon: string;
  label: string;
  open: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, open }) => (
  <div className="group flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-neutral-800 rounded transition">
    <i className={`${icon} text-lg`} />
    {open && <span className="text-sm font-medium">{label}</span>}
    {!open && (
      <span className="absolute left-16 bg-neutral-800 text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-30">
        {label}
      </span>
    )}
  </div>
);

export default Sidebar; 