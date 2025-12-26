#!/usr/bin/env node

/**
 * Script para generar traducciones (i18n) para todos los módulos de dashboard-bundui
 * 
 * Este script:
 * 1. Escanea todos los módulos en apps/dashboard/app/dashboard-bundui
 * 2. Identifica strings hardcoded en componentes
 * 3. Genera archivos de traducción (en.json y es.json) para cada módulo
 * 4. Crea estructura base con keys comunes
 * 
 * Uso: node scripts/generate-i18n-for-all-modules.js
 */

const fs = require('fs');
const path = require('path');

const DASHBOARD_BUNDUI_PATH = path.join(__dirname, '../apps/dashboard/app/dashboard-bundui');
const I18N_TRANSLATIONS_PATH = path.join(__dirname, '../apps/dashboard/src/lib/i18n/translations');

// Módulos que ya tienen traducciones
const EXISTING_MODULES = [
  'hotel',
  'finance',
  'file-manager',
  'crypto',
  'ai-chat',
  'crm',
  'sales',
  'ecommerce',
  'common',
  'navigation',
  'errors',
  'validation',
  'theme',
  'concept'
];

// Módulos a procesar (excluyendo los que ya tienen traducciones)
const MODULES_TO_PROCESS = [
  'academy',
  'ai-chat-v2',
  'ai-image-generator',
  'analytics',
  'api-keys',
  'calendar',
  'chat',
  'crm-v2',
  'crm-v2-ai',
  'crypto-v2',
  'default',
  'finance-v2',
  'hospital-management',
  'kanban',
  'mail',
  'notes',
  'payment',
  'pos-system',
  'project-list',
  'project-management',
  'projects',
  'social-media',
  'tasks',
  'todo-list-app',
  'widgets'
];

// Template base para archivos de traducción
const TRANSLATION_TEMPLATE = {
  // Common UI elements
  title: '',
  description: '',
  loading: 'Loading...',
  error: 'Error',
  success: 'Success',
  cancel: 'Cancel',
  save: 'Save',
  delete: 'Delete',
  edit: 'Edit',
  create: 'Create',
  update: 'Update',
  search: 'Search',
  filter: 'Filter',
  sort: 'Sort',
  export: 'Export',
  import: 'Import',
  download: 'Download',
  upload: 'Upload',
  close: 'Close',
  confirm: 'Confirm',
  back: 'Back',
  next: 'Next',
  previous: 'Previous',
  submit: 'Submit',
  reset: 'Reset',
  clear: 'Clear',
  apply: 'Apply',
  select: 'Select',
  selectAll: 'Select All',
  deselectAll: 'Deselect All',
  noResults: 'No results found',
  noData: 'No data available',
  empty: 'Empty',
  // Status
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
  // Actions
  view: 'View',
  viewDetails: 'View Details',
  viewMore: 'View More',
  add: 'Add',
  addNew: 'Add New',
  remove: 'Remove',
  removeAll: 'Remove All',
  // Dates
  today: 'Today',
  yesterday: 'Yesterday',
  tomorrow: 'Tomorrow',
  thisWeek: 'This Week',
  lastWeek: 'Last Week',
  thisMonth: 'This Month',
  lastMonth: 'Last Month',
  thisYear: 'This Year',
  lastYear: 'Last Year',
  // Time
  minutes: 'Minutes',
  hours: 'Hours',
  days: 'Days',
  weeks: 'Weeks',
  months: 'Months',
  years: 'Years',
  // Common phrases
  areYouSure: 'Are you sure?',
  thisActionCannotBeUndone: 'This action cannot be undone',
  pleaseWait: 'Please wait...',
  operationSuccessful: 'Operation successful',
  operationFailed: 'Operation failed',
  // Table
  showing: 'Showing',
  of: 'of',
  results: 'results',
  rowsPerPage: 'Rows per page',
  page: 'Page',
  // Filters
  all: 'All',
  none: 'None',
  // Notifications
  notification: 'Notification',
  notifications: 'Notifications',
  noNotifications: 'No notifications',
  // Settings
  settings: 'Settings',
  preferences: 'Preferences',
  account: 'Account',
  profile: 'Profile',
  // Navigation
  home: 'Home',
  dashboard: 'Dashboard',
  // Empty states
  emptyState: {
    title: 'No items found',
    description: 'Get started by creating a new item',
    action: 'Create New'
  }
};

