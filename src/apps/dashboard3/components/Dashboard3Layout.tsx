import React from 'react';
import Dashboard3Sidebar from './Dashboard3Sidebar';
import Dashboard3RightPanel from './Dashboard3RightPanel';
import Dashboard3Main from './Dashboard3Main';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/components/ui/sheet';
import { Menu, MoreHorizontal } from 'lucide-react';

interface Dashboard3LayoutProps {
  leftOpen: boolean;
  setLeftOpen: (open: boolean) => void;
  rightOpen: boolean;
  setRightOpen: (open: boolean) => void;
}

const Dashboard3Layout: React.FC<Dashboard3LayoutProps> = ({ leftOpen, setLeftOpen, rightOpen, setRightOpen }) => {
  return (
    <div className="flex h-[calc(100vh-64px)] font-sans">
      {/* Sidebar izquierdo responsivo */}
      <div className="hidden md:block">
        {leftOpen && <Dashboard3Sidebar onClose={() => setLeftOpen(false)} />}
      </div>
      {/* Botón para abrir sidebar en móvil */}
      <div className="md:hidden fixed top-16 left-2 z-20">
        <Sheet>
          <SheetTrigger asChild>
            <button className="bg-white border rounded p-2 shadow"><Menu className="h-5 w-5" /></button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Dashboard3Sidebar onClose={() => setLeftOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
      {/* Panel central */}
      <main className="flex-1 overflow-auto p-4 md:p-8 bg-background min-w-0">
        <Dashboard3Main />
      </main>
      {/* Panel derecho responsivo */}
      <div className="hidden lg:block">
        {rightOpen && <Dashboard3RightPanel onClose={() => setRightOpen(false)} />}
      </div>
      {/* Botón para abrir panel derecho en móvil/tablet */}
      <div className="lg:hidden fixed top-16 right-2 z-20">
        <Sheet>
          <SheetTrigger asChild>
            <button className="bg-white border rounded p-2 shadow"><MoreHorizontal className="h-5 w-5" /></button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            <Dashboard3RightPanel onClose={() => setRightOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Dashboard3Layout; 