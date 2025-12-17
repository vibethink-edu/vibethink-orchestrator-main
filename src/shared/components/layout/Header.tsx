import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu';
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import ThemeSwitcher from '@/shared/components/ui/ThemeSwitcher';
import LanguageSwitcher from '@/shared/components/ui/LanguageSwitcher';

const sections = [
  { label: 'Dashboard 1', value: 'dashboard', url: '/src/apps/dashboard/index.html' },
  { label: 'Dashboard 2', value: 'dashboard2', url: '/src/apps/dashboard2/index.html' },
  { label: 'Dashboard 3', value: 'dashboard3', url: '/src/apps/dashboard3/index.html' },
  { label: 'Ecommerce', value: 'ecommerce', url: '#' },
  { label: 'Web Analytics', value: 'analytics', url: '#' },
  { label: 'CRM', value: 'crm', url: '#' },
];

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  showSettings?: boolean;
  className?: string;
  currentSection?: string;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onMenuToggle,
  isMenuOpen = false,
  showSearch = true,
  showNotifications = true,
  showSettings = true,
  className = '',
  currentSection = 'dashboard',
}) => {
  const { t } = useTranslation();

  const getRoleBadgeColor = (role: string) => {
    switch (role.toUpperCase()) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MANAGER':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'EMPLOYEE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'SUPPORT':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role.toUpperCase()) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ADMIN':
        return 'Admin';
      case 'MANAGER':
        return 'Manager';
      case 'EMPLOYEE':
        return 'Employee';
      case 'SUPPORT':
        return 'Support';
      default:
        return role;
    }
  };

  const handleSectionChange = (url: string) => {
    if (url && url !== '#') {
      window.location.href = url;
    }
  };

  return (
    <header className={`bg-background border-b border-border px-4 py-3 font-sans`} style={{ fontFamily: "'Geist', sans-serif" }}>
      <div className="flex items-center justify-between">
        {/* Left side - Logo + Dropdown */}
        <div className="flex items-center gap-4">
          {onMenuToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="lg:hidden"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 font-bold text-lg px-2 py-1 rounded hover:bg-gray-100">
                <span className="h-8 w-8 flex items-center justify-center rounded bg-gradient-to-br from-purple-600 to-pink-600">
                  {/* Logo SVG aquí, puedes poner un ícono o inicial */}
                  <span className="text-white text-xl font-bold">V</span>
                </span>
                VibeThink
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sections.map(section => (
                <DropdownMenuItem key={section.value} onClick={() => handleSectionChange(section.url)}>
                  {section.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center - Search */}
        {showSearch && (
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('header.search') || 'Buscar...'}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Right side - Actions and User */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher />
          {/* Theme Switcher */}
          <ThemeSwitcher />
          {/* Notifications */}
          {showNotifications && (
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
          )}
          {/* Settings */}
          {showSettings && (
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          )}
          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:flex sm:flex-col sm:items-start">
                    <span className="text-sm font-medium">{user.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getRoleBadgeColor(user.role)}`}
                    >
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user.name}
                </div>
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  {user.email}
                </div>
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('header.logout') || 'Cerrar sesión'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {/* Mobile Search */}
      {showSearch && (
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('header.search') || 'Buscar...'}
              className="pl-10"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 
