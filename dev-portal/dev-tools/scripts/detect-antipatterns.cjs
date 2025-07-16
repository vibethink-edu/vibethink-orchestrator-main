#!/usr/bin/env node

/**
 * 🚨 ANTI-PATTERN DETECTOR 
 * Detecta menciones de componentes externos sin evaluación formal
 * Parte del VThink 1.0 Component Evaluation Framework
 */

const fs = require('fs');
const path = require('path');

class AntiPatternDetector {
    constructor() {
        this.patterns = {
            // Detectar menciones de componentes sin evaluación
            componentMentions: [
                /(?:usar|implementar|integrar|portar|considerar|sugerir|recomendar)\s+([a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9])/gi,
                /([a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9])\s+(?:como|es|sería)\s+(?:alternativa|opción|solución)/gi,
                /podríamos?\s+(?:usar|implementar|integrar)\s+([a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9])/gi
            ],
            
            // Detectar frases que indican decisiones sin evaluación
            unevaluatedDecisions: [
                /no\s+se\s+puede(?:\s+portar|\s+integrar|\s+usar)?/gi,
                /es\s+imposible/gi,
                /no\s+es\s+viable\s+sin\s+(?:esfuerzo|estimación)/gi,
                /descartamos?\s+\w+\s+por/gi
            ],
            
            // Detectar menciones específicas de herramientas conocidas
            knownTools: [
                /\b(?:n8n|zapier|make|integromat|pipedream|automate\.io|workato|tray\.io)\b/gi,
                /\b(?:docker|kubernetes|redis|postgresql|mongodb|elasticsearch)\b/gi,
                /\b(?:react|vue|angular|svelte|next\.js|nuxt|gatsby)\b/gi,
                /\b(?:express|fastify|koa|nest\.js|django|flask|rails)\b/gi
            ]
        };
        
        this.evaluatedComponents = this.loadEvaluatedComponents();
        this.antiPatterns = [];
    }
    
    loadEvaluatedComponents() {
        const effortReportsDir = 'docs/PROJECT/02_ARCHITECTURE/STACK_MANAGEMENT/EFFORT_REPORTS';
        const blockerReportsDir = 'docs/PROJECT/02_ARCHITECTURE/STACK_MANAGEMENT/BLOCKER_REPORTS';
        
        const evaluated = new Set();
        
        try {
            // Cargar componentes con reportes de esfuerzo
            if (fs.existsSync(effortReportsDir)) {
                const effortReports = fs.readdirSync(effortReportsDir);
                effortReports.forEach(report => {
                    const match = report.match(/^([^_]+)_effort_estimation/);
                    if (match) evaluated.add(match[1].toLowerCase());
                });
            }
            
            // Cargar componentes con reportes de blockers
            if (fs.existsSync(blockerReportsDir)) {
                const blockerReports = fs.readdirSync(blockerReportsDir);
                blockerReports.forEach(report => {
                    const match = report.match(/^([^_]+)_blockers_check/);
                    if (match) evaluated.add(match[1].toLowerCase());
                });
            }
        } catch (error) {
            console.warn('⚠️  No se pudieron cargar componentes evaluados:', error.message);
        }
        
        return Array.from(evaluated);
    }
    
