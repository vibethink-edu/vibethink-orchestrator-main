# 📦 REGLAS DE DEPENDENCIAS - MONOREPO (NPM-ONLY)

## 🎯 Principios Obligator ios
- Gestor único: NPM (prohibido pnpm/yarn/bun)
- Versiones exactas: sin ^, ~ ni "latest"
- Dependencias compartidas: solo en `root/package.json`
- Apps: sin `dependencies` ni `devDependencies` (solo scripts)

## ✅ Instalación Correcta (solo en root)
```bash
# Instalar o actualizar dependencias compartidas
npm install paquete@X.Y.Z
```

## ❌ Prohibido
```bash
# Instalar dentro de apps (NO)
cd apps/dashboard && npm install paquete

# Usar carets/tilde/latest (NO)
"react": "^18.3.1"
"recharts": "latest"
```

## 📌 Versiones Aprobadas (extracto)
- next: 15.3.4
- react / react-dom: 18.3.1
- typescript: 5.9.2
- tailwindcss: 4.1.11
- recharts: 3.1.2

## 🔧 Procedimiento estándar
```bash
# 1) Instalar en root
npm install

# 2) Validar
npm run validate:universal
```

## 🧭 Notas
- Cualquier excepción debe documentarse y pasar validadores.
- Este documento sustituye versiones anteriores con carets o gestores alternos. 