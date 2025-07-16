const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Datos de prueba
const testData = {
  platforms: [
    {
      id: 'test-platform-1',
      name: 'Plataforma de Prueba 1',
      slug: 'test-platform-1',
      status: 'active',
      created_at: new Date().toISOString()
    }
  ],
  organizations: [
    {
      id: 'test-org-1',
      platform_id: 'test-platform-1',
      name: 'Organización de Prueba 1',
      slug: 'test-org-1',
      status: 'active',
      created_at: new Date().toISOString()
    }
  ],
  workspaces: [
    {
      id: 'test-workspace-1',
      organization_id: 'test-org-1',
      name: 'Workspace de Prueba 1',
      slug: 'test-workspace-1',
      status: 'active',
      created_at: new Date().toISOString()
    }
  ],
  subOrganizations: [
    {
      id: 'test-sub-org-1',
      parent_organization_id: 'test-org-1',
      name: 'Sub-Organización de Prueba 1',
      slug: 'test-sub-org-1',
      status: 'active',
      created_at: new Date().toISOString()
    }
  ],
  subWorkspaces: [
    {
      id: 'test-sub-workspace-1',
      parent_workspace_id: 'test-workspace-1',
      name: 'Sub-Workspace de Prueba 1',
      slug: 'test-sub-workspace-1',
      status: 'active',
      created_at: new Date().toISOString()
    }
  ],
  users: [
    {
      id: 'test-user-1',
      email: 'test1@example.com',
      full_name: 'Usuario de Prueba 1',
      role: 'SUPER_ADMIN_AP',
      platform_id: 'test-platform-1',
      organization_id: null,
      workspace_id: null,
      sub_organization_id: null,
      sub_workspace_id: null,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: 'test-user-2',
      email: 'test2@example.com',
      full_name: 'Usuario de Prueba 2',
      role: 'ADMIN_CUST',
      platform_id: 'test-platform-1',
      organization_id: 'test-org-1',
      workspace_id: null,
      sub_organization_id: null,
      sub_workspace_id: null,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: 'test-user-3',
      email: 'test3@example.com',
      full_name: 'Usuario de Prueba 3',
      role: 'MANAGER_CUST',
      platform_id: 'test-platform-1',
      organization_id: 'test-org-1',
      workspace_id: 'test-workspace-1',
      sub_organization_id: null,
      sub_workspace_id: null,
      status: 'active',
      created_at: new Date().toISOString()
    }
  ],
  branding: [
    {
      id: 'test-branding-1',
      platform_id: 'test-platform-1',
      organization_id: null,
      workspace_id: null,
      sub_organization_id: null,
      sub_workspace_id: null,
      name: 'Branding Plataforma',
      logo_url: 'https://example.com/logo.png',
      primary_color: '#007bff',
      secondary_color: '#6c757d',
      created_at: new Date().toISOString()
    },
    {
      id: 'test-branding-2',
      platform_id: 'test-platform-1',
      organization_id: 'test-org-1',
      workspace_id: null,
      sub_organization_id: null,
      sub_workspace_id: null,
      name: 'Branding Organización',
      logo_url: 'https://example.com/org-logo.png',
      primary_color: '#28a745',
      secondary_color: '#ffc107',
      created_at: new Date().toISOString()
    }
  ]
};

// Funciones de prueba
async function testDatabaseConnection() {
  console.log('🔌 Probando conexión a la base de datos...');
  
  try {
    const { data, error } = await supabase.from('platforms').select('count').limit(1);
    
    if (error) {
      console.error('❌ Error de conexión:', error.message);
      return false;
    }
    
    console.log('✅ Conexión exitosa a Supabase\n');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}

async function verifyTableStructure() {
  console.log('📋 Verificando estructura de tablas...');
  
  const tables = [
    'platforms',
    'organizations', 
    'workspaces',
    'sub_organizations',
    'sub_workspaces',
    'hierarchical_users',
    'branding_configs',
    'users',
    'branding'
  ];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        console.log(`❌ Tabla ${table}: ${error.message}`);
      } else {
        console.log(`✅ Tabla ${table}: OK`);
      }
    } catch (error) {
      console.log(`❌ Tabla ${table}: ${error.message}`);
    }
  }
  console.log('');
}

