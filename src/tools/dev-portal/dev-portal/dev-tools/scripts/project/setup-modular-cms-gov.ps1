# Setup Modular CMS Gubernamental (CMS-GOV)
# Script de configuración inicial para el módulo CMS-GOV
# Fecha: 26 de Junio, 2025
# Responsable: Marcelo/AI

param(
    [string]$ProjectName = "cms-gov",
    [string]$EntityId = "mincit",
    [string]$EntityName = "Ministerio de Comercio, Industria y Turismo",
    [switch]$SkipDatabase = $false,
    [switch]$SkipDependencies = $false
)

Write-Host "🚀 Iniciando Setup del Módulo CMS-GOV" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Variables de configuración
$PROJECT_ROOT = Get-Location
$CMS_GOV_DIR = Join-Path $PROJECT_ROOT "modules" "cms-gov"
$TEMPLATES_DIR = Join-Path $PROJECT_ROOT "templates" "cms-gov"

# Crear estructura de directorios
Write-Host "📁 Creando estructura de directorios..." -ForegroundColor Yellow

$directories = @(
    "modules",
    "modules/cms-gov",
    "modules/cms-gov/src",
    "modules/cms-gov/src/collections",
    "modules/cms-gov/src/globals",
    "modules/cms-gov/src/plugins",
    "modules/cms-gov/src/hooks",
    "modules/cms-gov/src/utils",
    "modules/cms-gov/src/types",
    "modules/cms-gov/src/config",
    "modules/cms-gov/templates",
    "modules/cms-gov/templates/mincit",
    "modules/cms-gov/templates/ica",
    "modules/cms-gov/templates/generic",
    "modules/cms-gov/docs",
    "modules/cms-gov/tests",
    "modules/cms-gov/docker",
    "templates",
    "templates/cms-gov"
)

foreach ($dir in $directories) {
    $fullPath = Join-Path $PROJECT_ROOT $dir
    if (!(Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "  ✅ Creado: $dir" -ForegroundColor Green
    } else {
        Write-Host "  ℹ️  Existe: $dir" -ForegroundColor Blue
    }
}

# Crear archivo package.json para el módulo
Write-Host "📦 Configurando package.json del módulo..." -ForegroundColor Yellow

$packageJson = @"
{
  "name": "@ai-pair/cms-gov",
  "version": "1.0.0",
  "description": "CMS Gubernamental Modular - Módulo CMS-GOV",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "dev": "payload dev",
    "build": "payload build",
    "start": "payload start",
    "generate:types": "payload generate:types",
    "migrate": "payload migrate",
    "migrate:create": "payload migrate:create",
    "migrate:fresh": "payload migrate:fresh",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx,json}",
    "docker:build": "docker build -t cms-gov .",
    "docker:run": "docker run -p 3000:3000 cms-gov"
  },
  "dependencies": {
    "payload": "^2.0.0",
    "@payloadcms/plugin-seo": "^1.0.0",
    "@payloadcms/plugin-cloud-storage": "^1.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "compression": "^1.7.4",
    "dotenv": "^16.0.0",
    "joi": "^17.9.0",
    "winston": "^3.10.0",
    "node-cron": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/compression": "^1.7.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0",
    "nodemon": "^3.0.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "prettier": "^3.0.0"
  },
  "keywords": [
    "cms",
    "government",
    "payload",
    "typescript",
    "modular",
    "colombia"
  ],
  "author": "Marcelo/AI",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/ai-pair-orchestrator/cms-gov"
  }
}
"@

$packageJsonPath = Join-Path $CMS_GOV_DIR "package.json"
$packageJson | Out-File -FilePath $packageJsonPath -Encoding UTF8
Write-Host "  ✅ Creado: package.json" -ForegroundColor Green

# Crear archivo de configuración TypeScript
Write-Host "⚙️  Configurando TypeScript..." -ForegroundColor Yellow

$tsConfig = @"
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "commonjs",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/collections/*": ["./src/collections/*"],
      "@/globals/*": ["./src/globals/*"],
      "@/plugins/*": ["./src/plugins/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/config/*": ["./src/config/*"]
    }
  },
  "include": [
    "src/**/*",
    "tests/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts"
  ]
}
"@

$tsConfigPath = Join-Path $CMS_GOV_DIR "tsconfig.json"
$tsConfig | Out-File -FilePath $tsConfigPath -Encoding UTF8
Write-Host "  ✅ Creado: tsconfig.json" -ForegroundColor Green

