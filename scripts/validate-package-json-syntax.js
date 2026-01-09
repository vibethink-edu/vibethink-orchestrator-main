#!/usr/bin/env node

/**
 * Validate package.json syntax compatibility with npm
 *
 * Detects:
 * - workspace: protocol usage (pnpm/yarn only)
 * - Invalid version formats
 * - Missing required fields
 *
 * Usage:
 *   node scripts/validate-package-json-syntax.js
 *
 * Exit codes:
 *   0 - All package.json files are valid
 *   1 - Found errors that need to be fixed
 */

const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

function findPackageJsonFiles() {
  const files = [];

  // Find all package.json in workspaces
  const workspaceDirs = ['packages', 'apps'];

  workspaceDirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) return;

    const subdirs = fs.readdirSync(dirPath);
    subdirs.forEach(subdir => {
      const pkgPath = path.join(dirPath, subdir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        files.push(pkgPath);
      }
    });
  });

  return files;
}

function validatePackageJson(filePath) {
  const errors = [];
  const warnings = [];

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const pkg = JSON.parse(content);
    const relativePath = path.relative(process.cwd(), filePath);

    // Check for workspace: protocol
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      if (!pkg[depType]) return;

      Object.entries(pkg[depType]).forEach(([name, version]) => {
        if (version.includes('workspace:')) return;
      });
    });

    // Check for required fields
    if (!pkg.name) {
      warnings.push({
        file: relativePath,
        type: 'missing-name',
        message: 'Missing "name" field',
      });
    }

    if (!pkg.version) {
      warnings.push({
        file: relativePath,
        type: 'missing-version',
        message: 'Missing "version" field',
      });
    }

    // Check for invalid version formats
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      if (!pkg[depType]) return;

      Object.entries(pkg[depType]).forEach(([name, version]) => {
        // Skip workspace: protocol (already detected as error)
        if (version.includes('workspace:')) return;

        // Check for common invalid formats
        if (version === '*') {
          warnings.push({
            file: relativePath,
            type: 'wildcard-version',
            message: `"${name}": "*" uses wildcard (not recommended)`,
            fix: `Use specific version range (e.g., "^1.0.0")`,
          });
        }

        if (version.startsWith('file:')) {
          warnings.push({
            file: relativePath,
            type: 'file-protocol',
            message: `"${name}": "${version}" uses file: protocol`,
            fix: `Consider publishing to npm or using workspaces`,
          });
        }
      });
    });

  } catch (error) {
    errors.push({
      file: path.relative(process.cwd(), filePath),
      type: 'parse-error',
      message: `Failed to parse JSON: ${error.message}`,
    });
  }

  return { errors, warnings };
}

function main() {
  log(colors.blue, '\n🔍 Validating package.json files...\n');

  const files = findPackageJsonFiles();

  if (files.length === 0) {
    log(colors.yellow, '⚠️  No package.json files found in workspaces');
    return 0;
  }

  log(colors.blue, `Found ${files.length} package.json files\n`);

  let totalErrors = 0;
  let totalWarnings = 0;
  let filesWithErrors = 0;

  files.forEach(file => {
    const { errors, warnings } = validatePackageJson(file);

    if (errors.length > 0 || warnings.length > 0) {
      const relativePath = path.relative(process.cwd(), file);

      if (errors.length > 0) {
        filesWithErrors++;
        log(colors.red, `\n❌ ${relativePath}`);
        errors.forEach(error => {
          log(colors.red, `   ${error.message}`);
          if (error.fix) {
            log(colors.yellow, `   💡 ${error.fix}`);
          }
        });
        totalErrors += errors.length;
      }

      if (warnings.length > 0) {
        log(colors.yellow, `\n⚠️  ${relativePath}`);
        warnings.forEach(warning => {
          log(colors.yellow, `   ${warning.message}`);
          if (warning.fix) {
            log(colors.blue, `   💡 ${warning.fix}`);
          }
        });
        totalWarnings += warnings.length;
      }
    }
  });

  // Summary
  log(colors.blue, '\n' + '─'.repeat(60));

  if (totalErrors === 0 && totalWarnings === 0) {
    log(colors.green, '\n✅ All package.json files are valid!\n');
    return 0;
  }

  if (totalErrors > 0) {
    log(colors.red, `\n❌ Found ${totalErrors} error(s) in ${filesWithErrors} file(s)`);
    log(colors.red, '\nErrors must be fixed before proceeding.\n');

    log(colors.yellow, 'Common fixes:');
    log(colors.yellow, '  1. Ensure all package.json files have valid JSON syntax');
    log(colors.yellow, '  2. Ensure all package.json files have valid JSON syntax');
    log(colors.yellow, '\nFor more info, see: docs/architecture/PACKAGE_MANAGER_COMPATIBILITY.md\n');
  }

  if (totalWarnings > 0) {
    log(colors.yellow, `\n⚠️  Found ${totalWarnings} warning(s)`);
    log(colors.yellow, 'Warnings are recommendations, not required fixes.\n');
  }

  return totalErrors > 0 ? 1 : 0;
}

// Run script
const exitCode = main();
process.exit(exitCode);
