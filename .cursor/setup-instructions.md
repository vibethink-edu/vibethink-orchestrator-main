
# Cursor IDE Setup Instructions

## Quick Setup for AI Pair Orchestrator Pro

### 1. Import Rules Configuration
1. **Copy all files** from `.cursor/rules/` to your project's `.cursor/rules/` directory
2. **Restart Cursor IDE** to load new configuration
3. **Verify import**: Check that Cursor recognizes the rules by typing a comment like `// TODO: test multi-tenant query` - Cursor should suggest the secure query pattern

### 2. Enable Enterprise Features
Add to your **Cursor Settings** (`.vscode/settings.json` or Cursor Settings UI):

```json
{
  "cursor.chat.includeCodeFromReferencedFiles": true,
  "cursor.chat.alwaysSearchWeb": false,
  "cursor.prediction.enabled": true,
  "cursor.prediction.trigger": "auto",
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.strictMode": true
}
```

### 3. Development Workflow Integration

#### Phase Commands
Create these commands in your IDE for Sprint 3:

```bash
# Slice Development Commands
cursor-slice-start:   "Start new vertical slice development"
cursor-slice-check:   "Validate slice completion criteria"  
cursor-slice-deploy:  "Deploy completed slice"
cursor-security-scan: "Run multi-tenant security checks"
```

#### Auto-completion Triggers
The rules will trigger intelligent suggestions for:
- **Multi-tenant queries**: When typing `supabase.from(`
- **Role checks**: When typing `hasPermission(`
- **Error boundaries**: When creating new components
- **Type definitions**: When defining interfaces
- **AI operations**: When working with edge functions

### 4. Quality Gate Integration

#### Pre-commit Hooks (optional but recommended)
```bash
# Install husky for git hooks
npm install --save-dev husky

# Add pre-commit rule validation
npx husky add .husky/pre-commit "cursor --validate-rules"
```

#### Continuous Validation
The rules include automatic validation for:
- ✅ Company_id filtering in all queries
- ✅ TypeScript strict mode compliance  
- ✅ Component size limits (150 lines)
- ✅ Error handling patterns
- ✅ Performance optimization

### 5. Sprint 3 Focus Areas

#### AI Edge Functions Development
When working on Sprint 3, Cursor will automatically suggest:
1. **meeting-processor** patterns and templates
2. **resource-scraper** implementation guidelines
3. **content-pipeline** workflow structures
4. **ai-transcriber** optimization patterns

#### Security-First Development
Every suggestion will prioritize:
- Multi-tenant data isolation
- Role-based access control
- Audit logging requirements
- Usage tracking patterns

### 6. Immediate Benefits

After setup, you'll get:
- **Smart Code Completion**: Context-aware suggestions following enterprise patterns
- **Security Validation**: Real-time checking for multi-tenant compliance
- **Performance Optimization**: Automatic suggestions for React Query, memoization
- **Type Safety**: Comprehensive TypeScript support with zero-any policies
- **Testing Guidance**: Integrated testing patterns for business logic

### 7. Troubleshooting

#### If rules aren't loading:
1. Ensure `.cursor/rules.md` exists and is valid markdown
2. Restart Cursor IDE completely
3. Check Cursor logs for rule parsing errors
4. Verify file permissions on `.cursor/` directory

#### If suggestions seem off-target:
1. Reference specific rule files with `@rule-name.md` in comments
2. Use explicit comments like `// Apply multi-tenant-security patterns`
3. Check that your current file context matches the rule patterns

### 8. Custom Rule Extensions

To add project-specific rules:
1. Create new `.md` files in `.cursor/rules/`
2. Follow the pattern: Problem → Solution → Example
3. Reference existing rules with `@filename.md`
4. Add to main `rules.md` under ACTIVE RULE SETS

### Success Indicators
- ✅ Cursor suggests company_id filtering automatically
- ✅ TypeScript errors for `any` types
- ✅ Performance optimization suggestions appear
- ✅ Security patterns recommended in edge functions
- ✅ Component architecture guidance provided

Your Cursor IDE is now configured for enterprise-grade development with the AI Pair Orchestrator Pro project!
