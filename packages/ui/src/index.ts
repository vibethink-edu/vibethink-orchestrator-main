// ============================================================================
// @vibethink/ui - Unified Component Library
// ============================================================================
// 100% Shadcn UI Compatible + VThink Extensions
// ============================================================================

// ===== CORE SHADCN COMPONENTS =====
// Layout
export * from './components/aspect-ratio';
export * from './components/card';
export * from './components/resizable';
export * from './components/scroll-area';
export * from './components/separator';
export * from './components/sheet';
export * from './components/skeleton';

// Navigation
export * from './components/breadcrumb';
export * from './components/dropdown-menu';
export * from './components/menubar';
export * from './components/navigation-menu';
export * from './components/pagination';
export * from './components/sidebar';
export * from './components/tabs';

// Forms
export * from './components/button';
export * from './components/button-group';
export * from './components/calendar';
export * from './components/checkbox';
// export * from './components/combobox'; // TODO: Requires @base-ui/react - use command for now
export * from './components/command';
export * from './components/form';
export * from './components/input';
export * from './components/input-group';
export * from './components/input-otp';
export * from './components/label';
export * from './components/native-select';
export * from './components/radio-group';
export * from './components/select';
export * from './components/slider';
export * from './components/switch';
export * from './components/textarea';
export * from './components/toggle';
export * from './components/toggle-group';

// Data Display
export * from './components/accordion';
export * from './components/avatar';
export * from './components/badge';
export * from './components/carousel';
export * from './components/chart';
export * from './components/empty';
export * from './components/item';
export * from './components/progress';
export * from './components/table';

// Feedback
export * from './components/alert';
export * from './components/alert-dialog';
export * from './components/dialog';
export * from './components/drawer';
export * from './components/hover-card';
export * from './components/popover';
export * from './components/sonner';
export * from './components/spinner';
export * from './components/tooltip';

// Utility
export * from './components/collapsible';
export * from './components/context-menu';
export * from './components/field';
export * from './components/kbd';

// ===== VTHINK CUSTOM COMPONENTS =====
export * from './components/dashboard-layout';
export * from './components/logo';
export * from './components/project-card';

// ===== PROVIDERS =====
export * from './providers/active-theme';

// ===== THEME CONFIGURATION =====
export * from './lib/themes';

// ===== VTHINK EXTENSIONS =====
// Theme Customizer (Complete)
export * from './components/extensions/theme-customizer';

// Count Animation
export { CountAnimation } from './components/extensions/count-animation';

// Premium components from Bundui integration
// TODO: Fix @/ imports in extension components before enabling
// export * from './components/extensions/kanban';
// export * from './components/extensions/timeline';
// export * from './components/extensions/reel';

// Note: Extensions need import path fixes before use:
// - kanban, timeline, reel: Fix @/lib/utils imports
// - minimal-tiptap: Fix @/components imports
// - prompt: Fix @/components imports
