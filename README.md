# 🛡️ VibeThink Orchestrator - AI Stability Rules

## ⚠️ CRITICAL: AI MUST READ BEFORE ANY CHANGES

**🚨 MANDATORY COMPLIANCE: This project has strict stability rules that AI MUST follow**

### 🎯 Quick AI Commands

```bash
# ✅ BEFORE making any changes
npm run ai:before-changes

# ✅ AFTER making changes
npm run ai:after-changes

# ✅ Test changes safely
npm run ai:test-changes

# ✅ Safe commit with validation
npm run ai:safe-commit "your commit message"

# ✅ Recovery procedure
npm run ai:recovery

# ✅ Check stability
npm run ai:stability-check
```

## 🛡️ AI STABILITY RULES - MANDATORY

### 1. HYDRATION SAFETY RULES
```typescript
// ✅ MANDATORY: Always use mounted state for client-side hooks
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

// ✅ MANDATORY: Conditional rendering for client-only components
{mounted && <ClientOnlyComponent />}

// ❌ FORBIDDEN: Direct use of client-side hooks without mounted check
const { theme } = useTheme(); // ❌ NO - causes hydration issues
const isMobile = useIsMobile(); // ❌ NO - causes hydration issues
```

### 2. DEPENDENCY MANAGEMENT RULES
```json
// ✅ MANDATORY: Use exact versions only
"next": "15.3.4"  // ✅ YES - exact version
"@radix-ui/react-tooltip": "1.0.7"  // ✅ YES - exact version

// ❌ FORBIDDEN: Never use caret versions
"next": "^15.3.4"  // ❌ NO - causes instability
"@radix-ui/react-tooltip": "^1.0.7"  // ❌ NO - causes instability
```

### 3. PROVIDER CONFIGURATION RULES
```typescript
// ✅ MANDATORY: Always include VThinkThemeProvider in layout
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextThemeProvider>
          <VThinkThemeProvider>  {/* ✅ MANDATORY */}
            {children}
          </VThinkThemeProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
```

### 4. TESTING RULES
```bash
# ✅ MANDATORY: Always test after changes
npm run dev  # ✅ MUST test server startup
curl http://localhost:3001  # ✅ MUST test server response
# ✅ MUST open browser and verify functionality
```

## 🚨 AI COMPLIANCE VERIFICATION

### BEFORE ANY CODE CHANGE, AI MUST:
1. ✅ Check if changes affect hydration-sensitive components
2. ✅ Verify dependency versions are exact (no ^)
3. ✅ Confirm VThinkThemeProvider is in layout
4. ✅ Test server startup after changes
5. ✅ Verify theme customizer functionality

### IF ANY RULE IS VIOLATED:
- ❌ **STOP IMMEDIATELY**
- ❌ **DO NOT PROCEED**
- ❌ **REVERT CHANGES**
- ❌ **FOLLOW RECOVERY PROCEDURE**

## 🔧 Recovery Procedure

### If Hydration Issues Occur:
```typescript
// ✅ IMMEDIATE FIX: Add mounted state
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

// ✅ IMMEDIATE FIX: Conditional rendering
{mounted && <ProblematicComponent />}
```

### If Dependencies Break:
```bash
# ✅ IMMEDIATE FIX: Clean install with exact versions
npm cache clean --force
Remove-Item -Recurse -Force node_modules, .next
npm install
npm run dev
```

### If Theme Customizer Breaks:
```typescript
// ✅ IMMEDIATE FIX: Verify VThinkThemeProvider
import { VThinkThemeProvider } from '@/shared/components/bundui-premium/components/theme-customizer';

// ✅ IMMEDIATE FIX: Add to layout
<VThinkThemeProvider>
  {children}
</VThinkThemeProvider>
```

## 📊 Stability Metrics

### ✅ Success Indicators:
- Header loads in < 2 seconds
- No layout shifts during hydration
- Theme customizer opens and works
- Server starts without errors
- All dependencies use exact versions

### ❌ Failure Indicators:
- Header loads slowly or with blur effect
- Tooltips appear far from triggers
- Theme customizer doesn't open
- Server fails to start
- Dependencies use caret versions

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
# Clone the repository
git clone https://github.com/mescallo-edu/vibethink-orchestrator-main.git
cd vibethink-orchestrator-main

# Install dependencies
npm install

# Validate stability rules
npm run validate:stability

# Start development server
npm run dev
```

### AI Development Workflow
```bash
# 1. Before making changes
npm run ai:before-changes

# 2. Make your changes

# 3. After making changes
npm run ai:after-changes

# 4. Test changes
npm run ai:test-changes

# 5. Safe commit
npm run ai:safe-commit "feat: your feature description"
```

## 📁 Project Structure

```
vibethink-orchestrator-main/
├── apps/
│   └── dashboard/          # Main dashboard application
├── src/
│   └── shared/            # Shared components and utilities
├── AI_STABILITY_RULES.md  # ⚠️ CRITICAL: AI must read
├── VTHINK_METHODOLOGY_LAW.md  # 🛡️ VThink Law (INQUEBRANTABLE)
├── validate-stability-rules.js  # 🛡️ Stability validator
├── validate-vthink-law.js  # 🛡️ VThink Law validator
└── package.json           # AI-friendly scripts
```

## 🛡️ VTHINK METHODOLOGY LAW - INQUEBRANTABLE

### 📋 VThink = METHODOLOGY, VibeThink = SOFTWARE

**⚠️ CRITICAL: This project follows the VThink Methodology Law:**

- **VThink 1.0** = Development methodology (CMMI-ML3 compliant)
- **VibeThink Orchestrator** = Software platform name
- **VThink** = Process, standards, workflow, methodology
- **VibeThink** = Application, platform, brand, software

**🚨 NEVER CONFUSE: VThink is methodology, VibeThink is software**

## 🛡️ AI Safety Features

### Automatic Validation
- **Pre-commit hooks**: Automatically validate stability rules
- **AI scripts**: Safe commands for AI development
- **Recovery procedures**: Automatic recovery from issues

### Validation Commands
```bash
npm run validate:stability  # Full stability check
npm run validate:vtk        # VThink-specific validation
npm run ai:stability-check  # Quick stability check
```

## 🚨 Emergency Contacts

### If AI Cannot Follow These Rules:
1. **STOP** all development
2. **REVERT** to last working commit
3. **ANALYZE** what caused the violation
4. **DOCUMENT** the failure
5. **IMPLEMENT** the fix following these rules

---

**⚠️ CRITICAL: AI MUST READ AND FOLLOW THESE RULES BEFORE ANY CODE CHANGE ⚠️**
**🚨 VIOLATION OF THESE RULES WILL CAUSE SYSTEM INSTABILITY 🚨**

## 🤖 AI Build & Execution Policy (Claude, Gemini, OpenAI)
- NPM-only: no pnpm/yarn/bun
- Dashboard build: ejecutar desde root con `npm run build:dashboard` (internamente: `cd apps/dashboard && npx --no-install next build`)
- No ejecutar `next build` directamente dentro de apps
- Dependencias solo en root; apps sin node_modules
- Versiones exactas (sin ^ ni ~ ni latest)