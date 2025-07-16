
# Guía de Deployment

## Opciones de Deployment

### 1. Lovable (Recomendado para desarrollo)
- **URL**: https://lovable.dev/projects/584b45ad-0bf9-4005-ac94-e3f2afb2fbe0
- **Ventajas**: Deploy automático, preview instantáneo
- **Desventajas**: Limitado a proyectos de desarrollo

### 2. Vercel (Recomendado para producción)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy desde GitHub
vercel --prod
```

### 3. Netlify
```bash
# Build local
npm run build

# Deploy manual o conectar con GitHub
netlify deploy --prod --dir=dist
```

### 4. VPS Personalizado
```bash
# Build de producción
npm run build

# Subir dist/ a tu servidor
rsync -avz dist/ user@server:/var/www/html/
```

## Variables de Entorno

### Desarrollo (.env.local)
```env
VITE_SUPABASE_URL=https://pikywaoqlekupfynnclg.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica
```

### Producción
```env
VITE_SUPABASE_URL=tu_url_de_produccion
VITE_SUPABASE_ANON_KEY=tu_clave_de_produccion
VITE_APP_ENV=production
```

## Configuración de Supabase

### Políticas RLS (Pendiente)
```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para usuarios autenticados
CREATE POLICY "Users can view own data" ON users
FOR SELECT USING (auth.uid() = id);
```

### URLs Permitidas
En el panel de Supabase → Authentication → URL Configuration:
- Site URL: `https://tu-dominio.com`
- Redirect URLs: `https://tu-dominio.com/dashboard`

## GitHub Actions (CI/CD)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Checklist Pre-Deploy

### ✅ Código
- [ ] Tests pasando
- [ ] Build sin errores
- [ ] TypeScript sin errores
- [ ] ESLint sin warnings críticos

### ✅ Configuración
- [ ] Variables de entorno configuradas
- [ ] URLs de Supabase actualizadas
- [ ] Políticas RLS configuradas
- [ ] Dominio personalizado configurado

### ✅ Seguridad
- [ ] Claves de API protegidas
- [ ] HTTPS habilitado
- [ ] Headers de seguridad configurados
- [ ] Rate limiting implementado

## Post-Deploy

### Verificación
1. **Funcionalidad básica**
   - Login/logout funciona
   - Navegación entre páginas
   - Protección de rutas activa

2. **Performance**
   - Lighthouse score > 90
   - Time to Interactive < 3s
   - First Contentful Paint < 1.5s

3. **Monitoreo**
   - Error tracking activo
   - Analytics configurado
   - Uptime monitoring

### Rollback Plan
```bash
# Revertir a versión anterior en Vercel
vercel rollback [deployment-url]

# O revertir commit en GitHub
git revert HEAD
git push origin main
```
