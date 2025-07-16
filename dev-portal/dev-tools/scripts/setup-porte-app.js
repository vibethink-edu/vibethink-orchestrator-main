#!/usr/bin/env node

/**
 * 📦 Setup de Aplicación Porte
 * 
 * Este script configura la estructura inicial de una aplicación portada,
 * incluyendo configuración de TypeScript, Tailwind, y integración con
 * el stack principal.
 * 
 * Uso: node scripts/setup-porte-app.js [modulo] [nombre]
 * 
 * VTK 1.0 - Framework de Porte
 */

const fs = require('fs').promises;
const path = require('path');

class PorteAppSetup {
  constructor(moduleName, componentName) {
    this.moduleName = moduleName;
    this.componentName = componentName;
    this.appDir = path.join('src', 'apps', moduleName);
    this.componentDir = path.join('src', 'components', moduleName);
    this.timestamp = new Date().toISOString();
  }

  async setupApp() {
    console.log(`🚀 Configurando aplicación porte: ${this.moduleName}`);
    
    try {
      // 1. Crear estructura de directorios
      await this.createDirectoryStructure();
      
      // 2. Configurar package.json específico
      await this.createPackageJson();
      
      // 3. Configurar TypeScript
      await this.configureTypeScript();
      
      // 4. Configurar Tailwind
      await this.configureTailwind();
      
      // 5. Crear archivos base
      await this.createBaseFiles();
      
      // 6. Configurar Supabase
      await this.configureSupabase();
      
      console.log(`✅ Setup completado para: ${this.moduleName}`);
      console.log(`📁 Aplicación: ${this.appDir}`);
      console.log(`🧩 Componentes: ${this.componentDir}`);
      
    } catch (error) {
      console.error('❌ Error durante el setup:', error.message);
      process.exit(1);
    }
  }

  async createDirectoryStructure() {
    const dirs = [
      // Aplicación principal
      this.appDir,
      path.join(this.appDir, 'src'),
      path.join(this.appDir, 'src', 'components'),
      path.join(this.appDir, 'src', 'pages'),
      path.join(this.appDir, 'src', 'hooks'),
      path.join(this.appDir, 'src', 'services'),
      path.join(this.appDir, 'src', 'types'),
      path.join(this.appDir, 'src', 'utils'),
      path.join(this.appDir, 'src', 'config'),
      path.join(this.appDir, 'tests'),
      path.join(this.appDir, 'public'),
      
      // Componentes compartidos
      this.componentDir,
      path.join(this.componentDir, 'ui'),
      path.join(this.componentDir, 'forms'),
      path.join(this.componentDir, 'layouts'),
      path.join(this.componentDir, 'hooks'),
      path.join(this.componentDir, 'utils')
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }

    console.log('📁 Estructura de directorios creada');
  }

  async createPackageJson() {
    const packageJson = {
      name: `@ai-pair-orchestrator/${this.moduleName}`,
      version: '1.0.0',
      description: `${this.componentName} - Ported to AI Pair Orchestrator Pro`,
      type: 'module',
      main: 'src/index.ts',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
        test: 'vitest',
        'test:ui': 'vitest --ui',
        'test:coverage': 'vitest --coverage',
        lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
        'lint:fix': 'eslint . --ext ts,tsx --fix',
        'type-check': 'tsc --noEmit'
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-router-dom': '^6.8.0',
        '@supabase/supabase-js': '^2.38.0',
        'class-variance-authority': '^0.7.0',
        clsx: '^2.0.0',
        'tailwind-merge': '^2.0.0',
        'lucide-react': '^0.292.0',
        '@hookform/resolvers': '^3.3.2',
        'react-hook-form': '^7.48.2',
        zod: '^3.22.4',
        '@tanstack/react-query': '^5.8.4',
        'date-fns': '^2.30.0'
      },
      devDependencies: {
        '@types/react': '^18.2.43',
        '@types/react-dom': '^18.2.17',
        '@typescript-eslint/eslint-plugin': '^6.14.0',
        '@typescript-eslint/parser': '^6.14.0',
        '@vitejs/plugin-react': '^4.2.1',
        autoprefixer: '^10.4.16',
        eslint: '^8.55.0',
        'eslint-plugin-react': '^7.33.2',
        'eslint-plugin-react-hooks': '^4.6.0',
        'eslint-plugin-react-refresh': '^0.4.5',
        postcss: '^8.4.32',
        tailwindcss: '^3.3.6',
        typescript: '^5.2.2',
        vite: '^5.0.8',
        vitest: '^1.0.4',
        '@vitest/ui': '^1.0.4',
        '@vitest/coverage-v8': '^1.0.4',
        'jsdom': '^23.0.1',
        '@testing-library/react': '^14.1.2',
        '@testing-library/jest-dom': '^6.1.5',
        '@testing-library/user-event': '^14.5.1'
      },
      peerDependencies: {
        react: '>=18.0.0',
        'react-dom': '>=18.0.0'
      }
    };

