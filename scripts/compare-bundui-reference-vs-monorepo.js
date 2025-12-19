const fs = require('fs');
const path = require('path');

console.log('🔍 COMPARACIÓN: Bundui Reference vs Bundui Monorepo\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Paths
const bunduitReferenceBase = 'C:\\IA Marcelo Labs\\bundui\\shadcn-ui-kit-dashboard';
const monorepoBase = path.join(__dirname, '../apps/dashboard');

// Función para extraer rutas del sidebar
function extractRoutesFromSidebar(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const routes = [];
  
  // Regex para encontrar href: "/..."
  const hrefRegex = /href:\s*["']([^"']+)["']/g;
  let match;
  
  while ((match = hrefRegex.exec(content)) !== null) {
    const route = match[1];
    // Normalizar rutas para comparación
    const normalized = route
      .replace('/dashboard-bundui/', '/')
      .replace('/dashboard/', '/');
    
    if (normalized.startsWith('/') && !normalized.includes('#')) {
      routes.push({
        original: route,
        normalized: normalized
      });
    }
  }
  
  return routes;
}

// Función para leer directorios de dashboards
function getDashboardDirectories(basePath) {
  try {
    const items = fs.readdirSync(basePath, { withFileTypes: true });
    return items
      .filter(item => item.isDirectory())
      .filter(item => !item.name.startsWith('.'))
      .filter(item => !['pages', 'apps', 'login', 'register', 'forgot-password'].includes(item.name))
      .map(item => item.name)
      .sort();
  } catch (error) {
    console.error(`❌ Error leyendo ${basePath}:`, error.message);
    return [];
  }
}

// 1. Comparar rutas del sidebar
console.log('📊 COMPARACIÓN DE SIDEBARS\n');

const referenceSidebarPath = path.join(bunduitReferenceBase, 'components/layout/sidebar/nav-main.tsx');
const monorepoSidebarPath = path.join(monorepoBase, 'src/shared/components/bundui-premium/components/layout/sidebar-bundui/nav-main.tsx');

console.log('📁 Bundui Reference Sidebar:', referenceSidebarPath);
console.log('📁 Bundui Monorepo Sidebar:', monorepoSidebarPath);
console.log('');

const referenceRoutes = extractRoutesFromSidebar(referenceSidebarPath);
const monorepoRoutes = extractRoutesFromSidebar(monorepoSidebarPath);

console.log(`📋 Rutas en Reference: ${referenceRoutes.length}`);
console.log(`📋 Rutas en Monorepo: ${monorepoRoutes.length}`);
console.log('');

// Normalizar para comparación
const referenceNormalized = new Set(referenceRoutes.map(r => r.normalized));
const monorepoNormalized = new Set(monorepoRoutes.map(r => r.normalized));

// Encontrar diferencias
const onlyInReference = [...referenceNormalized].filter(r => !monorepoNormalized.has(r));
const onlyInMonorepo = [...monorepoNormalized].filter(r => !referenceNormalized.has(r));

if (onlyInReference.length > 0) {
  console.log('⚠️  RUTAS SOLO EN REFERENCE:');
  onlyInReference.forEach(r => console.log(`   - ${r}`));
  console.log('');
}

if (onlyInMonorepo.length > 0) {
  console.log('⚠️  RUTAS SOLO EN MONOREPO:');
  onlyInMonorepo.forEach(r => console.log(`   - ${r}`));
  console.log('');
}

if (onlyInReference.length === 0 && onlyInMonorepo.length === 0) {
  console.log('✅ SIDEBARS IDÉNTICOS (rutas normalizadas coinciden)\n');
}

// 2. Comparar directorios de dashboards
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📊 COMPARACIÓN DE DIRECTORIOS DE DASHBOARDS\n');

const referenceAppPath = path.join(bunduitReferenceBase, 'app/(dashboard)');
const monorepoAppPath = path.join(monorepoBase, 'app/dashboard-bundui');

console.log('📁 Bundui Reference App:', referenceAppPath);
console.log('📁 Bundui Monorepo App:', monorepoAppPath);
console.log('');

const referenceDashboards = getDashboardDirectories(referenceAppPath);
const monorepoaDashboards = getDashboardDirectories(monorepoAppPath);

console.log(`📋 Dashboards en Reference: ${referenceDashboards.length}`);
referenceDashboards.forEach(d => console.log(`   ✓ ${d}`));
console.log('');

console.log(`📋 Dashboards en Monorepo: ${monorepoaDashboards.length}`);
monorepoaDashboards.forEach(d => console.log(`   ✓ ${d}`));
console.log('');

// Encontrar diferencias
const onlyInReferenceDir = referenceDashboards.filter(d => !monorepoaDashboards.includes(d));
const onlyInMonorepoDir = monorepoaDashboards.filter(d => !referenceDashboards.includes(d));

if (onlyInReferenceDir.length > 0) {
  console.log('⚠️  DASHBOARDS SOLO EN REFERENCE:');
  onlyInReferenceDir.forEach(d => console.log(`   - ${d}`));
  console.log('');
}

if (onlyInMonorepoDir.length > 0) {
  console.log('⚠️  DASHBOARDS SOLO EN MONOREPO:');
  onlyInMonorepoDir.forEach(d => console.log(`   - ${d}`));
  console.log('');
}

const commonDashboards = referenceDashboards.filter(d => monorepoaDashboards.includes(d));
console.log(`✅ DASHBOARDS COMUNES: ${commonDashboards.length}`);
commonDashboards.forEach(d => console.log(`   ✓ ${d}`));
console.log('');

// 3. Resumen
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📊 RESUMEN DE COMPARACIÓN\n');

const sidebarMatch = onlyInReference.length === 0 && onlyInMonorepo.length === 0;
const directoriesMatch = onlyInReferenceDir.length === 0 && onlyInMonorepoDir.length === 0;

if (sidebarMatch) {
  console.log('✅ Sidebars: MATCH PERFECTO');
} else {
  console.log(`❌ Sidebars: ${onlyInReference.length + onlyInMonorepo.length} diferencias encontradas`);
}

if (directoriesMatch) {
  console.log('✅ Directorios: MATCH PERFECTO');
} else {
  console.log(`❌ Directorios: ${onlyInReferenceDir.length + onlyInMonorepoDir.length} diferencias encontradas`);
}

console.log('');

if (sidebarMatch && directoriesMatch) {
  console.log('🎉 CONCLUSIÓN: Bundui Reference y Bundui Monorepo están perfectamente sincronizados\n');
  process.exit(0);
} else {
  console.log('⚠️  CONCLUSIÓN: Hay diferencias entre Reference y Monorepo\n');
  console.log('📝 RECOMENDACIONES:\n');
  
  if (!sidebarMatch) {
    console.log('   1. Revisar nav-main.tsx del monorepo');
    console.log('   2. Sincronizar rutas faltantes o comentar las que no existen');
  }
  
  if (!directoriesMatch) {
    console.log('   3. Revisar directorios de dashboards');
    console.log('   4. Copiar dashboards faltantes o eliminar referencias obsoletas');
  }
  
  console.log('');
  process.exit(1);
}