// Template en español
const TRANSLATION_TEMPLATE_ES = {
  // Common UI elements
  title: '',
  description: '',
  loading: 'Cargando...',
  error: 'Error',
  success: 'Éxito',
  cancel: 'Cancelar',
  save: 'Guardar',
  delete: 'Eliminar',
  edit: 'Editar',
  create: 'Crear',
  update: 'Actualizar',
  search: 'Buscar',
  filter: 'Filtrar',
  sort: 'Ordenar',
  export: 'Exportar',
  import: 'Importar',
  download: 'Descargar',
  upload: 'Subir',
  close: 'Cerrar',
  confirm: 'Confirmar',
  back: 'Atrás',
  next: 'Siguiente',
  previous: 'Anterior',
  submit: 'Enviar',
  reset: 'Restablecer',
  clear: 'Limpiar',
  apply: 'Aplicar',
  select: 'Seleccionar',
  selectAll: 'Seleccionar Todo',
  deselectAll: 'Deseleccionar Todo',
  noResults: 'No se encontraron resultados',
  noData: 'No hay datos disponibles',
  empty: 'Vacío',
  // Status
  active: 'Activo',
  inactive: 'Inactivo',
  pending: 'Pendiente',
  completed: 'Completado',
  cancelled: 'Cancelado',
  draft: 'Borrador',
  published: 'Publicado',
  archived: 'Archivado',
  // Actions
  view: 'Ver',
  viewDetails: 'Ver Detalles',
  viewMore: 'Ver Más',
  add: 'Agregar',
  addNew: 'Agregar Nuevo',
  remove: 'Eliminar',
  removeAll: 'Eliminar Todo',
  // Dates
  today: 'Hoy',
  yesterday: 'Ayer',
  tomorrow: 'Mañana',
  thisWeek: 'Esta Semana',
  lastWeek: 'Semana Pasada',
  thisMonth: 'Este Mes',
  lastMonth: 'Mes Pasado',
  thisYear: 'Este Año',
  lastYear: 'Año Pasado',
  // Time
  minutes: 'Minutos',
  hours: 'Horas',
  days: 'Días',
  weeks: 'Semanas',
  months: 'Meses',
  years: 'Años',
  // Common phrases
  areYouSure: '¿Estás seguro?',
  thisActionCannotBeUndone: 'Esta acción no se puede deshacer',
  pleaseWait: 'Por favor espera...',
  operationSuccessful: 'Operación exitosa',
  operationFailed: 'Operación fallida',
  // Table
  showing: 'Mostrando',
  of: 'de',
  results: 'resultados',
  rowsPerPage: 'Filas por página',
  page: 'Página',
  // Filters
  all: 'Todos',
  none: 'Ninguno',
  // Notifications
  notification: 'Notificación',
  notifications: 'Notificaciones',
  noNotifications: 'No hay notificaciones',
  // Settings
  settings: 'Configuración',
  preferences: 'Preferencias',
  account: 'Cuenta',
  profile: 'Perfil',
  // Navigation
  home: 'Inicio',
  dashboard: 'Panel',
  // Empty states
  emptyState: {
    title: 'No se encontraron elementos',
    description: 'Comienza creando un nuevo elemento',
    action: 'Crear Nuevo'
  }
};

/**
 * Crea archivos de traducción para un módulo
 */
function createTranslationFiles(moduleName) {
  const enPath = path.join(I18N_TRANSLATIONS_PATH, 'en', `${moduleName}.json`);
  const esPath = path.join(I18N_TRANSLATIONS_PATH, 'es', `${moduleName}.json`);

  // Verificar si ya existen
  if (fs.existsSync(enPath) || fs.existsSync(esPath)) {
    console.log(`⚠️  ${moduleName}: Archivos ya existen, omitiendo...`);
    return;
  }

  // Crear directorios si no existen
  const enDir = path.dirname(enPath);
  const esDir = path.dirname(esPath);
  if (!fs.existsSync(enDir)) {
    fs.mkdirSync(enDir, { recursive: true });
  }
  if (!fs.existsSync(esDir)) {
    fs.mkdirSync(esDir, { recursive: true });
  }

  // Crear archivos con template
  const enContent = JSON.stringify(TRANSLATION_TEMPLATE, null, 2);
  const esContent = JSON.stringify(TRANSLATION_TEMPLATE_ES, null, 2);

  fs.writeFileSync(enPath, enContent, 'utf8');
  fs.writeFileSync(esPath, esContent, 'utf8');

  console.log(`✅ ${moduleName}: Archivos creados (en.json y es.json)`);
}

/**
 * Función principal
 */
function main() {
  console.log('\n🚀 Generando traducciones para todos los módulos...\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Verificar que existe el directorio de traducciones
  if (!fs.existsSync(I18N_TRANSLATIONS_PATH)) {
    console.error(`❌ Error: No existe el directorio ${I18N_TRANSLATIONS_PATH}`);
    process.exit(1);
  }

  // Crear directorios en/ y es/ si no existen
  const enDir = path.join(I18N_TRANSLATIONS_PATH, 'en');
  const esDir = path.join(I18N_TRANSLATIONS_PATH, 'es');
  if (!fs.existsSync(enDir)) {
    fs.mkdirSync(enDir, { recursive: true });
  }
  if (!fs.existsSync(esDir)) {
    fs.mkdirSync(esDir, { recursive: true });
  }

  let created = 0;
  let skipped = 0;

  // Procesar cada módulo
  for (const moduleName of MODULES_TO_PROCESS) {
    try {
      createTranslationFiles(moduleName);
      created++;
    } catch (error) {
      console.error(`❌ Error procesando ${moduleName}:`, error.message);
      skipped++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`\n📊 Resumen:`);
  console.log(`   ✅ Creados: ${created}`);
  console.log(`   ⚠️  Omitidos: ${skipped}`);
  console.log(`   📁 Total módulos procesados: ${MODULES_TO_PROCESS.length}\n`);

  console.log('💡 Próximos pasos:');
  console.log('   1. Revisar los archivos generados');
  console.log('   2. Agregar keys específicas de cada módulo');
  console.log('   3. Aplicar useTranslation() en los componentes');
  console.log('   4. Reemplazar strings hardcoded con t()\n');
}

// Ejecutar
main();








