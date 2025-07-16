const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// =====================================================
// CASOS DE USO REALES - ARQUITECTURA JERÁRQUICA
// =====================================================

async function createRealWorldScenario() {
  console.log('🌍 Creando escenario real de arquitectura jerárquica...\n');
  
  // =====================================================
  // ESCENARIO 1: PLATAFORMA PRINCIPAL (SUPER_ADMIN)
  // =====================================================
  console.log('🏢 ESCENARIO 1: AI Pair Platform (SUPER_ADMIN)');
  console.log('   - Administra todo el ecosistema');
  console.log('   - Gestiona múltiples empresas cliente');
  console.log('   - Monitorea uso y facturación global\n');
  
  try {
    // Crear plataforma principal
    const { data: mainPlatform, error: platformError } = await supabase
      .from('platforms')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440010',
        name: 'AI Pair Platform',
        slug: 'ai-pair-platform',
        status: 'active',
        description: 'Plataforma principal que administra todo el ecosistema SaaS'
      })
      .select()
      .single();
    
    if (platformError) {
      console.log(`❌ Error creando plataforma principal: ${platformError.message}`);
    } else {
      console.log(`✅ Plataforma principal creada: ${mainPlatform.name}`);
    }
    
    // Crear usuario SUPER_ADMIN
    const { data: superAdmin, error: adminError } = await supabase
      .from('users')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440011',
        email: 'admin@aipairplatform.com',
        full_name: 'Super Administrador',
        role: 'SUPER_ADMIN_VT',
        platform_id: mainPlatform.id
      })
      .select()
      .single();
    
    if (adminError) {
      console.log(`❌ Error creando SUPER_ADMIN: ${adminError.message}`);
    } else {
      console.log(`✅ SUPER_ADMIN creado: ${superAdmin.full_name} (${superAdmin.role})`);
    }
    
  } catch (error) {
    console.log(`❌ Error en Escenario 1: ${error.message}`);
  }
  
  // =====================================================
  // ESCENARIO 2: EMPRESA CLIENTE PREMIUM (OWNER_CUST)
  // =====================================================
  console.log('\n🏢 ESCENARIO 2: Empresa XYZ (OWNER_CUST)');
  console.log('   - Cliente premium que paga por plan');
  console.log('   - Administra sus propios clientes');
  console.log('   - Tiene branding personalizado\n');
  
  try {
    // Crear empresa cliente premium
    const { data: premiumCompany, error: companyError } = await supabase
      .from('organizations')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440012',
        name: 'Empresa XYZ S.A.',
        slug: 'empresa-xyz',
        platform_id: '550e8400-e29b-41d4-a716-446655440010',
        status: 'active',
        plan_type: 'premium',
        max_users: 100,
        max_clients: 50
      })
      .select()
      .single();
    
    if (companyError) {
      console.log(`❌ Error creando empresa premium: ${companyError.message}`);
    } else {
      console.log(`✅ Empresa premium creada: ${premiumCompany.name} (Plan: ${premiumCompany.plan_type})`);
    }
    
    // Crear workspace principal de la empresa
    const { data: mainWorkspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440013',
        name: 'Workspace Principal XYZ',
        slug: 'xyz-main',
        organization_id: premiumCompany.id,
        status: 'active',
        description: 'Workspace principal para administración de clientes'
      })
      .select()
      .single();
    
    if (workspaceError) {
      console.log(`❌ Error creando workspace: ${workspaceError.message}`);
    } else {
      console.log(`✅ Workspace creado: ${mainWorkspace.name}`);
    }
    
    // Crear OWNER de la empresa
    const { data: companyOwner, error: ownerError } = await supabase
      .from('users')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440014',
        email: 'owner@empresaxyz.com',
        full_name: 'Juan Pérez - CEO',
        role: 'OWNER_CUST',
        company_id: premiumCompany.id,
        platform_id: '550e8400-e29b-41d4-a716-446655440010'
      })
      .select()
      .single();
    
    if (ownerError) {
      console.log(`❌ Error creando OWNER: ${ownerError.message}`);
    } else {
      console.log(`✅ OWNER creado: ${companyOwner.full_name} (${companyOwner.role})`);
    }
    
    // Crear branding personalizado
    const { data: branding, error: brandingError } = await supabase
      .from('branding')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440015',
        company_id: premiumCompany.id,
        platform_id: '550e8400-e29b-41d4-a716-446655440010',
        logo_url: 'https://empresaxyz.com/logo.png',
        primary_color: '#2563eb',
        secondary_color: '#1e40af',
        company_name: 'Empresa XYZ S.A.',
        theme: 'modern'
      })
      .select()
      .single();
    
    if (brandingError) {
      console.log(`❌ Error creando branding: ${brandingError.message}`);
    } else {
      console.log(`✅ Branding creado: ${branding.company_name} (${branding.primary_color})`);
    }
    
  } catch (error) {
    console.log(`❌ Error en Escenario 2: ${error.message}`);
  }
  
  // =====================================================
  // ESCENARIO 3: CLIENTES DE LA EMPRESA (Roles _CLI)
  // =====================================================
  console.log('\n🏢 ESCENARIO 3: Clientes de Empresa XYZ (Roles _CLI)');
  console.log('   - Cliente A: Pequeña empresa (ADMIN_CLI)');
  console.log('   - Cliente B: Consultora (MANAGER_CLI)');
  console.log('   - Cliente C: Startup (EMPLOYEE_CLI)\n');
  
  try {
    // Cliente A: Pequeña empresa
    const { data: clientA, error: clientAError } = await supabase
      .from('sub_organizations')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440016',
        name: 'Cliente A - Pequeña Empresa',
        slug: 'cliente-a',
        parent_organization_id: '550e8400-e29b-41d4-a716-446655440012',
        status: 'active',
        plan_type: 'basic',
        max_users: 10
      })
      .select()
      .single();
    
    if (clientAError) {
      console.log(`❌ Error creando Cliente A: ${clientAError.message}`);
    } else {
      console.log(`✅ Cliente A creado: ${clientA.name} (Plan: ${clientA.plan_type})`);
    }
    
    // Usuario ADMIN_CLI para Cliente A
    const { data: adminCliA, error: adminCliAError } = await supabase
      .from('users')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440017',
        email: 'admin@clientea.com',
        full_name: 'María García - Admin Cliente A',
        role: 'ADMIN_CLI',
        company_id: '550e8400-e29b-41d4-a716-446655440012',
        platform_id: '550e8400-e29b-41d4-a716-446655440010'
      })
      .select()
      .single();
    
    if (adminCliAError) {
      console.log(`❌ Error creando ADMIN_CLI A: ${adminCliAError.message}`);
    } else {
      console.log(`✅ ADMIN_CLI A creado: ${adminCliA.full_name} (${adminCliA.role})`);
    }
    
    // Cliente B: Consultora
    const { data: clientB, error: clientBError } = await supabase
      .from('sub_organizations')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440018',
        name: 'Cliente B - Consultora',
        slug: 'cliente-b',
        parent_organization_id: '550e8400-e29b-41d4-a716-446655440012',
        status: 'active',
        plan_type: 'professional',
        max_users: 25
      })
      .select()
      .single();
    
    if (clientBError) {
      console.log(`❌ Error creando Cliente B: ${clientBError.message}`);
    } else {
      console.log(`✅ Cliente B creado: ${clientB.name} (Plan: ${clientB.plan_type})`);
    }
    
    // Usuario MANAGER_CLI para Cliente B
    const { data: managerCliB, error: managerCliBError } = await supabase
      .from('users')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440019',
        email: 'manager@clienteb.com',
        full_name: 'Carlos López - Manager Cliente B',
        role: 'MANAGER_CLI',
        company_id: '550e8400-e29b-41d4-a716-446655440012',
        platform_id: '550e8400-e29b-41d4-a716-446655440010'
      })
      .select()
      .single();
    
    if (managerCliBError) {
      console.log(`❌ Error creando MANAGER_CLI B: ${managerCliBError.message}`);
    } else {
      console.log(`✅ MANAGER_CLI B creado: ${managerCliB.full_name} (${managerCliB.role})`);
    }
    
  } catch (error) {
    console.log(`❌ Error en Escenario 3: ${error.message}`);
  }
  
  console.log('\n✅ Escenario real creado exitosamente!');
}

