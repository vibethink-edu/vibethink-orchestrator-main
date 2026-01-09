#!/bin/bash
# ViTo Governance Baseline v1 (VGB-1) Validator
# Enforces static norms defined in docs/governance/vito-governance-baseline-v1.md
# EXIT CODES: 0=PASS, 1=FAIL

set -e

# Configuration
EXIT_CODE=0
FORBIDDEN_PATTERNS="XTP|XTR|AIPAIR|xtp-|xtr-|aipair-|XTP v|XTP v4"
LICENSE_PATTERNS="GPL|AGPL"

echo "🔍 ViTo Governance Validator (VGB-1)"
echo "-----------------------------------"

# Rule G1: Methodology Branding (BLOCKER)
echo "Running G1: Methodology Branding Check..."
# Using find to exclude directories properly and handle ignore-case grep
FOUND_BRANDING=$(grep -rnE "($FORBIDDEN_PATTERNS)" . \
  --exclude-dir=_legacy \
  --exclude-dir=node_modules \
  --exclude-dir=dist \
  --exclude-dir=build \
  --exclude-dir=.next \
  --exclude-dir=.turbo \
  --exclude-dir=.git \
  --exclude=pnpm-lock.yaml \
  --exclude=package-lock.json \
  --exclude=validate-governance.sh \
  --exclude=validate-governance.ps1 \
  --ignore-case || true)

if [ ! -z "$FOUND_BRANDING" ]; then
  echo "❌ FAIL: Forbidden methodology branding found:"
  echo "$FOUND_BRANDING"
  EXIT_CODE=1
else
  echo "✅ PASS: No forbidden branding found."
fi

# Rule G2: Licensing (BLOCKER)
echo -e "\nRunning G2: Licensing Check (package.json)..."
FOUND_LICENSES=$(grep -rnE "($LICENSE_PATTERNS)" . \
  --include="package.json" \
  --exclude-dir=_legacy \
  --exclude-dir=node_modules \
  --exclude-dir=dist \
  --exclude-dir=build \
  --exclude-dir=.next \
  --exclude-dir=.turbo \
  --exclude-dir=.git \
  --ignore-case || true)

if [ ! -z "$FOUND_LICENSES" ]; then
  echo "❌ FAIL: Forbidden licenses (GPL/AGPL) found:"
  echo "$FOUND_LICENSES"
  EXIT_CODE=1
else
  echo "✅ PASS: No forbidden licenses found."
fi

# Rule G3: Naming Convention (Preventive - docs/governance/closures)
echo -e "\nRunning G3: Naming Convention Check..."
# Check for uppercase in .md files under closures, excluding INDEX/README
FOUND_BAD_NAMES=$(find docs/governance/closures -type f -name "*.md" ! -name "INDEX.md" ! -name "README.md" | grep "[A-Z]" || true)

if [ ! -z "$FOUND_BAD_NAMES" ]; then
  echo "⚠️ WARN: Non-kebab-case filenames found (Preventive Check):"
  echo "$FOUND_BAD_NAMES"
  # EXIT_CODE=1 # Enable to BLOCK
else
  echo "✅ PASS: Naming conventions respected in closures/."
fi

# Summary
echo -e "\n-----------------------------------"
if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ VGB-1 VALIDATION PASSED"
  exit 0
else
  echo "❌ VGB-1 VALIDATION FAILED"
  exit 1
fi
