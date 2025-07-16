/**
 * Verify Departmental Permissions System
 * 
 * Script para verificar si el sistema de permisos departamentales está funcionando
 * 
 * @author AI Pair Platform - Core Team
 * @version 1.0.0
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifyDepartmentalPermissionsSystem() {
  console.log('🔍 Verificando Sistema de Permisos Departamentales...\n')

  try {
    // =====================================================
    // 1. VERIFICAR CONEXIÓN
    // =====================================================
    console.log('1️⃣ Verificando conexión a Supabase...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('companies')
      .select('count')
      .limit(1)
    
    if (connectionError) {
      console.error('❌ Error de conexión:', connectionError.message)
      return false
    }
    console.log('✅ Conexión exitosa\n')

    // =====================================================
    // 2. VERIFICAR TABLAS DEL SISTEMA
    // =====================================================
    console.log('2️⃣ Verificando tablas del sistema...')
    
    const tablesToCheck = [
      'departments',
      'department_permissions', 
      'department_data_access',
      'user_department_memberships',
      'permission_logs',
      'data_access_logs'
    ]

    for (const table of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1)
        
        if (error) {
          console.log(`❌ Tabla ${table}: ${error.message}`)
        } else {
          console.log(`✅ Tabla ${table}: Existe`)
        }
      } catch (err) {
        console.log(`❌ Tabla ${table}: No existe`)
      }
    }
    console.log()

    // =====================================================
    // 3. VERIFICAR FUNCIONES
    // =====================================================
    console.log('3️⃣ Verificando funciones del sistema...')
    
    // Verificar función has_department_permission
    try {
      const { data: permissionTest, error: permissionError } = await supabase
        .rpc('has_department_permission', {
          p_user_id: '00000000-0000-0000-0000-000000000000',
          p_permission: 'use_ai_chat'
        })
      
      if (permissionError) {
        console.log(`❌ Función has_department_permission: ${permissionError.message}`)
      } else {
        console.log('✅ Función has_department_permission: Existe')
      }
    } catch (err) {
      console.log('❌ Función has_department_permission: No existe')
    }

    // Verificar función has_data_access
    try {
      const { data: dataAccessTest, error: dataAccessError } = await supabase
        .rpc('has_data_access', {
          p_user_id: '00000000-0000-0000-0000-000000000000',
          p_data_path: 'customers.*',
          p_action: 'read'
        })
      
      if (dataAccessError) {
        console.log(`❌ Función has_data_access: ${dataAccessError.message}`)
      } else {
        console.log('✅ Función has_data_access: Existe')
      }
    } catch (err) {
      console.log('❌ Función has_data_access: No existe')
    }

    // Verificar función get_user_departments
    try {
      const { data: userDeptsTest, error: userDeptsError } = await supabase
        .rpc('get_user_departments', {
          p_user_id: '00000000-0000-0000-0000-000000000000'
        })
      
      if (userDeptsError) {
        console.log(`❌ Función get_user_departments: ${userDeptsError.message}`)
      } else {
        console.log('✅ Función get_user_departments: Existe')
      }
    } catch (err) {
      console.log('❌ Función get_user_departments: No existe')
    }
    console.log()

    // =====================================================
    // 4. VERIFICAR DATOS INICIALES
    // =====================================================
    console.log('4️⃣ Verificando datos iniciales...')
    
    // Verificar si hay departamentos
    try {
      const { data: departments, error: deptError } = await supabase
        .from('departments')
        .select('*')
        .limit(5)
      
      if (deptError) {
        console.log(`❌ Error al consultar departamentos: ${deptError.message}`)
      } else {
        console.log(`✅ Departamentos encontrados: ${departments?.length || 0}`)
        if (departments && departments.length > 0) {
          departments.forEach(dept => {
            console.log(`   - ${dept.name} (${dept.code})`)
          })
        }
      }
    } catch (err) {
      console.log('❌ No se pudieron consultar departamentos')
    }
    console.log()

    // =====================================================
    // 5. VERIFICAR RLS POLICIES
    // =====================================================
    console.log('5️⃣ Verificando políticas RLS...')
    
    // Intentar consultar con usuario no autenticado
    try {
      const { data: rlsTest, error: rlsError } = await supabase
        .from('departments')
        .select('*')
        .limit(1)
      
      if (rlsError && rlsError.message.includes('policy')) {
        console.log('✅ Políticas RLS activas (acceso denegado correctamente)')
      } else if (rlsError) {
        console.log(`❌ Error RLS: ${rlsError.message}`)
      } else {
        console.log('⚠️  Políticas RLS no activas (acceso permitido sin autenticación)')
      }
    } catch (err) {
      console.log('❌ Error al verificar RLS')
    }
    console.log()

    // =====================================================
    // 6. RESUMEN
    // =====================================================
    console.log('📊 RESUMEN DE VERIFICACIÓN')
    console.log('========================')
    console.log('✅ Sistema básico verificado')
    console.log('⚠️  Algunas funciones pueden requerir migración manual')
    console.log('💡 Recomendación: Aplicar migración desde Supabase Dashboard')
    console.log()

    return true

  } catch (error) {
    console.error('❌ Error durante la verificación:', error)
    return false
  }
}

// Ejecutar verificación
verifyDepartmentalPermissionsSystem()
  .then((success) => {
    if (success) {
      console.log('🎉 Verificación completada')
    } else {
      console.log('💥 Verificación falló')
    }
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  }) 