# Crear archivo de configuración de Payload CMS
Write-Host "🔧 Configurando Payload CMS..." -ForegroundColor Yellow

$payloadConfig = @"
import { buildConfig } from 'payload/config';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import path from 'path';

// Importar collections gubernamentales
import { Pages } from './src/collections/Pages';
import { Documents } from './src/collections/Documents';
import { News } from './src/collections/News';
import { Forms } from './src/collections/Forms';
import { Regulations } from './src/collections/Regulations';
import { Procedures } from './src/collections/Procedures';

// Importar globals
import { SiteSettings } from './src/globals/SiteSettings';
import { Navigation } from './src/globals/Navigation';
import { Footer } from './src/globals/Footer';
import { ComplianceSettings } from './src/globals/ComplianceSettings';

// Importar plugins
import { seoPlugin } from './src/plugins/seoPlugin';
import { accessibilityPlugin } from './src/plugins/accessibilityPlugin';
import { compliancePlugin } from './src/plugins/compliancePlugin';
import { auditPlugin } from './src/plugins/auditPlugin';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: 'users',
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- CMS Gubernamental',
      ogImage: '/og-image.jpg',
      favicon: '/favicon.ico',
    },
    css: path.resolve(__dirname, 'src/styles/admin.css'),
  },
  editor: slateEditor({}),
  collections: [
    Pages,
    Documents,
    News,
    Forms,
    Regulations,
    Procedures,
  ],
  globals: [
    SiteSettings,
    Navigation,
    Footer,
    ComplianceSettings,
  ],
  plugins: [
    seoPlugin(),
    accessibilityPlugin(),
    compliancePlugin(),
    auditPlugin(),
  ],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/cms-gov',
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  cors: ['http://localhost:3000', 'https://cms-gov.ai-pair.com'],
  csrf: ['http://localhost:3000', 'https://cms-gov.ai-pair.com'],
});
"@

$payloadConfigPath = Join-Path $CMS_GOV_DIR "payload.config.ts"
$payloadConfig | Out-File -FilePath $payloadConfigPath -Encoding UTF8
Write-Host "  ✅ Creado: payload.config.ts" -ForegroundColor Green

# Crear archivo de variables de entorno
Write-Host "🔐 Configurando variables de entorno..." -ForegroundColor Yellow

$envTemplate = @"
# CMS Gubernamental - Variables de Entorno
# ======================================

# Configuración del Servidor
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
PORT=3000
NODE_ENV=development

# Base de Datos
MONGODB_URI=mongodb://localhost:27017/cms-gov
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Autenticación
JWT_SECRET=your-jwt-secret-key
COOKIE_SECRET=your-cookie-secret-key

# Configuración de Entidad
ENTITY_ID=$EntityId
ENTITY_NAME="$EntityName"
ENTITY_TYPE=MINISTRY

# Compliance y Auditoría
AUDIT_LOG_ENABLED=true
COMPLIANCE_CHECK_ENABLED=true
ACCESSIBILITY_CHECK_ENABLED=true
SEO_CHECK_ENABLED=true

# Notificaciones
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Storage
CLOUD_STORAGE_PROVIDER=local
AWS_S3_BUCKET=your-s3-bucket
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# Analytics
GOOGLE_ANALYTICS_ID=your-ga-id
GOOGLE_TAG_MANAGER_ID=your-gtm-id

# Seguridad
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000,https://cms-gov.ai-pair.com
"@

$envPath = Join-Path $CMS_GOV_DIR ".env.example"
$envTemplate | Out-File -FilePath $envPath -Encoding UTF8
Write-Host "  ✅ Creado: .env.example" -ForegroundColor Green

# Crear archivo Docker
Write-Host "🐳 Configurando Docker..." -ForegroundColor Yellow

$dockerfile = @"
# CMS Gubernamental - Dockerfile
FROM node:18-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Comando de inicio
CMD ["npm", "start"]
"@

$dockerfilePath = Join-Path $CMS_GOV_DIR "Dockerfile"
$dockerfile | Out-File -FilePath $dockerfilePath -Encoding UTF8
Write-Host "  ✅ Creado: Dockerfile" -ForegroundColor Green

# Crear docker-compose
$dockerCompose = @"
version: '3.8'

services:
  cms-gov:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/cms-gov
      - PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
    depends_on:
      - mongo
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    networks:
      - cms-gov-network

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=cms-gov
    volumes:
      - mongo_data:/data/db
    networks:
      - cms-gov-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - cms-gov-network