    await fs.writeFile(
      path.join(this.appDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    console.log('📦 package.json creado');
  }

  async configureTypeScript() {
    const tsConfig = {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*'],
          '@/components/*': ['./src/components/*'],
          '@/pages/*': ['./src/pages/*'],
          '@/hooks/*': ['./src/hooks/*'],
          '@/services/*': ['./src/services/*'],
          '@/types/*': ['./src/types/*'],
          '@/utils/*': ['./src/utils/*'],
          '@/config/*': ['./src/config/*'],
          '@/lib/*': ['../../common/lib/*'],
          '@/ui/*': [`../../components/${this.moduleName}/ui/*`]
        }
      },
      include: ['src/**/*', 'tests/**/*'],
      exclude: ['node_modules', 'dist', 'build'],
      references: [
        { path: '../../tsconfig.json' }
      ]
    };

    await fs.writeFile(
      path.join(this.appDir, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );

    console.log('📘 TypeScript configurado');
  }

  async configureTailwind() {
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../components/${this.moduleName}/**/*.{js,ts,jsx,tsx}",
    "../../common/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Extend with your custom colors
        primary: {
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))',
          900: 'hsl(var(--primary-900))',
          950: 'hsl(var(--primary-950))',
        },
        secondary: {
          50: 'hsl(var(--secondary-50))',
          100: 'hsl(var(--secondary-100))',
          200: 'hsl(var(--secondary-200))',
          300: 'hsl(var(--secondary-300))',
          400: 'hsl(var(--secondary-400))',
          500: 'hsl(var(--secondary-500))',
          600: 'hsl(var(--secondary-600))',
          700: 'hsl(var(--secondary-700))',
          800: 'hsl(var(--secondary-800))',
          900: 'hsl(var(--secondary-900))',
          950: 'hsl(var(--secondary-950))',
        }
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwindcss-animate")
  ],
}`;

    await fs.writeFile(
      path.join(this.appDir, 'tailwind.config.js'),
      tailwindConfig
    );

    // PostCSS config
    const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

    await fs.writeFile(
      path.join(this.appDir, 'postcss.config.js'),
      postcssConfig
    );

    console.log('🎨 Tailwind CSS configurado');
  }

  async createBaseFiles() {
    // Vite config
    const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/config': path.resolve(__dirname, './src/config'),
      '@/lib': path.resolve(__dirname, '../../common/lib'),
      '@/ui': path.resolve(__dirname, \`../../components/${this.moduleName}/ui\`)
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})`;

    await fs.writeFile(
      path.join(this.appDir, 'vite.config.ts'),
      viteConfig
    );

    // Vitest config
    const vitestConfig = `import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/config': path.resolve(__dirname, './src/config'),
      '@/lib': path.resolve(__dirname, '../../common/lib'),
      '@/ui': path.resolve(__dirname, \`../../components/${this.moduleName}/ui\`)
    }
  }
})`;

    await fs.writeFile(
      path.join(this.appDir, 'vitest.config.ts'),
      vitestConfig
    );

    // Test setup
    const testSetup = `import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'

beforeAll(() => {
  // Setup global test environment
})

afterEach(() => {
  cleanup()
})

afterAll(() => {
  // Cleanup after all tests
})`;

    await fs.writeFile(
      path.join(this.appDir, 'tests', 'setup.ts'),
      testSetup
    );

    // Main entry point
    const mainEntry = `import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)`;

    await fs.writeFile(
      path.join(this.appDir, 'src', 'main.tsx'),
      mainEntry
    );

    // App component
    const appComponent = `import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/ui/toaster'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/pages/HomePage'
import { AuthProvider } from '@/providers/AuthProvider'
import { TenantProvider } from '@/providers/TenantProvider'

function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add more routes here */}
          </Routes>
        </Layout>
        <Toaster />
      </TenantProvider>
    </AuthProvider>
  )
}

export default App`;

    await fs.writeFile(
      path.join(this.appDir, 'src', 'App.tsx'),
      appComponent
    );

    // CSS entry
    const cssEntry = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --primary-50: 250 250 249;
    --primary-100: 245 245 244;
    --primary-200: 231 229 228;
    --primary-300: 214 211 209;
    --primary-400: 168 162 158;
    --primary-500: 120 113 108;
    --primary-600: 87 83 78;
    --primary-700: 68 64 60;
    --primary-800: 41 37 36;
    --primary-900: 28 25 23;
    --primary-950: 12 10 9;
    
    --secondary-50: 248 250 252;
    --secondary-100: 241 245 249;
    --secondary-200: 226 232 240;
    --secondary-300: 203 213 225;
    --secondary-400: 148 163 184;
    --secondary-500: 100 116 139;
    --secondary-600: 71 85 105;
    --secondary-700: 51 65 85;
    --secondary-800: 30 41 59;
    --secondary-900: 15 23 42;
    --secondary-950: 2 6 23;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors;
  }
  
  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700;
  }
  
  .btn-secondary {
    @apply bg-secondary-600 text-white hover:bg-secondary-700;
  }
}`;

    await fs.writeFile(
      path.join(this.appDir, 'src', 'index.css'),
      cssEntry
    );

    console.log('📄 Archivos base creados');
  }

  async configureSupabase() {
    // Supabase config
    const supabaseConfig = `import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Multi-tenant helper
