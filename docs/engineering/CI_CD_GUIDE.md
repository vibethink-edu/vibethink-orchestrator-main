# CI/CD Configuration Guide

## Overview

This repository uses GitHub Actions for continuous integration and deployment with the following quality gates:

- **Lint**: Code style and quality checks
- **Format**: Code formatting verification
- **Typecheck**: TypeScript type checking
- **Test**: Unit and integration tests
- **Build**: Production build verification

## Workflows

### Main CI Pipeline (`.github/workflows/ci.yml`)

**Triggers**:
- Push to `main`, `develop`, `feat/*`, `fix/*` branches
- Pull requests to `main`, `develop`

**Jobs**:
1. `ci / lint` - ESLint checks via Turbo
2. `ci / format` - Prettier/formatting checks via Turbo
3. `ci / typecheck` - TypeScript type checking via Turbo
4. `ci / test` - Unit/integration tests via Turbo
5. `ci / build` - Production build via Turbo
6. `ci / all-checks` - Summary job (for branch protection)

**Features**:
- Concurrency control (cancels in-progress runs for same branch)
- npm caching for faster installs
- Artifact uploads (coverage, build output)
- Timeout limits per job
- `--if-present` flags (graceful degradation if scripts missing)

---

### Security Scanning (`.github/workflows/codeql.yml`)

**Triggers**:
- Push to `main`, `develop`
- Pull requests to `main`
- Weekly schedule (Mondays at 00:00 UTC)

**Jobs**:
1. `security / codeql` - CodeQL security analysis

**Features**:
- Automated vulnerability detection
- JavaScript/TypeScript scanning
- Security advisories integration

---

## Branch Protection Configuration

### Required Status Checks for `main` branch

Configure the following checks as **required** in GitHub Settings → Branches → Branch protection rules:

```
ci / lint
ci / format
ci / typecheck
ci / test
ci / build
```

**Recommended Settings**:
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings
- ⚠️ Optional: `security / codeql` (recommended but not blocking)

### GitHub Settings Path

1. Go to repository **Settings**
2. Navigate to **Branches** (left sidebar)
3. Click **Add rule** or edit existing rule for `main`
4. Enable **Require status checks to pass before merging**
5. Search and select the 5 required checks listed above
6. Enable **Require branches to be up to date before merging**
7. Click **Save changes**

---

## Local Development

### Running CI Checks Locally

```bash
# Run all checks (same as CI)
npm run lint
npm run format
npm run type-check
npm run test
npm run build

# Or use Turbo directly for parallel execution
npx turbo run lint format type-check test build
```

### Pre-commit Hooks (Optional)

If using Husky (already configured in `.husky/`):

```bash
# Install hooks
npm install

# Hooks will run automatically on git commit
```

---

## Package Manager Detection

The CI automatically detects the package manager:

- **Current**: npm (detected via `package-lock.json`)
- **Fallback**: If `pnpm-lock.yaml` exists, would use `pnpm`

**Cache Strategy**:
- Uses `actions/setup-node@v4` built-in caching
- Cache key: `package-lock.json` hash
- Speeds up installs by ~60-80%

---

## Monorepo Support

This is a **Turbo monorepo** with workspaces:

```
apps/*       - Applications
packages/*   - Shared packages
```

**CI Behavior**:
- Turbo runs tasks across all workspaces
- Uses `--if-present` to skip missing scripts gracefully
- Parallel execution where possible (Turbo handles dependency graph)

---

## Troubleshooting

### Job Failing: "script not found"

**Cause**: Workspace missing a required script (e.g., `format`)

**Solution**: Add script to workspace `package.json` or ensure Turbo config allows optional tasks:

```json
// turbo.json
{
  "pipeline": {
    "format": {
      "cache": false
    }
  }
}
```

### Job Timing Out

**Cause**: Build/test taking too long

**Solution**: Increase timeout in `.github/workflows/ci.yml`:

```yaml
jobs:
  build:
    timeout-minutes: 30  # Increase from 20
```

### Cache Not Working

**Cause**: `package-lock.json` changed or cache corrupted

**Solution**: Cache auto-invalidates on lockfile change. If issues persist:

```yaml
# Temporarily disable cache to debug
- uses: actions/setup-node@v4
  with:
    node-version: ${{ env.NODE_VERSION }}
    # cache: npm  # Comment out
```

### CodeQL Failing

**Cause**: Security vulnerabilities detected

**Solution**: Review CodeQL alerts in **Security** tab and fix issues. To skip temporarily:

```yaml
# In codeql.yml, make non-blocking
continue-on-error: true
```

---

## Performance Optimizations

Current optimizations:

1. **Concurrency Control**: Cancels redundant runs
2. **npm Caching**: Reuses dependencies across runs
3. **Turbo Caching**: Reuses build outputs (if configured)
4. **Parallel Jobs**: Lint/format/typecheck run in parallel
5. **Artifact Retention**: 7 days (reduces storage costs)

**Future Optimizations**:
- Enable Turbo Remote Cache (requires setup)
- Use `actions/cache@v4` for Turbo cache
- Split test job by workspace for parallel execution

---

## Maintenance

### Updating Node Version

Edit `.github/workflows/ci.yml` and `.github/workflows/codeql.yml`:

```yaml
env:
  NODE_VERSION: "22"  # Update here
```

### Adding New Quality Gates

1. Add job to `ci.yml`:

```yaml
jobs:
  my-new-check:
    name: my-new-check
    runs-on: ubuntu-latest
    steps:
      # ... steps
```

2. Add to `all-checks` dependencies:

```yaml
jobs:
  all-checks:
    needs: [lint, format, typecheck, test, build, my-new-check]
```

3. Update branch protection rules in GitHub Settings

---

## Security

### Secrets Required

None currently required for basic CI.

**Optional** (for extended features):
- `CODECOV_TOKEN` - For coverage reporting
- `VITE_SUPABASE_URL` - For E2E tests
- `VITE_SUPABASE_ANON_KEY` - For E2E tests

### Permissions

Workflows use minimal permissions:

- `ci.yml`: Default (read-only)
- `codeql.yml`: `security-events: write` (for CodeQL alerts)

---

## Migration Notes

### From Previous CI

**Breaking Changes**:
- Job names changed to exact format: `ci / <check>`
- Removed complex multi-stage pipeline
- Removed deployment jobs (moved to separate workflow if needed)

**Migration Checklist**:
- ✅ Update branch protection rules with new job names
- ✅ Verify all workspaces have required scripts
- ✅ Test CI on feature branch before merging
- ⚠️ Remove old workflow files if no longer needed

---

## Support

For issues or questions:

1. Check **Actions** tab for detailed logs
2. Review this guide's **Troubleshooting** section
3. Consult Turbo docs: https://turbo.build/repo/docs
4. Open issue in repository
