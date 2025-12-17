#!/usr/bin/env node

/**
 * Shadcn UI Component Updater
 * 
 * Automatically downloads and updates Shadcn UI components from GitHub.
 * 
 * Usage:
 *   node scripts/update-shadcn.js card badge button
 *   node scripts/update-shadcn.js --all
 *   node scripts/update-shadcn.js --list
 */

const fs = require('fs').promises
const path = require('path')
const https = require('https')

// Configuration
// Shadcn UI GitHub URLs - try multiple registry styles
const GITHUB_URLS = [
    'https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/registry/default/ui',
    'https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/registry/new-york/ui',
    'https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/registry/default'
]
const COMPONENTS_DIR = path.join(__dirname, '../packages/ui/src/components')
const UTILS_DIR = path.join(__dirname, '../packages/ui/src/lib')

// Ensure directories exist
async function ensureDirectories() {
    try {
        await fs.mkdir(COMPONENTS_DIR, { recursive: true })
        await fs.mkdir(UTILS_DIR, { recursive: true })
    } catch (error) {
        // Directories might already exist, ignore
    }
}

// Available components
const AVAILABLE_COMPONENTS = [
    'avatar',
    'badge',
    'button',
    'card',
    'checkbox',
    'dialog',
    'form',
    'input',
    'label',
    'progress',
    'select',
    'separator',
    'sheet',
    'table',
    'tabs',
    'toast',
    'toaster',
]

