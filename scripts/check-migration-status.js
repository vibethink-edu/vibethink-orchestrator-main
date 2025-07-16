/**
 * Check Migration Status
 * 
 * Script simple para verificar si las tablas del sistema de permisos existen
 */

const { createClient } = require('@supabase/supabase-js')

// Configuración básica - usar variables de entorno del navegador
const supabaseUrl = 'https://pikywaoqlekupfynnclg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpa3l3YW9xbGVrdXBmeW5ubGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI4NzQsImV4cCI6MjA1MDU0ODg3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkMigrationStatus() {
  console.log('🔍 Verificando estado de la migración...\n')

  try {
    // Verificar conexión básica
    console.log('1️⃣ Verificando conexión...')
    const { data: testData, error: testError } = await supabase
      .from('companies')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.log('❌ Error de conexión:', testError.message)
      return
    }
    console.log('✅ Conexión exitosa\n')

    // Verificar tablas del sistema
    console.log('2️⃣ Verificando tablas del sistema...')
    
    const tables = [
      'departments',
      'department_permissions',
      'department_data_access', 
      'user_department_memberships',
      'permission_logs',
      'data_access_logs'
    ]

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1)
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`)
        } else {
          console.log(`✅ ${table}: Existe`)
        }
      } catch (err) {
        console.log(`❌ ${table}: No existe`)
      }
    }

    console.log('\n📊 RESUMEN:')
    console.log('Si ves ❌ en las tablas, la migración no se aplicó correctamente.')
    console.log('Si ves ✅ en las tablas, la migración está funcionando.')
    console.log('\n💡 Para aplicar la migración manualmente:')
    console.log('1. Ve a Supabase Dashboard')
    console.log('2. SQL Editor')
    console.log('3. Copia y pega el contenido de: supabase/migrations/20250618130000_create_departmental_permission_system.sql')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkMigrationStatus() 