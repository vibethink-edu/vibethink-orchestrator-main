/**
 * Script para mapear rutas correctamente:
 * 
 * REGLA: 
 * - Si existe en dashboard-bundui (espejo Bundui Premium) → dashboard-bundui
 * - Si NO existe en dashboard-bundui → dashboard-vibethink
 */

const fs = require('fs');
const path = require('path');

const DASHBOARD_DIR = path.join(__dirname, '../apps/dashboard/app/(dashboard)');
const BUNDUI_DIR = path.join(__dirname, '../apps/dashboard/app/dashboard-bundui');
const VIBETHINK_DIR = path.join(__dirname, '../apps/dashboard/app/dashboard-vibethink');

// Obtener lista de dashboards que existen en dashboard-bundui
function getBunduiDashboards() {
  const bunduiDashboards = new Set();
  
  function scanDir(dir, basePath = '') {
    const entries = fs.readdirSync(dir);
    
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      const relPath = basePath ? `${basePath}/${entry}` : entry;
      
      if (stat.isDirectory()) {
        // Si tiene page.tsx, es un dashboard
        const pagePath = path.join(fullPath, 'page.tsx');
        if (fs.existsSync(pagePath)) {
          bunduiDashboards.add(relPath);
        }
        // Seguir escaneando subdirectorios
        scanDir(fullPath, relPath);
      }
    });
  }
  
  if (fs.existsSync(BUNDUI_DIR)) {
    scanDir(BUNDUI_DIR);
  }
  
  return bunduiDashboards;
}

// Mapeo de nombres especiales (ruta en re-export → nombre real en bundui)
const SPECIAL_MAPPINGS = {
  'website-analytics': 'analytics', // En el menú es website-analytics, en bundui es analytics
  'project-management': 'projects'  // En el menú es project-management, en bundui es projects
};

function findTsxFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  
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

function getDashboardPathFromExport(content) {
  // Buscar: export { default } from "../../../dashboard-XXX/YYY/page"
  const match = content.match(/export\s+{\s*default\s*}\s+from\s+['"](\.\.\/)+dashboard-(bundui|vibethink)\/([^'"]+)\/page['"]/);
  if (match) {
    return {
      currentTarget: match[2], // bundui o vibethink
      dashboardPath: match[3]  // Path completo
    };
  }
  return null;
}

function getReExportDashboardName(filePath) {
  // Obtener el nombre del dashboard desde la ruta del archivo de re-export
  // ej: app/(dashboard)/crm/page.tsx → crm
  // ej: app/(dashboard)/dashboard/apps/chat/page.tsx → dashboard/apps/chat
  const relativePath = path.relative(DASHBOARD_DIR, filePath);
  const parts = relativePath.split(path.sep);
  return parts.slice(0, -1).join('/'); // Remover 'page.tsx'
}

function fixReExports() {
  console.log('🔍 Mapeando rutas basado en existencia real en directorios...\n');
  console.log('📋 Regla: Si existe en dashboard-bundui → bundui, si no → vibethink\n');
  
  const bunduiDashboards = getBunduiDashboards();
  console.log(`📦 Dashboards encontrados en dashboard-bundui: ${bunduiDashboards.size}`);
  console.log(Array.from(bunduiDashboards).slice(0, 10).join(', '), '...\n');
  
  const files = findTsxFiles(DASHBOARD_DIR);
  let updatedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const exportInfo = getDashboardPathFromExport(content);
    
    if (!exportInfo) continue;
    
    const { currentTarget, dashboardPath } = exportInfo;
    const reExportName = getReExportDashboardName(file);
    
    // Verificar si existe en bundui (considerando mapeos especiales)
    let bunduiPath = dashboardPath;
    
    // Aplicar mapeos especiales
    if (SPECIAL_MAPPINGS[reExportName]) {
      bunduiPath = SPECIAL_MAPPINGS[reExportName];
    }
    
    // Verificar existencia en bundui
    const existsInBundui = bunduiDashboards.has(bunduiPath) || bunduiDashboards.has(dashboardPath);
    
    // Determinar target correcto
    const correctTarget = existsInBundui ? 'bundui' : 'vibethink';
    
    // Ajustar path si es necesario (mapeos especiales)
    let finalPath = dashboardPath;
    if (correctTarget === 'bundui' && SPECIAL_MAPPINGS[reExportName]) {
      finalPath = SPECIAL_MAPPINGS[reExportName];
    } else if (correctTarget === 'vibethink' && reExportName === 'website-analytics' && dashboardPath === 'analytics') {
      finalPath = 'website-analytics';
    } else if (correctTarget === 'vibethink' && reExportName === 'project-management' && dashboardPath === 'projects') {
      finalPath = 'project-management';
    }
    
    // Solo actualizar si está incorrecto o el path es incorrecto
    if (currentTarget !== correctTarget || finalPath !== dashboardPath) {
      let newContent = content.replace(
        new RegExp(`dashboard-${currentTarget}/${dashboardPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
        `dashboard-${correctTarget}/${finalPath}`
      );
      
      fs.writeFileSync(file, newContent, 'utf-8');
      console.log(`✅ ${path.relative(DASHBOARD_DIR, file)}`);
      console.log(`   ${currentTarget}/${dashboardPath} → ${correctTarget}/${finalPath}`);
      console.log(`   (${existsInBundui ? 'Existe en bundui' : 'No existe en bundui, usando vibethink'})\n`);
      updatedCount++;
    } else {
      skippedCount++;
    }
  }

  console.log(`\n✨ Completado: ${updatedCount} archivos actualizados, ${skippedCount} ya correctos`);
}

fixReExports();
