    scanText(text, source = 'unknown') {
        const findings = [];
        
        // Buscar menciones de componentes
        this.patterns.componentMentions.forEach((pattern, index) => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const component = match[1].toLowerCase();
                if (!this.evaluatedComponents.includes(component) && component.length > 2) {
                    findings.push({
                        type: 'UNEVALUATED_COMPONENT',
                        component: component,
                        context: this.getContext(text, match.index, 50),
                        severity: 'HIGH',
                        patternIndex: index,
                        source: source,
                        position: match.index
                    });
                }
            }
        });
        
        // Buscar decisiones sin evaluación
        this.patterns.unevaluatedDecisions.forEach((pattern, index) => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                findings.push({
                    type: 'UNEVALUATED_DECISION',
                    phrase: match[0],
                    context: this.getContext(text, match.index, 100),
                    severity: 'CRITICAL',
                    patternIndex: index,
                    source: source,
                    position: match.index
                });
            }
        });
        
        // Buscar herramientas conocidas sin evaluación
        this.patterns.knownTools.forEach((pattern, index) => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const tool = match[0].toLowerCase();
                if (!this.evaluatedComponents.includes(tool)) {
                    findings.push({
                        type: 'KNOWN_TOOL_UNEVALUATED',
                        component: tool,
                        context: this.getContext(text, match.index, 80),
                        severity: 'MEDIUM',
                        patternIndex: index,
                        source: source,
                        position: match.index
                    });
                }
            }
        });
        
        return findings;
    }
    
    getContext(text, position, radius = 50) {
        const start = Math.max(0, position - radius);
        const end = Math.min(text.length, position + radius);
        return '...' + text.substring(start, end) + '...';
    }
    
    scanFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return this.scanText(content, filePath);
        } catch (error) {
            console.error(`❌ Error leyendo archivo ${filePath}:`, error.message);
            return [];
        }
    }
    
    scanDirectory(dirPath, extensions = ['.md', '.txt', '.js', '.ts', '.json']) {
        const allFindings = [];
        
        const scanRecursive = (currentPath) => {
            try {
                const entries = fs.readdirSync(currentPath, { withFileTypes: true });
                
                entries.forEach(entry => {
                    const fullPath = path.join(currentPath, entry.name);
                    
                    if (entry.isDirectory()) {
                        // Skip node_modules, .git, etc.
                        if (!['node_modules', '.git', 'coverage', 'dist', 'build'].includes(entry.name)) {
                            scanRecursive(fullPath);
                        }
                    } else if (entry.isFile()) {
                        const ext = path.extname(entry.name);
                        if (extensions.includes(ext)) {
                            const findings = this.scanFile(fullPath);
                            allFindings.push(...findings);
                        }
                    }
                });
            } catch (error) {
                console.warn(`⚠️  No se pudo escanear directorio ${currentPath}:`, error.message);
            }
        };
        
        scanRecursive(dirPath);
        return allFindings;
    }
    
    generateReport(findings) {
        const report = {
            timestamp: new Date().toISOString(),
            evaluatedComponents: this.evaluatedComponents,
            totalFindings: findings.length,
            findingsBySeverity: this.groupBySeverity(findings),
            findingsByType: this.groupByType(findings),
            details: findings,
            recommendations: this.generateRecommendations(findings)
        };
        
        return report;
    }
    
    groupBySeverity(findings) {
        return findings.reduce((acc, finding) => {
            acc[finding.severity] = (acc[finding.severity] || 0) + 1;
            return acc;
        }, {});
    }
    
    groupByType(findings) {
        return findings.reduce((acc, finding) => {
            acc[finding.type] = (acc[finding.type] || 0) + 1;
            return acc;
        }, {});
    }
    
    generateRecommendations(findings) {
        const recommendations = [];
        
        findings.forEach(finding => {
            switch (finding.type) {
                case 'UNEVALUATED_COMPONENT':
                    recommendations.push({
                        action: 'EVALUATE_COMPONENT',
                        component: finding.component,
                        steps: [
                            `scripts/check-blockers.cjs ${finding.component}`,
                            `scripts/analyze-candidate-stack.cjs ${finding.component}`,
                            `scripts/estimate-effort-by-scenario.cjs ${finding.component}`
                        ]
                    });
                    break;
                    
                case 'UNEVALUATED_DECISION':
                    recommendations.push({
                        action: 'PROVIDE_EFFORT_ESTIMATE',
                        context: finding.context,
                        steps: [
                            'Identificar componente mencionado',
                            'Ejecutar proceso de evaluación completo',
                            'Reemplazar "no se puede" con estimación de esfuerzo'
                        ]
                    });
                    break;
                    
                case 'KNOWN_TOOL_UNEVALUATED':
                    recommendations.push({
                        action: 'PRIORITY_EVALUATION',
                        component: finding.component,
                        reason: 'Herramienta conocida sin evaluación formal',
                        steps: [
                            `scripts/check-blockers.cjs ${finding.component}`,
                            `scripts/estimate-effort-by-scenario.cjs ${finding.component}`
                        ]
                    });
                    break;
            }
        });
        
        return recommendations;
    }
    
    printReport(report) {
        console.log('\n🚨 ============ ANTI-PATTERN DETECTION REPORT ============');
        console.log(`📅 Timestamp: ${report.timestamp}`);
        console.log(`📊 Total Findings: ${report.totalFindings}`);
        console.log(`✅ Evaluated Components: ${report.evaluatedComponents.length}`);
        
        console.log('\n📈 Findings by Severity:');
        Object.entries(report.findingsBySeverity).forEach(([severity, count]) => {
            const emoji = severity === 'CRITICAL' ? '🔴' : severity === 'HIGH' ? '🟠' : '🟡';
            console.log(`  ${emoji} ${severity}: ${count}`);
        });
        
        console.log('\n📋 Findings by Type:');
        Object.entries(report.findingsByType).forEach(([type, count]) => {
            console.log(`  • ${type}: ${count}`);
        });
        
        if (report.details.length > 0) {
            console.log('\n🔍 Detailed Findings:');
            report.details.forEach((finding, index) => {
                console.log(`\n  ${index + 1}. ${finding.type} - ${finding.severity}`);
                if (finding.component) {
                    console.log(`     Component: ${finding.component}`);
                }
                console.log(`     Source: ${finding.source}`);
                console.log(`     Context: ${finding.context}`);
            });
        }
        
        if (report.recommendations.length > 0) {
            console.log('\n💡 Recommendations:');
            const uniqueRecommendations = new Map();
            report.recommendations.forEach(rec => {
                const key = `${rec.action}_${rec.component || 'general'}`;
                if (!uniqueRecommendations.has(key)) {
                    uniqueRecommendations.set(key, rec);
                }
            });
            
            uniqueRecommendations.forEach((rec, index) => {
                console.log(`\n  ${index + 1}. ${rec.action}${rec.component ? ` (${rec.component})` : ''}`);
                rec.steps.forEach(step => {
                    console.log(`     • ${step}`);
                });
            });
        }
        
        console.log('\n========================================================\n');
    }
    
    saveReport(report, filename) {
        const reportDir = 'docs/PROJECT/02_ARCHITECTURE/STACK_MANAGEMENT/ANTIPATTERN_REPORTS';
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }
        
        const reportPath = path.join(reportDir, filename);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        // También generar versión Markdown
        const mdPath = reportPath.replace('.json', '.md');
        const mdContent = this.generateMarkdownReport(report);
        fs.writeFileSync(mdPath, mdContent);
        
        console.log(`📄 Reporte guardado en: ${reportPath}`);
        console.log(`📄 Reporte Markdown: ${mdPath}`);
    }
    
    generateMarkdownReport(report) {
        let md = `# 🚨 Anti-Pattern Detection Report\n\n`;
        md += `**Timestamp**: ${report.timestamp}\n`;
        md += `**Total Findings**: ${report.totalFindings}\n`;
        md += `**Evaluated Components**: ${report.evaluatedComponents.length}\n\n`;
        
        md += `## 📈 Summary\n\n`;
        md += `### By Severity\n`;
        Object.entries(report.findingsBySeverity).forEach(([severity, count]) => {
            const emoji = severity === 'CRITICAL' ? '🔴' : severity === 'HIGH' ? '🟠' : '🟡';
            md += `- ${emoji} **${severity}**: ${count}\n`;
        });
        
        md += `\n### By Type\n`;
        Object.entries(report.findingsByType).forEach(([type, count]) => {
            md += `- **${type}**: ${count}\n`;
        });
        
        if (report.details.length > 0) {
            md += `\n## 🔍 Detailed Findings\n\n`;
            report.details.forEach((finding, index) => {
                md += `### ${index + 1}. ${finding.type} (${finding.severity})\n\n`;
                if (finding.component) {
                    md += `**Component**: \`${finding.component}\`\n`;
                }
                md += `**Source**: \`${finding.source}\`\n`;
                md += `**Context**: ${finding.context}\n\n`;
            });
        }
        
        if (report.recommendations.length > 0) {
            md += `## 💡 Recommendations\n\n`;
            const uniqueRecommendations = new Map();
            report.recommendations.forEach(rec => {
                const key = `${rec.action}_${rec.component || 'general'}`;
                if (!uniqueRecommendations.has(key)) {
                    uniqueRecommendations.set(key, rec);
                }
            });
            
            uniqueRecommendations.forEach((rec, index) => {
                md += `### ${index + 1}. ${rec.action}${rec.component ? ` (${rec.component})` : ''}\n\n`;
                rec.steps.forEach(step => {
                    md += `- ${step}\n`;
                });
                md += `\n`;
            });
        }
        
        md += `## 📋 Evaluated Components List\n\n`;
        if (report.evaluatedComponents.length > 0) {
            report.evaluatedComponents.forEach(comp => {
                md += `- \`${comp}\`\n`;
            });
        } else {
            md += `*No components have been formally evaluated yet.*\n`;
        }
        
        return md;
    }
}