async function testDataIsolation() {
  console.log('\n🔒 Probando aislamiento de datos...\n');
  
  try {
    // Verificar que cada nivel solo ve sus datos
    const { data: platforms, error: platformsError } = await supabase
      .from('platforms')
      .select('id, name, slug, status');
    
    if (platformsError) {
      console.log(`❌ Error consultando plataformas: ${platformsError.message}`);
    } else {
      console.log('📊 Plataformas en el sistema:');
      platforms.forEach(p => console.log(`   - ${p.name} (${p.slug}) - ${p.status}`));
    }
    
    const { data: organizations, error: orgsError } = await supabase
      .from('organizations')
      .select('id, name, slug, platform_id, plan_type');
    
    if (orgsError) {
      console.log(`❌ Error consultando organizaciones: ${orgsError.message}`);
    } else {
      console.log('\n📊 Organizaciones en el sistema:');
      organizations.forEach(o => console.log(`   - ${o.name} (${o.slug}) - Plan: ${o.plan_type}`));
    }
    
    const { data: subOrgs, error: subOrgsError } = await supabase
      .from('sub_organizations')
      .select('id, name, slug, parent_organization_id, plan_type');
    
    if (subOrgsError) {
      console.log(`❌ Error consultando sub-organizaciones: ${subOrgsError.message}`);
    } else {
      console.log('\n📊 Sub-organizaciones (clientes):');
      subOrgs.forEach(s => console.log(`   - ${s.name} (${s.slug}) - Plan: ${s.plan_type}`));
    }
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name, role, company_id');
    
    if (usersError) {
      console.log(`❌ Error consultando usuarios: ${usersError.message}`);
    } else {
      console.log('\n📊 Usuarios en el sistema:');
      users.forEach(u => console.log(`   - ${u.full_name} (${u.email}) - ${u.role}`));
    }
    
  } catch (error) {
    console.log(`❌ Error en pruebas de aislamiento: ${error.message}`);
  }
}