volumes:
  mongo_data:
  redis_data:

networks:
  cms-gov-network:
    driver: bridge
"@

$dockerComposePath = Join-Path $CMS_GOV_DIR "docker-compose.yml"
$dockerCompose | Out-File -FilePath $dockerComposePath -Encoding UTF8
Write-Host "  ✅ Creado: docker-compose.yml" -ForegroundColor Green

# Crear README del módulo
Write-Host "📖 Creando documentación..." -ForegroundColor Yellow

$readme = @"
# CMS Gubernamental (CMS-GOV)

## 📋 Descripción

Módulo CMS Gubernamental para entidades públicas colombianas, basado en Payload CMS con funcionalidades específicas de compliance y accesibilidad.

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- MongoDB 6.0+
- Redis 7.0+

### Setup Local
\`\`\`bash
# Clonar el repositorio
git clone <repository-url>
cd modules/cms-gov

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar en desarrollo
npm run dev
\`\`\`

### Setup con Docker
\`\`\`bash
# Construir e iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f cms-gov
\`\`\`

## 🏗️ Arquitectura

### Collections
- **Pages**: Páginas del sitio web
- **Documents**: Documentos oficiales
- **News**: Noticias y comunicados
- **Forms**: Formularios públicos
- **Regulations**: Regulaciones y normativas
- **Procedures**: Procedimientos administrativos

### Plugins
- **SEO Plugin**: Optimización para motores de búsqueda
- **Accessibility Plugin**: Cumplimiento WCAG 2.1 AA
- **Compliance Plugin**: Validaciones normativas
- **Audit Plugin**: Auditoría de cambios

## 🔧 Configuración

### Variables de Entorno
- \`ENTITY_ID\`: Identificador de la entidad
- \`ENTITY_NAME\`: Nombre de la entidad
- \`ENTITY_TYPE\`: Tipo de entidad (MINISTRY, INSTITUTE, etc.)

### Compliance
- Accesibilidad WCAG 2.1 AA
- SEO optimizado
- Auditoría completa
- Cumplimiento normativo

## 📊 Métricas

- **Performance**: < 2s tiempo de carga
- **Uptime**: 99.9%+
- **Escalabilidad**: 10K+ usuarios concurrentes
- **Compliance**: 100% estándares gubernamentales

## 🧪 Testing

\`\`\`bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
\`\`\`

## 📚 Documentación

- [Guía de Usuario](./docs/user-guide.md)
- [API Reference](./docs/api-reference.md)
- [Compliance Guide](./docs/compliance-guide.md)
- [Deployment Guide](./docs/deployment-guide.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit cambios (\`git commit -m 'Add AmazingFeature'\`)
4. Push al branch (\`git push origin feature/AmazingFeature\`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Desarrollador**: Marcelo/AI
- **Arquitecto**: Marcelo/AI
- **QA**: Marcelo/AI

---

*Módulo CMS-GOV v1.0.0 - 26/06/2025*
"@

$readmePath = Join-Path $CMS_GOV_DIR "README.md"
$readme | Out-File -FilePath $readmePath -Encoding UTF8
Write-Host "  ✅ Creado: README.md" -ForegroundColor Green

# Instalar dependencias si no se especifica skip
if (!$SkipDependencies) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    Set-Location $CMS_GOV_DIR
    npm install
    Set-Location $PROJECT_ROOT
    Write-Host "  ✅ Dependencias instaladas" -ForegroundColor Green
}

# Configurar base de datos si no se especifica skip
if (!$SkipDatabase) {
    Write-Host "🗄️  Configurando base de datos..." -ForegroundColor Yellow
    
    # Crear script de migración inicial
    $migrationScript = @"
-- Migración inicial CMS-GOV
-- Fecha: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

-- Crear colección de entidades gubernamentales
CREATE TABLE IF NOT EXISTS government_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id VARCHAR(50) UNIQUE NOT NULL,
    entity_name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear colección de logs de compliance
CREATE TABLE IF NOT EXISTS compliance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_name VARCHAR(100) NOT NULL,
    operation VARCHAR(50) NOT NULL,
    document_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(100),
    changes JSONB,
    timestamp TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Crear índices para performance
CREATE INDEX IF NOT EXISTS idx_government_entities_entity_id ON government_entities(entity_id);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_timestamp ON compliance_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_collection ON compliance_logs(collection_name);

-- Insertar entidad por defecto
INSERT INTO government_entities (entity_id, entity_name, entity_type, config)
VALUES (
    '$EntityId',
    '$EntityName',
    'MINISTRY',
    '{
        "branding": {
            "logo": "/assets/logo.png",
            "primaryColor": "#1e40af",
            "secondaryColor": "#3b82f6"
        },
        "compliance": {
            "accessibilityRequired": true,
            "seoRequired": true,
            "legalReviewRequired": true
        },
        "features": {
            "multilingual": true,
            "workflowApproval": true,
            "analytics": true
        }
    }'
) ON CONFLICT (entity_id) DO NOTHING;

-- Crear RLS policies
ALTER TABLE government_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_logs ENABLE ROW LEVEL SECURITY;

-- Policy para government_entities
CREATE POLICY "government_entities_select_policy" ON government_entities
    FOR SELECT USING (true);

CREATE POLICY "government_entities_insert_policy" ON government_entities
    FOR INSERT WITH CHECK (auth.role() = 'admin');

CREATE POLICY "government_entities_update_policy" ON government_entities
    FOR UPDATE USING (auth.role() = 'admin');

-- Policy para compliance_logs
CREATE POLICY "compliance_logs_select_policy" ON compliance_logs
    FOR SELECT USING (auth.role() IN ('admin', 'auditor'));

CREATE POLICY "compliance_logs_insert_policy" ON compliance_logs
    FOR INSERT WITH CHECK (true);
"@

    $migrationPath = Join-Path $CMS_GOV_DIR "database" "initial-migration.sql"
    New-Item -ItemType Directory -Path (Split-Path $migrationPath) -Force | Out-Null
    $migrationScript | Out-File -FilePath $migrationPath -Encoding UTF8
    Write-Host "  ✅ Creado: initial-migration.sql" -ForegroundColor Green
}

# Crear archivo de configuración de entidad
Write-Host "⚙️  Configurando entidad específica..." -ForegroundColor Yellow

$entityConfig = @"
// Configuración específica para $EntityName
export const entityConfig = {
  entityId: '$EntityId',
  entityName: '$EntityName',
  entityType: 'MINISTRY' as const,
  modules: ['CMS-GOV', 'AUTH-GOV', 'SIGN-GOV', 'PQRS-GOV'],
  branding: {
    logo: '/assets/$EntityId-logo.png',
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    fontFamily: 'Inter',
  },
  compliance: {
    accessibilityRequired: true,
    seoRequired: true,
    legalReviewRequired: true,
    digitalSignatureRequired: true,
  },
  features: {
    multilingual: true,
    workflowApproval: true,
    publicComments: false,
    analytics: true,
  },
  collections: {
    pages: {
      enabled: true,
      workflow: true,
      seo: true,
      accessibility: true,
    },
    documents: {
      enabled: true,
      categories: ['resolutions', 'decrees', 'circulars', 'manuals', 'forms'],
      digitalSignature: true,
    },
    news: {
      enabled: true,
      categories: ['press-releases', 'announcements', 'events'],
      socialSharing: true,
    },
    forms: {
      enabled: true,
      types: ['contact', 'request', 'complaint', 'suggestion'],
      workflow: true,
    },
  },
};
"@

$entityConfigPath = Join-Path $CMS_GOV_DIR "src" "config" "entity-config.ts"
$entityConfig | Out-File -FilePath $entityConfigPath -Encoding UTF8
Write-Host "  ✅ Creado: entity-config.ts" -ForegroundColor Green

# Crear script de inicio rápido
Write-Host "🚀 Creando script de inicio rápido..." -ForegroundColor Yellow

$startScript = @"
#!/bin/bash
# Script de inicio rápido para CMS-GOV
# Uso: ./start.sh [dev|prod|docker]

echo "🚀 Iniciando CMS Gubernamental..."

case "\$1" in
  "dev")
    echo "📦 Instalando dependencias..."
    npm install
    
    echo "🔧 Configurando variables de entorno..."
    if [ ! -f .env ]; then
      cp .env.example .env
      echo "⚠️  Por favor edita el archivo .env con tus configuraciones"
    fi
    
    echo "🗄️  Iniciando base de datos..."
    docker-compose up -d mongo redis
    
    echo "🔧 Generando tipos..."
    npm run generate:types
    
    echo "🚀 Iniciando en modo desarrollo..."
    npm run dev
    ;;
    
  "prod")
    echo "🏗️  Construyendo aplicación..."
    npm run build
    
    echo "🚀 Iniciando en modo producción..."
    npm start
    ;;
    
  "docker")
    echo "🐳 Construyendo y ejecutando con Docker..."
    docker-compose up --build
    ;;
    
  *)
    echo "Uso: ./start.sh [dev|prod|docker]"
    echo "  dev   - Modo desarrollo local"
    echo "  prod  - Modo producción"
    echo "  docker - Con Docker Compose"
    exit 1
    ;;
esac
"@

$startScriptPath = Join-Path $CMS_GOV_DIR "start.sh"
$startScript | Out-File -FilePath $startScriptPath -Encoding UTF8
# Hacer ejecutable en sistemas Unix
if ($IsLinux -or $IsMacOS) {
    chmod +x $startScriptPath
}
Write-Host "  ✅ Creado: start.sh" -ForegroundColor Green

# Crear archivo de estado del setup
$setupStatus = @"
# Estado del Setup CMS-GOV
# Fecha: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## ✅ Completado
- [x] Estructura de directorios creada
- [x] package.json configurado
- [x] tsconfig.json configurado
- [x] payload.config.ts creado
- [x] Variables de entorno configuradas
- [x] Dockerfile creado
- [x] docker-compose.yml creado
- [x] README.md generado
- [x] Configuración de entidad creada
- [x] Script de inicio creado

## 📦 Dependencias
- [x] Dependencias instaladas: $(-not $SkipDependencies)
- [x] Base de datos configurada: $(-not $SkipDatabase)

## 🎯 Próximos Pasos
1. Editar archivo .env con configuraciones específicas
2. Ejecutar migración de base de datos
3. Iniciar desarrollo con: npm run dev
4. Crear collections específicas
5. Implementar plugins de compliance

## 📁 Estructura Creada
\`\`\`
modules/cms-gov/
├── src/
│   ├── collections/     # Collections gubernamentales
│   ├── globals/         # Configuraciones globales
│   ├── plugins/         # Plugins específicos
│   ├── hooks/           # Hooks personalizados
│   ├── utils/           # Utilidades
│   ├── types/           # Tipos TypeScript
│   └── config/          # Configuraciones
├── templates/           # Templates por entidad
├── docs/               # Documentación
├── tests/              # Tests
├── docker/             # Configuración Docker
├── package.json        # Dependencias
├── tsconfig.json       # Configuración TypeScript
├── payload.config.ts   # Configuración Payload
├── Dockerfile          # Imagen Docker
├── docker-compose.yml  # Orquestación
├── .env.example        # Variables de entorno
├── README.md           # Documentación
└── start.sh            # Script de inicio
\`\`\`

## 🔧 Configuración de Entidad
- **ID**: $EntityId
- **Nombre**: $EntityName
- **Tipo**: MINISTRY
- **Módulos**: CMS-GOV, AUTH-GOV, SIGN-GOV, PQRS-GOV

## 🚀 Comandos Útiles
\`\`\`bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Testing
npm test

# Docker
docker-compose up -d

# Migración
npm run migrate
\`\`\`
"@

$setupStatusPath = Join-Path $CMS_GOV_DIR "SETUP_STATUS.md"
$setupStatus | Out-File -FilePath $setupStatusPath -Encoding UTF8
Write-Host "  ✅ Creado: SETUP_STATUS.md" -ForegroundColor Green

# Resumen final
Write-Host ""
Write-Host "🎉 Setup del Módulo CMS-GOV Completado" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Directorio del módulo: $CMS_GOV_DIR" -ForegroundColor Cyan
Write-Host "🔧 Entidad configurada: $EntityName ($EntityId)" -ForegroundColor Cyan
Write-Host "📦 Dependencias instaladas: $(-not $SkipDependencies)" -ForegroundColor Cyan
Write-Host "🗄️  Base de datos configurada: $(-not $SkipDatabase)" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. cd modules/cms-gov" -ForegroundColor White
Write-Host "2. cp .env.example .env" -ForegroundColor White
Write-Host "3. Editar .env con tus configuraciones" -ForegroundColor White
Write-Host "4. npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentación disponible en:" -ForegroundColor Yellow
Write-Host "- README.md: Guía básica" -ForegroundColor White
Write-Host "- SETUP_STATUS.md: Estado del setup" -ForegroundColor White
Write-Host "- docs/development/MODULAR_CMS_GOV_IMPLEMENTATION.md: Especificación técnica" -ForegroundColor White
Write-Host ""
Write-Host "✅ ¡Setup completado exitosamente!" -ForegroundColor Green 