# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🤖 Meta-Documentation Principle

**AI-FIRST DOCUMENTATION**: All documentation in this repository follows AI-friendly patterns for optimal AI-human collaboration. When creating or updating any documentation:

- ✅ **Structure**: Use clear headers, bullets, code blocks
- ✅ **Examples**: Always include "do this" vs "don't do this" 
- ✅ **Context**: Provide decisions + justifications + impact
- ✅ **Cross-links**: Reference related documentation
- ✅ **Entry points**: Maintain CLAUDE.md → specific guides flow

**Rule**: If an AI can't understand and apply the documentation in 2 minutes, it needs refactoring.

## 🤖 Universal AI Standards

**CRITICAL**: Before making any architectural decisions, consult `AI_UNIVERSAL_STANDARDS.md` - these rules apply to ALL AI assistants (Claude, Gemini, Cursor, etc.) to ensure consistency across different AI interactions.

## Essential Commands

### Development
```bash
npm run dev                    # Start Next.js development server
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Run ESLint
```

### Testing
```bash
npm run test                   # Run Jest tests
npm run test:watch            # Run Jest in watch mode
npm run test:coverage         # Run tests with coverage report
npm run type-check            # TypeScript type checking (in dashboard app)
```

### Validation & Quality
```bash
# Core Validations
npm run validate:reports       # Validate documentation reports
npm run validate:organization  # Validate code organization
npm run validate:architecture  # Validate architectural rules
npm run validate:root         # Validate root directory cleanliness
npm run pre-commit            # Run all validations (used as pre-commit hook)

# Advanced Ecosystem Validation
npm run validate:ecosystem              # Complete ecosystem validation
npm run validate:dependencies          # Dependency compatibility check
npm run validate:shared-components     # Shared component usage analysis
npm run validate:cross-app-compatibility # Cross-app integration validation
npm run validate:performance           # Performance metrics validation
npm run validate:security             # Security compliance check
npm run validate:external-update      # External dependency risk assessment
npm run validate:sidebar-consistency  # UI consistency across apps
npm run validate:workspace-compatibility # Monorepo workspace validation

# Bundui & Component Validation
npm run validate:bundui-compatibility # Bundui integration validation
npm run validate:graphics            # Graphics and chart configuration
npm run validate:shared-component    # Shared component impact analysis
npm run validate:new-feature         # New feature compliance check
```

### Docusaurus Documentation
```bash
npm run start:sites           # Start all Docusaurus sites
npm run create:sites          # Create new Docusaurus sites
npm run migrate:docs          # Migrate documentation
```

### Component Development
```bash
npm run evaluate:components   # Evaluate component compliance with VThink methodology
npm run validate:graphics     # Validate graphics configuration and Bundui components
```

## Architecture Overview

### Repository Structure
This is a **monorepo** managed with Lerna workspaces, following the **VThink 1.0 methodology** with **CMMI-ML3 compliance**.

```
vibethink-orchestrator/
├── apps/                     # Monorepo workspaces - each app is independent
│   ├── main-app/            # Main application (port 3000)
│   ├── admin/               # Admin panel for company management
│   ├── dashboard/           # Primary dashboard (port 3001) - 12+ sub-applications
│   ├── login/               # Authentication application
│   └── helpdesk/            # Support system
├── src/                     # Shared code across all apps
│   ├── shared/              # Shared components, hooks, utilities
│   ├── integrations/        # External service integrations (Supabase, etc.)
│   ├── common/              # Common patterns and configurations
│   ├── modules/             # Business logic modules
│   └── specialized/         # Specialized functionality
├── docs/                    # Comprehensive documentation system
├── dev-tools/               # Development automation and validation tools
├── external/                # External dependencies (bundui-free, bundui-premium)
├── docusaurus-*/            # Multiple Docusaurus sites for different audiences
└── tests/                   # Testing infrastructure
```

### Key Architectural Principles

**Multi-tenant SaaS Platform:**
- **ALWAYS filter by `company_id`** in database queries for security
- 5-tier role system: `EMPLOYEE → MANAGER → ADMIN → OWNER → SUPER_ADMIN`
- Row Level Security (RLS) policies enforced in Supabase