// CLI Interface
function main() {
    const detector = new AntiPatternDetector();
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('🚨 Anti-Pattern Detector - VThink 1.0');
        console.log('');
        console.log('Usage:');
        console.log('  node detect-antipatterns.cjs [options]');
        console.log('');
        console.log('Options:');
        console.log('  --text "text to scan"     Scan specific text');
        console.log('  --file path/to/file       Scan specific file');
        console.log('  --dir path/to/directory   Scan directory recursively');
        console.log('  --workspace               Scan entire workspace');
        console.log('  --docs                    Scan only docs directory');
        console.log('  --save filename.json      Save report to file');
        console.log('');
        console.log('Examples:');
        console.log('  node detect-antipatterns.cjs --workspace --save antipattern_report.json');
        console.log('  node detect-antipatterns.cjs --text "deberíamos usar n8n"');
        console.log('  node detect-antipatterns.cjs --docs');
        return;
    }
    
    let findings = [];
    let saveFilename = null;
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        switch (arg) {
            case '--text':
                if (i + 1 < args.length) {
                    findings.push(...detector.scanText(args[i + 1], 'command-line-text'));
                    i++;
                }
                break;
                
            case '--file':
                if (i + 1 < args.length) {
                    findings.push(...detector.scanFile(args[i + 1]));
                    i++;
                }
                break;
                
            case '--dir':
                if (i + 1 < args.length) {
                    findings.push(...detector.scanDirectory(args[i + 1]));
                    i++;
                }
                break;
                
            case '--workspace':
                findings.push(...detector.scanDirectory('.'));
                break;
                
            case '--docs':
                findings.push(...detector.scanDirectory('docs'));
                break;
                
            case '--save':
                if (i + 1 < args.length) {
                    saveFilename = args[i + 1];
                    i++;
                }
                break;
        }
    }
    
    const report = detector.generateReport(findings);
    detector.printReport(report);
    
    if (saveFilename) {
        detector.saveReport(report, saveFilename);
    }
    
    // Exit code basado en severidad de hallazgos
    const criticalCount = report.findingsBySeverity.CRITICAL || 0;
    const highCount = report.findingsBySeverity.HIGH || 0;
    
    if (criticalCount > 0) {
        process.exit(2); // Critical findings
    } else if (highCount > 0) {
        process.exit(1); // High severity findings
    } else {
        process.exit(0); // No critical/high findings
    }
}

if (require.main === module) {
    main();
}

module.exports = { AntiPatternDetector };
