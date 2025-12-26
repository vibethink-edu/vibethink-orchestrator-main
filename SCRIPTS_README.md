# VibeThink Orchestrator - Development Scripts

## Quick Start

### Start Development Server
```powershell
.\start-dev.ps1
```

Opens the development server at:
- **Main:** http://localhost:3000
- **Dashboard:** http://localhost:3000/dashboard-bundui/projects-v2

### Stop Development Server
```powershell
.\stop-dev.ps1
```

Gracefully stops all running development processes.

---

## Available Scripts

### Development
- `.\start-dev.ps1` - Start development server
- `.\stop-dev.ps1` - Stop development server
- `npm run dev` - Manual start (use scripts instead)

### Validation
- `npm run lang-quality` - Check i18n compliance (9 languages)
- `npm run validate:i18n` - Validate translation files
- `npm list react` - Verify React version (should be 19.0.0 only)

### Build
- `npm run build` - Build for production
- `npm run start` - Start production server

---

## Troubleshooting

### Server won't start
```powershell
# Clean install
rm -r node_modules, package-lock.json
npm install
.\start-dev.ps1
```

### Port already in use
```powershell
# Stop all node processes
.\stop-dev.ps1

# Or manually
Get-Process -Name "node" | Stop-Process -Force
```

### React version conflicts
```powershell
npm list react
# Should show ONLY React 19.0.0
# If not, run: npm install
```

---

**Phase:** 0 (Mockups - No Database)  
**Version:** 0.5.1  
**Last Updated:** 2025-12-25
