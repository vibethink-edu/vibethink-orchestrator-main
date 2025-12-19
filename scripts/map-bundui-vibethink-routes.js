/**
 * Script para mapear rutas correctamente:
 * - Bundui Premium (espejo original) → dashboard-bundui
 * - VibeThink (adaptados/migrados) → dashboard-vibethink
 */

const fs = require('fs');
const path = require('path');

const DASHBOARD_DIR = path.join(__dirname, '../apps/dashboard/app/(dashboard)');

// Dashboards de Bundui Premium (espejo original) - Deben apuntar a dashboard-bundui
const BUNDUI_PREMIUM_DASHBOARDS = new Set([
  // Dashboards principales
  'default',
  'academy',
  'analytics', // website-analytics en el menú pero analytics en bundui
  'hospital-management',
  'hotel',
  
  // Apps de Bundui
  'apps/chat',
  'apps/ai-image-generator',
  'apps/api-keys',
  
  // Pages de Bundui
  'pages/users',
  'pages/user-profile',
  'pages/profile',
  'pages/onboarding-flow',
  'pages/empty-states/01',
  'pages/empty-states/02',
  'pages/empty-states/03',
  'pages/settings',
  'pages/settings/account',
  'pages/settings/appearance',
  'pages/settings/billing',
  'pages/settings/display',
  'pages/settings/notifications',
  'pages/pricing/column',
  'pages/pricing/single',
  'pages/pricing/table',
  'pages/products',
  'pages/products/[id]',
  'pages/products/create',
  'pages/orders',
  'pages/orders/[id]',
  'pages/error/403',
  
  // E-commerce en bundui (original)
  'ecommerce',
  
  // CRM, Sales, Projects originales en bundui
  'crm',
  'sales',
  'projects' // project-management en el menú pero projects en bundui
]);

// Dashboards de VibeThink (adaptados/migrados) - Deben apuntar a dashboard-vibethink
const VIBETHINK_DASHBOARDS = new Set([
  'ai-chat',
  'calendar',
  'crm', // Migrado a vibethink
  'crypto',
  'ecommerce', // Migrado a vibethink
  'file-manager',
  'finance',
  'mail',
  'notes',
  'pos-system',
  'project-management',
  'sales', // Migrado a vibethink
  'tasks',
  'website-analytics'
]);

// Mapeo de nombres: ruta en re-export → nombre real en directorio
const ROUTE_MAPPING = {
  'website-analytics': 'analytics', // website-analytics en menú, analytics en bundui
  'project-management': 'projects' // project-management en menú, projects en bundui
};

function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function getDashboardNameFromPath(filePath) {
  // Extraer el nombre del dashboard desde la ruta relativa
  // ej: app/(dashboard)/crm/page.tsx → crm
  // ej: app/(dashboard)/dashboard/apps/chat/page.tsx → apps/chat
  const relativePath = path.relative(DASHBOARD_DIR, filePath);
  const parts = relativePath.split(path.sep);
  
  // Remover 'page.tsx' y construir el path
  const dirParts = parts.slice(0, -1);
  return dirParts.join('/');
}

function shouldPointToBundui(dashboardPath) {
  // Verificar si es un dashboard de Bundui Premium
  const pathParts = dashboardPath.split('/');
  
  // Si empieza con dashboard/, es una página de Bundui
  if (dashboardPath.startsWith('dashboard/')) {
    return true;
  }
  
  // Verificar nombres específicos
  if (BUNDUI_PREMIUM_DASHBOARDS.has(dashboardPath)) {
    return true;
  }
  
  // Verificar por partes del path
  for (const bunduiPath of BUNDUI_PREMIUM_DASHBOARDS) {
    if (dashboardPath.includes(bunduiPath) || bunduiPath.includes(dashboardPath)) {
      return true;
    }
  }
  
  return false;
}

function fixReExports() {
  console.log('🔍 Mapeando rutas: Bundui Premium → dashboard-bundui, VibeThink → dashboard-vibethink\n');
  
  const files = findTsxFiles(DASHBOARD_DIR);
  let updatedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Buscar export { default } from "../../../dashboard-XXX/..."
    const match = content.match(/export\s+{\s*default\s*}\s+from\s+['"](\.\.\/)+dashboard-(bundui|vibethink)\/([^'"]+)\/page['"]/);
    
    if (match) {
      const currentTarget = match[2]; // bundui o vibethink
      const dashboardPath = match[3]; // Path completo después de dashboard-*/
      const dashboardName = getDashboardNameFromPath(file);
      
      // Determinar a dónde debería apuntar
      const shouldBeBundui = shouldPointToBundui(dashboardPath) || shouldPointToBundui(dashboardName);
      const shouldBeVibethink = VIBETHINK_DASHBOARDS.has(dashboardName.split('/').pop());
      
      // Casos especiales de mapeo
      let targetPath = dashboardPath;
      if (dashboardName === 'website-analytics' && shouldBeVibethink) {
        targetPath = 'website-analytics';
      } else if (dashboardName === 'project-management' && shouldBeVibethink) {
        targetPath = 'project-management';
      } else if (dashboardName === 'website-analytics' && shouldBeBundui) {
        targetPath = 'analytics';
      } else if (dashboardName === 'project-management' && shouldBeBundui) {
        targetPath = 'projects';
      }
      
      let correctTarget = 'bundui';
      if (shouldBeVibethink && !shouldBeBundui) {
        correctTarget = 'vibethink';
      } else if (shouldBeBundui) {
        correctTarget = 'bundui';
      }
      
      // Solo actualizar si está incorrecto
      if (currentTarget !== correctTarget) {
        const newContent = content.replace(
          new RegExp(`dashboard-${currentTarget}`, 'g'),
          `dashboard-${correctTarget}`
        );
        
        // Ajustar el path si es necesario
        let finalContent = newContent;
        if (targetPath !== dashboardPath && shouldBeVibethink) {
          finalContent = newContent.replace(
            new RegExp(`dashboard-${correctTarget}/${dashboardPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
            `dashboard-${correctTarget}/${targetPath}`
          );
        } else if (targetPath !== dashboardPath && shouldBeBundui) {
          finalContent = newContent.replace(
            new RegExp(`dashboard-${correctTarget}/${dashboardPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
            `dashboard-${correctTarget}/${targetPath}`
          );
        }
        
        fs.writeFileSync(file, finalContent, 'utf-8');
        console.log(`✅ ${path.relative(DASHBOARD_DIR, file)}: ${currentTarget} → ${correctTarget} (${targetPath})`);
        updatedCount++;
      } else {
        skippedCount++;
      }
    }
  }

  console.log(`\n✨ Completado: ${updatedCount} archivos actualizados, ${skippedCount} ya correctos`);
}

fixReExports();