**Technology Stack:**
- **Frontend:** React 19, Next.js 15, TypeScript 5.8
- **Styling:** TailwindCSS with Bundui Premium components
- **Database:** Supabase with PostgreSQL
- **Testing:** Vitest, Playwright for E2E
- **State Management:** Zustand
- **Forms:** React Hook Form with Zod validation

**Dashboard App Sub-Applications (12+ specialized modules):**
- **ai-chat**: AI-powered chat interface
- **calendar**: Calendar and scheduling system
- **crm-dashboard**: Customer relationship management
- **crypto-dashboard**: Cryptocurrency tracking
- **ecommerce-dashboard**: E-commerce analytics
- **file-manager**: File management system
- **finance-dashboard**: Financial analytics
- **kanban**: Task management boards
- **mail**: Email management system
- **notes**: Note-taking application
- **pos-system**: Point-of-sale system
- **project-management**: Project tracking
- **sales-dashboard**: Sales analytics
- **tasks**: Task management
- **website-analytics**: Web analytics dashboard

## Critical Security Requirements

### Multi-tenant Data Isolation
```typescript
// ✅ CORRECT: Always filter by company_id
const data = await supabase
  .from('users')
  .select('*')
  .eq('company_id', user.company_id);

// ❌ SECURITY VIOLATION: Query without company_id filter
const data = await supabase.from('users').select('*');
```

### Role-based Access Control
```typescript
// ✅ Check permissions before access
if (hasPermission('ADMIN')) {
  // Admin functionality
}

// ✅ Use FeatureGate component
<FeatureGate permission="ADMIN">
  <AdminPanel />
</FeatureGate>
```

### Database Schema Pattern - Multi-tenant Security
```sql
-- ✅ REQUIRED: All tables MUST include company_id for RLS
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  email text NOT NULL,
  role user_role NOT NULL DEFAULT 'EMPLOYEE',
  created_at timestamp with time zone DEFAULT now()
);

-- ✅ RLS policies enforce company isolation
CREATE POLICY "Company isolation" ON users 
  FOR ALL USING (company_id = auth.jwt() ->> 'company_id');

-- ✅ Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### 5-Tier Role Hierarchy Implementation
```typescript
// Role hierarchy (ascending authority)
type UserRole = 
  | 'EMPLOYEE'     // 1. Basic user access
  | 'MANAGER'      // 2. Department-level access  
  | 'ADMIN'        // 3. Company administration
  | 'OWNER'        // 4. Full company access
  | 'SUPER_ADMIN'; // 5. Cross-company access (system administration)

// ✅ Role checking utility
const hasPermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy = ['EMPLOYEE', 'MANAGER', 'ADMIN', 'OWNER', 'SUPER_ADMIN'];
  const userLevel = roleHierarchy.indexOf(userRole);
  const requiredLevel = roleHierarchy.indexOf(requiredRole);
  return userLevel >= requiredLevel;
};

// ✅ Company isolation in queries
const getCompanyUsers = async (company_id: string) => {
  return await supabase
    .from('users')
    .select('*')
    .eq('company_id', company_id); // MANDATORY filter
};
```

### Security Validation Commands
```bash
npm run validate:security             # Security compliance validation
npm run validate:cross-app-compatibility # Cross-app security validation
npm run validate:ecosystem           # Complete security ecosystem check
```

## Development Standards

### Mock-First Development Strategy
The project currently uses **mocked Supabase integration** for UI-focused development:

```typescript
// Current state in src/integrations/supabase/client.ts
// Real Supabase client (commented out for UI development)
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock implementation currently active
export const supabase = {
  from: () => createMockQuery(),
  auth: { /* mock auth methods */ },
  // Comprehensive mock implementation for UI testing
};
```

**Important Notes:**
- **Current Mode**: Mock mode enabled for rapid UI development
- **Real Integration**: Available but disabled in `src/integrations/supabase/client.ts:17`
- **Security**: When switching to real Supabase, ensure all `company_id` filtering is implemented
- **Testing**: Mock supports complex queries for UI component testing

**Switching to Real Supabase:**
1. Uncomment real client in `src/integrations/supabase/client.ts:17`
2. Comment out mock implementation 
3. Ensure environment variables are set
4. Test RLS policies thoroughly
5. Validate all `company_id` filtering

### Import Patterns
```typescript
// ✅ Use path aliases for monorepo imports
import { Component } from '@/shared/components';
import { useAuth } from '@/shared/hooks';
import { apiClient } from '@/shared/services';