// Color codes for terminal
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
}

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`)
}

/**
 * Download file from URL with timeout and retry
 */
function downloadFile(url, retries = 2) {
    return new Promise((resolve, reject) => {
        const timeout = 15000 // 15 seconds timeout
        let attemptsLeft = retries

        const makeRequest = () => {
            let timeoutId
            
            const request = https.get(url, (res) => {
                clearTimeout(timeoutId)

                if (res.statusCode === 404) {
                    reject(new Error(`Component not found on GitHub: ${url}`))
                    return
                }

                if (res.statusCode !== 200) {
                    reject(new Error(`HTTP ${res.statusCode}: ${url}`))
                    return
                }

                let data = ''
                res.on('data', (chunk) => data += chunk)
                res.on('end', () => resolve(data))
            })

            request.on('error', (error) => {
                clearTimeout(timeoutId)
                
                // Retry logic
                if (attemptsLeft > 0) {
                    attemptsLeft--
                    log(`   ⚠️  Network error, retrying (${attemptsLeft} attempts left)...`, 'yellow')
                    setTimeout(() => {
                        makeRequest()
                    }, 1000)
                } else {
                    reject(error)
                }
            })

            // Set timeout
            timeoutId = setTimeout(() => {
                request.destroy()
                if (attemptsLeft > 0) {
                    attemptsLeft--
                    log(`   ⚠️  Timeout, retrying (${attemptsLeft} attempts left)...`, 'yellow')
                    setTimeout(() => {
                        makeRequest()
                    }, 1000)
                } else {
                    reject(new Error(`Request timeout after ${timeout}ms`))
                }
            }, timeout)
        }

        makeRequest()
    })
}

/**
 * Update a single component
 */
async function updateComponent(name) {
    try {
        log(`\n📦 Updating ${name}...`, 'cyan')

        // Try multiple URL patterns
        let code
        let lastError
        
        for (const baseUrl of GITHUB_URLS) {
            const url = `${baseUrl}/${name}.tsx`
            try {
                log(`   🔍 Trying: ${baseUrl.split('/').pop()}...`, 'gray')
                code = await downloadFile(url, 1) // Reduced retries for faster failure
                log(`   ✅ Found at: ${baseUrl.split('/').pop()}`, 'green')
                break
            } catch (error) {
                lastError = error
                continue
            }
        }
        
        if (!code) {
            throw lastError || new Error('All URL patterns failed')
        }

        // Fix imports to use local utils
        const fixedCode = code
            .replace(/from ["']@\/lib\/utils["']/g, 'from "../lib/utils"')
            .replace(/from ["']@\/components\/ui\/([^"']+)["']/g, (match, component) => {
                // Handle internal component imports
                if (component === name) {
                    return match // Don't change self-imports
                }
                return `from "./${component}"`
            })

        const filePath = path.join(COMPONENTS_DIR, `${name}.tsx`)
        await fs.writeFile(filePath, fixedCode, 'utf-8')

        log(`   ✅ ${name}.tsx updated`, 'green')
        return true
    } catch (error) {
        log(`   ❌ Failed: ${error.message}`, 'red')
        return false
    }
}

/**
 * Update utils.ts
 */
async function updateUtils() {
    try {
        log(`\n🔧 Updating utils.ts...`, 'cyan')

        const url = 'https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/lib/utils.ts'
        const code = await downloadFile(url)

        const filePath = path.join(UTILS_DIR, 'utils.ts')
        await fs.writeFile(filePath, code, 'utf-8')

        log(`   ✅ utils.ts updated`, 'green')
        return true
    } catch (error) {
        log(`   ❌ Failed: ${error.message}`, 'red')
        return false
    }
}

/**
 * List available components
 */
function listComponents() {
    log('\n📋 Available Shadcn UI Components:\n', 'cyan')
    AVAILABLE_COMPONENTS.forEach((name, i) => {
        log(`   ${i + 1}. ${name}`, 'gray')
    })
    log('')
}

/**
 * Update all components
 */
async function updateAll() {
    log('\n🚀 Updating all components...', 'yellow')

    let success = 0
    let failed = 0

    // Update utils first
    const utilsOk = await updateUtils()
    if (utilsOk) success++
    else failed++

    // Update all components
    for (const name of AVAILABLE_COMPONENTS) {
        const ok = await updateComponent(name)
        if (ok) success++
        else failed++
    }

    log(`\n📊 Summary:`, 'cyan')
    log(`   ✅ Success: ${success}`, 'green')
    if (failed > 0) {
        log(`   ❌ Failed: ${failed}`, 'red')
    }
}

/**
 * Main function
 */
async function main() {
    // Ensure directories exist
    await ensureDirectories()
    
    const args = process.argv.slice(2)

    if (args.length === 0) {
        log('\n❌ No components specified', 'red')
        log('\nUsage:', 'yellow')
        log('  node scripts/update-shadcn.js card badge button', 'gray')
        log('  node scripts/update-shadcn.js --all', 'gray')
        log('  node scripts/update-shadcn.js --list', 'gray')
        process.exit(1)
    }

    // List components
    if (args.includes('--list') || args.includes('-l')) {
        listComponents()
        return
    }

    // Update all
    if (args.includes('--all') || args.includes('-a')) {
        await updateAll()
        return
    }

    // Update specific components
    log('\n🔄 Updating Shadcn UI components from GitHub...', 'yellow')

    let success = 0
    let failed = 0

    for (const name of args) {
        if (!AVAILABLE_COMPONENTS.includes(name)) {
            log(`\n⚠️  Unknown component: ${name}`, 'yellow')
            log(`   Run with --list to see available components`, 'gray')
            failed++
            continue
        }

        const ok = await updateComponent(name)
        if (ok) success++
        else failed++
    }

    log(`\n📊 Summary:`, 'cyan')
    log(`   ✅ Success: ${success}`, 'green')
    if (failed > 0) {
        log(`   ❌ Failed: ${failed}`, 'red')
    }

    log('\n💡 Next steps:', 'cyan')
    log('   1. Review changes: git diff packages/ui/src/components/', 'gray')
    log('   2. Update exports: packages/ui/src/index.ts', 'gray')
    log('   3. Install dependencies if needed: cd packages/ui && npm install', 'gray')
    log('   4. Test components in dashboard', 'gray')
    log('')
}

// Run
main().catch((error) => {
    log(`\n❌ Fatal Error: ${error.message}`, 'red')
    if (error.stack) {
        log(`\nStack trace:`, 'gray')
        log(error.stack, 'gray')
    }
    process.exit(1)
})