export const getTenantSupabase = (tenantId: string) => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'x-tenant-id': tenantId
      }
    }
  })
}`;

    await fs.writeFile(
      path.join(this.appDir, 'src', 'config', 'supabase.ts'),
      supabaseConfig
    );

    // Database types placeholder
    const databaseTypes = `export interface Database {
  public: {
    Tables: {
      // Define your table types here
      ${this.moduleName}: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          tenant_id: string
          // Add more fields as needed
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          tenant_id: string
          // Add more fields as needed
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          tenant_id?: string
          // Add more fields as needed
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}`;

    await fs.writeFile(
      path.join(this.appDir, 'src', 'types', 'database.ts'),
      databaseTypes
    );

    console.log('🗄️ Supabase configurado');
  }

  async createProviders() {
    // Auth Provider
    const authProvider = `import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/config/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}`;

    await fs.writeFile(
      path.join(this.appDir, 'src', 'providers', 'AuthProvider.tsx'),
      authProvider
    );

    // Tenant Provider
    const tenantProvider = `import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'

interface TenantContextType {
  tenantId: string | null
  tenantName: string | null
  setTenant: (id: string, name: string) => void
  clearTenant: () => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export const useTenant = () => {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

interface TenantProviderProps {
  children: React.ReactNode
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [tenantName, setTenantName] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Load tenant from user metadata or localStorage
      const savedTenant = localStorage.getItem('current-tenant')
      if (savedTenant) {
        const { id, name } = JSON.parse(savedTenant)
        setTenantId(id)
        setTenantName(name)
      }
    } else {
      clearTenant()
    }
  }, [user])

  const setTenant = (id: string, name: string) => {
    setTenantId(id)
    setTenantName(name)
    localStorage.setItem('current-tenant', JSON.stringify({ id, name }))
  }

  const clearTenant = () => {
    setTenantId(null)
    setTenantName(null)
    localStorage.removeItem('current-tenant')
  }

  const value = {
    tenantId,
    tenantName,
    setTenant,
    clearTenant
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}`;

    await fs.writeFile(
      path.join(this.appDir, 'src', 'providers', 'TenantProvider.tsx'),
      tenantProvider
    );

    console.log('🔑 Providers creados');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const [,, moduleName, componentName] = process.argv;

  if (!moduleName || !componentName) {
    console.error('❌ Uso: node scripts/setup-porte-app.js [modulo] [nombre]');
    console.error('   Ejemplo: node scripts/setup-porte-app.js "social-media" "postiz"');
    process.exit(1);
  }

  const setup = new PorteAppSetup(moduleName, componentName);
  setup.setupApp();
}

module.exports = PorteAppSetup;
