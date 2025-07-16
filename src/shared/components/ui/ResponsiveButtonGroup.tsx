import React from 'react';
import { Button } from './button';
import { TooltipWrapper } from './TooltipWrapper';
import { cn } from '@/lib/utils';
import { useResponsiveLayout } from '@/shared/hooks/hooks/useResponsiveLayout';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';

interface ButtonAction {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  tooltip?: string;
  primary?: boolean;
}

interface ResponsiveButtonGroupProps {
  actions: ButtonAction[];
  className?: string;
  maxVisible?: number;
}

/**
 * Grupo de botones que se adapta automáticamente al espacio disponible
 * Colapsa botones en un menú overflow cuando no hay espacio suficiente
 */
const ResponsiveButtonGroup: React.FC<ResponsiveButtonGroupProps> = ({
  actions,
  className,
  maxVisible = 3
}) => {
  const { shouldCollapseButtons, buttonSize, isMobile } = useResponsiveLayout();

  // Determinar cuántos botones mostrar según el espacio
  const visibleCount = shouldCollapseButtons 
    ? (isMobile ? 1 : 2) 
    : Math.min(actions.length, maxVisible);

  // En móvil, priorizar botones primarios
  const sortedActions = isMobile 
    ? [...actions.filter(a => a.primary), ...actions.filter(a => !a.primary)]
    : actions;

  const finalVisible = sortedActions.slice(0, visibleCount);
  const finalHidden = sortedActions.slice(visibleCount);

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {/* Botones visibles */}
      {finalVisible.map((action, index) => (
        <TooltipWrapper key={index} content={action.tooltip || action.label}>
          <Button
            variant={action.variant || 'default'}
            size={buttonSize}
            onClick={action.onClick}
            className={cn(
              'flex-shrink-0',
              isMobile && !action.icon && 'min-w-0 px-2'
            )}
          >
            {action.icon && <action.icon className="w-4 h-4" />}
            {(!isMobile || !action.icon) && (
              <span className={cn(action.icon && 'ml-2', isMobile && 'text-xs')}>
                {action.label}
              </span>
            )}
          </Button>
        </TooltipWrapper>
      ))}

      {/* Menú overflow para botones ocultos */}
      {finalHidden.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TooltipWrapper content="Más acciones">
              <Button variant="outline" size={buttonSize}>
                <MoreHorizontal className="w-4 h-4" />
                {!isMobile && <span className="ml-2">Más</span>}
              </Button>
            </TooltipWrapper>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            {finalHidden.map((action, index) => (
              <DropdownMenuItem
                key={index}
                onClick={action.onClick}
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ResponsiveButtonGroup;