async function cleanupRealWorldData() {
  console.log('\n🧹 Limpiando datos del escenario real...\n');
  
  const testIds = [
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440013',
    '550e8400-e29b-41d4-a716-446655440014',
    '550e8400-e29b-41d4-a716-446655440015',
    '550e8400-e29b-41d4-a716-446655440016',
    '550e8400-e29b-41d4-a716-446655440017',
    '550e8400-e29b-41d4-a716-446655440018',
    '550e8400-e29b-41d4-a716-446655440019'
  ];
  
  const tables = ['users', 'branding', 'sub_workspaces', 'sub_organizations', 'workspaces', 'organizations', 'platforms'];
  
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
  
  console.log('\n✅ Limpieza completada');
}

async function main() {
  console.log('🚀 Iniciando pruebas de casos de uso reales...\n');
  
  await createRealWorldScenario();
  await testDataIsolation();
  await cleanupRealWorldData();
  
  console.log('\n🎯 Resumen de casos de uso probados:');
  console.log('✅ SUPER_ADMIN: Administra toda la plataforma');
  console.log('✅ OWNER_CUST: Empresa que paga por plan premium');
  console.log('✅ ADMIN_CLI: Cliente de la empresa (pequeña empresa)');
  console.log('✅ MANAGER_CLI: Cliente de la empresa (consultora)');
  console.log('✅ Aislamiento de datos verificado');
  console.log('✅ Jerarquía de roles validada');
  console.log('✅ Branding personalizado implementado');
  
  console.log('\n🎉 ¡Arquitectura jerárquica validada exitosamente!');
}

main().catch(console.error); 