// ❌ Avoid relative imports across apps
import { Component } from '../../../shared/components';
```

### TypeScript Configuration - Development Reality
**Current State**: Strict mode is **DISABLED** for development velocity
```typescript
// tsconfig.app.json - Current configuration
{
  "compilerOptions": {
    "strict": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false
  }
}
```

**Development Guidelines:**
- Strict mode disabled for rapid prototyping and UI development
- Use proper type definitions from Supabase Database types when available
- Production builds should consider enabling strict mode
- Implement proper error handling with typed responses

### Component Development
- Follow the **Component Evaluation Guidelines** in `docs/development/COMPONENT_EVALUATION_GUIDELINES.md`
- For any Bundui Premium inspired components, follow strict decoupling and validation process
- All premium components must be reimplemented, not copied
- **Graphics Development**: Use `docs/development/BUNDUI_DECOUPLING_GUIDE.md` for chart/UI components
- **Chart Implementation**: Charts use Recharts with `hsl(var(--chart-X))` color variables

#### **DOI Principle - CRITICAL for ALL Components:**
**Rule**: Bundui Visual Fidelity + Shadcn Technical Compatibility
- **Colors**: Use HSL format `hsl(12 88% 59%)` NOT oklch - ensures shadcn/ui compatibility
- **Variables**: Always use `hsl(var(--variable))` pattern for theming
- **Base Components**: Prefer shadcn/ui components over custom implementations
- **Future-proof**: Prevents refactoring when adding new shadcn components

#### **Bundui Premium Component Path Structure:**
```typescript
// ✅ CORRECT: Bundui components location
src/shared/components/bundui-premium/
├── components/
│   ├── ui/                    # Base UI components (shadcn-compatible)
│   ├── theme-customizer/      # Theme system components
│   ├── layout/               # Layout components (sidebar, header)
│   └── [feature]/           # Feature-specific components
├── hooks/                    # Custom hooks
├── lib/                      # Utilities and theme definitions
└── index.ts                  # Main exports
```

#### **Color System - MANDATORY for Charts:**
```css
/* ✅ ALWAYS USE: HSL format for shadcn compatibility */
:root {
  --chart-1: 12 76% 61%;
  --chart-2: 173 58% 39%;
  --chart-3: 197 37% 24%;
}

/* ✅ In components: */
color: "hsl(var(--chart-1))"

