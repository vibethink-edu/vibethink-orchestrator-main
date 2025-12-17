# /setup - Project Setup Command

Ejecuta el setup completo del proyecto Voice Agent.

## Pasos a Ejecutar

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Verificar archivo .env.local:**
   - Verificar que existe `.env.local`
   - Si no existe, copiar de `.env.example`
   - Listar las API keys requeridas:
     - `VITE_GEMINI_API_KEY`
     - `VITE_ELEVENLABS_API_KEY`
     - `VITE_CARTESIA_API_KEY`
     - `VITE_ULTRAVOX_API_KEY`

3. **Verificar configuración:**
   - Verificar que `package.json` tiene las dependencias correctas
   - Verificar que `vite.config.ts` está configurado
   - Verificar que `tsconfig.json` está correcto

4. **Build de verificación:**
   ```bash
   npm run build
   ```

5. **Iniciar servidores:**
   ```bash
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: Backend (si aplica)
   npm run server
   ```

## Output Esperado

Reportar:
- ✅ Dependencias instaladas
- ✅ .env.local configurado
- ✅ Build exitoso
- ✅ Servers corriendo en:
  - Frontend: http://localhost:3000
  - Backend: http://localhost:3001

## Errores Comunes

- **Error: Missing API key** → Verificar .env.local
- **Error: Port already in use** → Matar proceso en puerto
- **Error: Module not found** → Ejecutar `npm install` de nuevo
