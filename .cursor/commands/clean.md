# /clean - Project Cleanup Command

Limpia archivos temporales, caché y dependencias para resolver problemas comunes.

## Pasos a Ejecutar

1. **Detener servers:**
   - Detener todos los procesos de `npm run dev`
   - Detener todos los procesos de `npm run server`

2. **Limpiar node_modules:**
   ```bash
   rm -rf node_modules
   ```

3. **Limpiar caché de npm:**
   ```bash
   npm cache clean --force
   ```

4. **Limpiar build artifacts:**
   ```bash
   rm -rf dist
   rm -rf .vite
   ```

5. **Limpiar caché de TypeScript:**
   ```bash
   rm -rf tsconfig.tsbuildinfo
   ```

6. **Reinstalar dependencias:**
   ```bash
   npm install
   ```

7. **Verificar instalación:**
   ```bash
   npm run build
   ```

## Output Esperado

Reportar:
- ✅ node_modules eliminado
- ✅ Caché limpiado
- ✅ Build artifacts eliminados
- ✅ Dependencias reinstaladas
- ✅ Build exitoso

## Cuándo Usar

Ejecutar `/clean` cuando:
- Errores extraños de módulos no encontrados
- Build falla sin razón aparente
- Después de cambiar versiones de dependencias
- Después de merge conflicts en package-lock.json
- Cuando el proyecto "se siente raro"

## Advertencia

⚠️ Este comando eliminará `node_modules` y reinstalará todo.
Puede tardar 2-5 minutos dependiendo de la conexión.