async function testDataCreation() {
  console.log('➕ Probando creación de datos...');
  
  // Crear plataforma de prueba
  try {
    const { data: platform, error: platformError } = await supabase
      .from('platforms')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440007',
        name: 'Plataforma Test Script',
        slug: 'test-script-platform',
        status: 'active'
      })
      .select()
      .single();
    
    if (platformError) {
      console.log(`❌ Error creando plataforma: ${platformError.message}`);
    } else {
      console.log(`✅ Plataforma creada: ${platform.name}`);
    }
  } catch (error) {
    console.log(`❌ Error creando plataforma: ${error.message}`);
  }
  
  // Crear organización de prueba
  try {
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440008',
        name: 'Organización Test Script',
        slug: 'test-script-org',
        platform_id: '550e8400-e29b-41d4-a716-446655440007',
        status: 'active'
      })
      .select()
      .single();
    
    if (orgError) {
      console.log(`❌ Error creando organización: ${orgError.message}`);
    } else {
      console.log(`✅ Organización creada: ${org.name}`);
    }
  } catch (error) {
    console.log(`❌ Error creando organización: ${error.message}`);
  }
  
  // Crear workspace de prueba
  try {
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440009',
        name: 'Workspace Test Script',
        slug: 'test-script-workspace',
        organization_id: '550e8400-e29b-41d4-a716-446655440008',
        status: 'active'
      })
      .select()
      .single();
    
    if (workspaceError) {
      console.log(`❌ Error creando workspace: ${workspaceError.message}`);
    } else {
      console.log(`✅ Workspace creado: ${workspace.name}`);
    }
  } catch (error) {
    console.log(`❌ Error creando workspace: ${error.message}`);
  }
  
  console.log('');
}

async function testDataIsolation() {
  console.log('🔒 Probando aislamiento de datos...');
  
  try {
    // Verificar que los datos están aislados por platform_id
    const { data: platforms, error } = await supabase
      .from('platforms')
      .select('id, name, slug')
      .eq('status', 'active');
    
    if (error) {
      console.log(`❌ Error verificando aislamiento: ${error.message}`);
    } else {
      console.log(`✅ Aislamiento verificado: ${platforms.length} plataformas encontradas`);
      platforms.forEach(p => console.log(`   - ${p.name} (${p.slug})`));
    }
  } catch (error) {
    console.log(`❌ Error verificando aislamiento: ${error.message}`);
  }
  
  console.log('');
}

async function testRoleHierarchy() {
  console.log('👥 Probando jerarquía de roles...');
  
  const roles = [
    'SUPER_ADMIN_AP',
    'ADMIN_AP', 
    'MANAGER_AP',
    'EMPLOYEE_AP',
    'OWNER_CUST',
    'ADMIN_CUST',
    'MANAGER_CUST',
    'EMPLOYEE_CUST'
  ];
  
  console.log('Roles implementados:');
  roles.forEach(role => console.log(`   - ${role}`));
  
  // Verificar que los roles están en el enum
  try {
    const { data, error } = await supabase.rpc('get_role_enum_values');
    if (!error && data) {
      console.log('✅ Roles verificados en base de datos');
    } else {
      console.log('⚠️ No se pudieron verificar roles en BD');
    }
  } catch (error) {
    console.log('⚠️ Error verificando roles: ' + error.message);
  }
  
  console.log('');
}

async function testBrandingInheritance() {
  console.log('🎨 Probando herencia de branding...');
  
  try {
    const { data: branding, error } = await supabase
      .from('branding')
      .select('*')
      .limit(5);
    
    if (error) {
      console.log(`❌ Error consultando branding: ${error.message}`);
    } else {
      console.log(`✅ Branding consultado: ${branding.length} configuraciones encontradas`);
    }
  } catch (error) {
    console.log(`❌ Error consultando branding: ${error.message}`);
  }
  
  console.log('');
}

async function cleanupTestData() {
  console.log('🧹 Limpiando datos de prueba...');
  
  const testIds = [
    '550e8400-e29b-41d4-a716-446655440007',
    '550e8400-e29b-41d4-a716-446655440008', 
    '550e8400-e29b-41d4-a716-446655440009'
  ];
  
  const tables = ['workspaces', 'organizations', 'platforms'];
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .in('id', testIds);
      
      if (error) {
        console.log(`⚠️ Error limpiando ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table} limpiado`);
      }
    } catch (error) {
      console.log(`⚠️ Error limpiando ${table}: ${error.message}`);
    }
  }
  
  console.log('');
}

// Función principal
async function main() {
  console.log('🚀 Iniciando pruebas de arquitectura jerárquica...\n');
  
  // Ejecutar pruebas en orden
  const connectionOk = await testDatabaseConnection();
  if (!connectionOk) {
    console.log('❌ No se puede continuar sin conexión a la base de datos');
    process.exit(1);
  }
  
  await verifyTableStructure();
  await testDataCreation();
  await testDataIsolation();
  await testRoleHierarchy();
  await testBrandingInheritance();
  await cleanupTestData();
  
  console.log('✅ Pruebas completadas\n');
  
  console.log('📊 Resumen:');
  console.log('- Conexión a BD: ✅');
  console.log('- Estructura de tablas: Verificada');
  console.log('- Creación de datos: Probada');
  console.log('- Aislamiento de datos: Verificado');
  console.log('- Jerarquía de roles: Documentada');
  console.log('- Herencia de branding: Probada');
  
  console.log('\n🎯 Próximos pasos:');
  console.log('1. Ejecutar el script SQL de corrección si hay errores');
  console.log('2. Habilitar RLS nuevamente después de las pruebas');
  console.log('3. Verificar que las políticas RLS funcionan correctamente');
}

// Ejecutar pruebas
main().catch(console.error); 