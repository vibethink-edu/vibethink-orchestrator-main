# 🛡️ AI STABILITY RULES - VThink 1.0 Methodology
# ⚠️ CRITICAL: AI MUST FOLLOW THESE RULES - DO NOT OMIT

## 📋 VTHINK METHODOLOGY LAW COMPLIANCE
**⚠️ CRITICAL: This project follows the VThink Methodology Law:**

### ✅ CORRECT USAGE:
- **VThink 1.0** = Development methodology (CMMI-ML3 compliant)
- **VibeThink Orchestrator** = Software platform name
- **VThink** = Process, standards, workflow, methodology
- **VibeThink** = Application, platform, brand, software

### ❌ FORBIDDEN USAGE:
- **VThink** = Software names, application names, brand names
- **VibeThink** = Methodology, process, standards, workflow

**🚨 NEVER CONFUSE: VThink is methodology, VibeThink is software**
**📋 VThink = METHODOLOGY, VibeThink = SOFTWARE**

## 🚨 MANDATORY COMPLIANCE CHECKLIST
**EVERY AI INTERACTION MUST VERIFY THESE RULES BEFORE MAKING ANY CHANGES:**

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

// ❌ FORBIDDEN: Never omit VThinkThemeProvider
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}  // ❌ NO - theme customizer won't work
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

# ❌ FORBIDDEN: Never skip testing
# Making changes without testing ❌ NO
```

### 5. GIT SAFETY RULES
```bash
# ✅ MANDATORY: Always backup before major changes
git stash  # ✅ MUST backup current state
# Make changes
npm run dev  # ✅ MUST test after changes
git stash pop  # ✅ MUST restore if broken

# ❌ FORBIDDEN: Never make changes without backup
# Direct changes without git stash ❌ NO
```

## 🎯 AI COMPLIANCE VERIFICATION

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

## 🔧 RECOVERY PROCEDURE

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

## 📊 STABILITY METRICS

### ✅ SUCCESS INDICATORS:
- Header loads in < 2 seconds
- No layout shifts during hydration
- Theme customizer opens and works
- Server starts without errors
- All dependencies use exact versions

### ❌ FAILURE INDICATORS:
- Header loads slowly or with blur effect
- Tooltips appear far from triggers
- Theme customizer doesn't open
- Server fails to start
- Dependencies use caret versions

## 🚨 EMERGENCY CONTACTS

### If AI Cannot Follow These Rules:
1. **STOP** all development
2. **REVERT** to last working commit
3. **ANALYZE** what caused the violation
4. **DOCUMENT** the failure
5. **IMPLEMENT** the fix following these rules

---

**⚠️ CRITICAL: AI MUST READ AND FOLLOW THESE RULES BEFORE ANY CODE CHANGE ⚠️**
**🚨 VIOLATION OF THESE RULES WILL CAUSE SYSTEM INSTABILITY 🚨** 