/* ❌ NEVER USE: OKLCH format breaks shadcn/ui */
color: "oklch(0.5827 0.2418 12.23)"
```

## Testing Strategy

### Multi-tenant Testing
```typescript
// Test company isolation
describe('Multi-tenant Security', () => {
  it('should not access cross-company data', async () => {
    const company1User = createTestUser({ company_id: 'company1' });
    const company2Data = await fetchCompanyData(company1User, 'company2');
    expect(company2Data).toBeNull();
  });
});
```

### Role-based Testing
```typescript  
// Test role permissions
describe('Role-based Access', () => {
  it('should deny access to unauthorized roles', () => {
    const employee = createTestUser({ role: 'EMPLOYEE' });
    const canAccessAdmin = hasPermission(employee, 'ADMIN');
    expect(canAccessAdmin).toBe(false);
  });
});
```

## Documentation System

The project uses multiple Docusaurus sites for different audiences:
- `docusaurus-docs/`: User documentation
- `docusaurus-dev/`: Developer documentation  
- `docusaurus-api/`: API documentation
- `docusaurus-vthink/`: VThink 1.0 methodology
- `docusaurus-archives/`: Historical documentation

## VThink 1.0 Methodology Compliance

This project follows the **VThink 1.0 methodology** with these requirements:
- **Session Protocol:** Each development session should follow documented protocols
- **Quality Standards:** CMMI-ML3 compliance required
- **Security First:** Multi-tenant security is non-negotiable
- **Documentation:** Comprehensive documentation for all components and decisions
- **Validation:** All changes must pass validation scripts before commit

## Key Files and Configurations

- **Main config:** `package.json` (root) - contains all validation and build scripts
- **App configs:** Each app in `apps/` has its own `package.json`
- **TypeScript:** `tsconfig.json` (strict mode enabled)
- **Linting:** `eslint.config.js` 
- **Testing:** `vitest.config.ts` and `playwright.config.ts`
- **Styling:** `tailwind.config.ts`
- **Cursor Rules:** `.cursorrules` and `.cursor/rules.md` contain detailed development guidelines

## Quality Standards and Perfection Documentation

- **DASHBOARD_PERFECTION_STATUS.md** - Current GOLD STANDARD documentation
- **QUALITY_STANDARDS_CHECKLIST.md** - Comprehensive checklist to maintain perfection
- **Dashboard URL:** http://localhost:3001/ - Reference implementation at perfection level

### **CRITICAL: Before Any Dashboard Changes**
**ALWAYS consult these documents to maintain the established GOLD STANDARD:**
1. Review `DASHBOARD_PERFECTION_STATUS.md` for current perfection metrics
2. Follow `QUALITY_STANDARDS_CHECKLIST.md` step-by-step before any modifications
3. Test against the reference dashboard at http://localhost:3001/
4. Run all validation scripts to ensure quality standards are maintained

## Anti-patterns to Avoid

- **Never bypass company_id filtering** in database queries
- **Never use relative imports** across app boundaries  
- **Never skip validation scripts** before committing
- **Never copy proprietary code** from external sources
- **Never commit without proper testing** and documentation
- **Never deploy changes without ecosystem validation** (`npm run validate:ecosystem`)
- **Never update external dependencies without risk assessment** (`npm run validate:external-update`)

## Development Tools Ecosystem

### Comprehensive Automation Framework
The project includes **100+ development automation scripts** organized in `dev-tools/`:

```
dev-tools/
├── agents/           # AI-specific development patterns and workflows
├── automation/       # Code cleanup and standardization utilities
├── deployment/       # Deployment strategies and backup automation
├── documentation/    # Auto-documentation generation tools
├── scripts/          # Core development and setup scripts
├── testing/          # Comprehensive testing utilities
├── utilities/        # 80+ specialized development utilities
└── validation/       # Multi-layer validation systems
```

### Key Automation Scripts
**Critical Development Tools:**
- `validate-root-clean.cjs`: Ensures repository cleanliness and organization
- `cross-app-validator.cjs`: Validates compatibility between monorepo apps
- `shared-component-validator.cjs`: Tracks shared component usage and impact
- `validate-sidebar-consistency.cjs`: Ensures UI consistency across applications
- `bundui-compatibility-check.js`: Validates Bundui Premium integration standards

**Advanced Validation Systems:**
- `dependency-validator.cjs`: Analyzes dependency conflicts and compatibility
- `performance-validator.cjs`: Monitors performance metrics and thresholds
- `security-validator.cjs`: Security compliance and vulnerability assessment
- `external-update-validator.js`: Risk assessment for external dependencies

### AI-Optimized Command Patterns
```bash
# Ecosystem-wide validation and monitoring
npm run validate:ecosystem              # Complete system health check
npm run validate:cross-app-compatibility # Inter-application compatibility
npm run validate:shared-component-impact # Component change impact analysis

# Risk-appropriate deployment workflows
npm run validate:external-update        # External dependency risk assessment
npm run validate:new-feature           # New feature compliance validation
npm run validate:workspace-compatibility # Monorepo workspace integrity
```

## AI-First Development Guidelines

### **VThink is AI-Friendly by Design**
This codebase is optimized for AI-human collaboration. Key AI-friendly patterns:

- **Structured decision trees** for risk assessment and validation
- **Predictable command patterns** (`validate:*`, `test:*`, `deploy:*`)
- **Standardized response formats** for all validation scripts
- **Clear documentation** that AI can parse and update
- **Measurable outcomes** with quantifiable success criteria

### **AI Collaboration Commands**
```bash
# AI can interpret and execute these workflows
npm run validate:ecosystem              # Complete ecosystem validation
npm run validate:external-update        # External dependency risk assessment  
npm run test:cross-app-compatibility    # Cross-application testing
npm run validate:shared-component       # Shared component impact analysis
npm run deploy:canary                   # Risk-appropriate deployment
```

### **AI Integration Points**
- **Change Analysis**: AI can calculate risk scores from git diffs
- **Test Selection**: AI can determine optimal testing strategies
- **Documentation**: AI can update docs based on architectural changes
- **Monitoring**: AI can track performance and suggest improvements