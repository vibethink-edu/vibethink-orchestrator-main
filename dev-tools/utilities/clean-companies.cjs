const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanCompanies() {
  console.log('🧹 Limpiando tabla companies...');
  
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (error) {
      console.log(`❌ Error: ${error.message}`);
    } else {
      console.log('✅ Tabla companies limpiada exitosamente');
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

cleanCompanies(); 