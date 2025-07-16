#!/usr/bin/env node

/**
 * 📊 Delta Analyzer for Porte Updates
 * 
 * Analyzes changes between versions to understand impact and complexity
 * 
 * Features:
 * - Git diff analysis
 * - Dependency change detection
 * - API change identification
 * - Code complexity metrics
 * - Test coverage impact
 * - Security change detection
 * 
 * Usage:
 *   node scripts/porte-delta-analyzer.js --repo=owner/repo --from=v1.0.0 --to=v1.1.0
 * 
 * Version: 1.0
 * Author: AI Pair Orchestrator Pro
 * Framework: VTK Methodology 1.0
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

class DeltaAnalyzer {
  constructor(config = {}) {
    this.config = config;
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
      userAgent: 'VibeThink-Delta-Analyzer v1.0'
    });
  }

  async analyzeChanges(repoFullName, fromVersion, toVersion) {
    console.log(`🔍 Analyzing changes: ${fromVersion} -> ${toVersion}`);
    
    const [owner, repo] = repoFullName.split('/');
    
    try {
      // Get comparison data from GitHub
      const comparison = await this.getComparison(owner, repo, fromVersion, toVersion);
      
      // Analyze different aspects of changes
      const analysis = {
        basic_stats: this.analyzeBasicStats(comparison),
        file_changes: await this.analyzeFileChanges(comparison.files),
        dependency_changes: await this.analyzeDependencyChanges(comparison.files),
        api_changes: await this.analyzeAPIChanges(comparison.files),
        security_changes: await this.analyzeSecurityChanges(comparison.files, comparison.commits),
        complexity_changes: await this.analyzeComplexityChanges(comparison.files),
        test_changes: await this.analyzeTestChanges(comparison.files),
        config_changes: await this.analyzeConfigChanges(comparison.files),
        documentation_changes: await this.analyzeDocumentationChanges(comparison.files)
      };
      
      // Calculate overall impact scores
      analysis.impact_scores = this.calculateImpactScores(analysis);
      
      // Generate change classification
      analysis.change_classification = this.classifyChanges(analysis);
      
      return analysis;
      
    } catch (error) {
      throw new Error(`Delta analysis failed: ${error.message}`);
    }
  }

  async getComparison(owner, repo, fromVersion, toVersion) {
    try {
      const { data } = await this.octokit.rest.repos.compareCommits({
        owner,
        repo,
        base: fromVersion,
        head: toVersion
      });
      
      return data;
      
    } catch (error) {
      throw new Error(`Failed to get comparison: ${error.message}`);
    }
  }

  analyzeBasicStats(comparison) {
    return {
      total_commits: comparison.total_commits,
      ahead_by: comparison.ahead_by,
      behind_by: comparison.behind_by,
      files_changed: comparison.files?.length || 0,
      additions: comparison.files?.reduce((sum, file) => sum + file.additions, 0) || 0,
      deletions: comparison.files?.reduce((sum, file) => sum + file.deletions, 0) || 0,
      changes: comparison.files?.reduce((sum, file) => sum + file.changes, 0) || 0
    };
  }

  async analyzeFileChanges(files) {
    if (!files || files.length === 0) {
      return { categories: {}, risk_files: [], patterns: [] };
    }

    const categories = {
      source_code: [],
      tests: [],
      configuration: [],
      documentation: [],
      dependencies: [],
      assets: [],
      other: []
    };

    const riskFiles = [];
    const patterns = [];

    for (const file of files) {
      // Categorize file
      const category = this.categorizeFile(file.filename);
      categories[category].push({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes
      });

      // Identify high-risk files
      if (this.isHighRiskFile(file)) {
        riskFiles.push({
          filename: file.filename,
          reason: this.getRiskReason(file),
          severity: this.getRiskSeverity(file)
        });
      }

      // Detect patterns
      const filePatterns = this.detectFilePatterns(file);
      patterns.push(...filePatterns);
    }

    return {
      categories,
      risk_files: riskFiles,
      patterns: [...new Set(patterns)], // Remove duplicates
      summary: {
        total_files: files.length,
        source_files: categories.source_code.length,
        test_files: categories.tests.length,
        config_files: categories.configuration.length,
        high_risk_files: riskFiles.length
      }
    };
  }

  categorizeFile(filename) {
    const testPatterns = [/\.test\.|\.spec\.|__tests__|\/tests?\//];
    const configPatterns = [/package\.json|yarn\.lock|\.env|config\.|\.config\.|docker|\.yml$|\.yaml$/];
    const docPatterns = [/\.md$|\.txt$|docs?\/|README/i];
    const depPatterns = [/package\.json|yarn\.lock|package-lock\.json|requirements\.txt|Gemfile/];
    const assetPatterns = [/\.(png|jpg|jpeg|gif|svg|ico|css|scss|sass)$/];
    const sourcePatterns = [/\.(js|ts|jsx|tsx|py|java|go|rs|php|rb)$/];

    if (testPatterns.some(pattern => pattern.test(filename))) return 'tests';
    if (depPatterns.some(pattern => pattern.test(filename))) return 'dependencies';
    if (configPatterns.some(pattern => pattern.test(filename))) return 'configuration';
    if (docPatterns.some(pattern => pattern.test(filename))) return 'documentation';
    if (assetPatterns.some(pattern => pattern.test(filename))) return 'assets';
    if (sourcePatterns.some(pattern => pattern.test(filename))) return 'source_code';
    
    return 'other';
  }

  isHighRiskFile(file) {
    const highRiskPatterns = [
      /auth|security|password|token|secret/i,
      /database|migration|schema/i,
      /package\.json|yarn\.lock/,
      /config|env/i,
      /server|app\.js|index\.js/,
      /dockerfile|docker-compose/i
    ];

    const highChangeThreshold = 100; // Lines changed
    
    return highRiskPatterns.some(pattern => pattern.test(file.filename)) ||
           file.changes > highChangeThreshold ||
           file.status === 'removed';
  }

  getRiskReason(file) {
    if (file.status === 'removed') return 'File deletion';
    if (file.changes > 100) return 'Large number of changes';
    if (/auth|security|password/i.test(file.filename)) return 'Security-related file';
    if (/package\.json|yarn\.lock/.test(file.filename)) return 'Dependency changes';
    if (/config|env/i.test(file.filename)) return 'Configuration changes';
    return 'Unknown risk factor';
  }

  getRiskSeverity(file) {
    if (file.status === 'removed') return 'HIGH';
    if (file.changes > 200) return 'HIGH';
    if (/auth|security|password/i.test(file.filename)) return 'HIGH';
    if (file.changes > 100) return 'MEDIUM';
    return 'LOW';
  }

  detectFilePatterns(file) {
    const patterns = [];
    
    if (file.status === 'added') patterns.push('new_file_additions');
    if (file.status === 'removed') patterns.push('file_deletions');
    if (file.status === 'renamed') patterns.push('file_renames');
    if (file.changes > 50) patterns.push('large_file_changes');
    if (/test/i.test(file.filename) && file.status === 'added') patterns.push('new_test_files');
    
    return patterns;
  }

  async analyzeDependencyChanges(files) {
    const dependencyFiles = files?.filter(file => 
      /package\.json|yarn\.lock|package-lock\.json/.test(file.filename)
    ) || [];

    if (dependencyFiles.length === 0) {
      return { changes_detected: false, analysis: null };
    }

    const analysis = {
      files_modified: dependencyFiles.map(f => f.filename),
      package_json_changes: [],
      lock_file_changes: [],
      estimated_impact: 'UNKNOWN'
    };

    // Analyze package.json changes
    const packageJsonFile = dependencyFiles.find(f => f.filename.includes('package.json'));
    if (packageJsonFile) {
      analysis.package_json_changes = await this.analyzePackageJsonChanges(packageJsonFile);
    }

    // Analyze lock file changes
    const lockFile = dependencyFiles.find(f => 
      f.filename.includes('yarn.lock') || f.filename.includes('package-lock.json')
    );
    if (lockFile) {
      analysis.lock_file_changes = this.analyzeLockFileChanges(lockFile);
    }

    // Estimate impact
    analysis.estimated_impact = this.estimateDependencyImpact(analysis);

    return {
      changes_detected: true,
      analysis
    };
  }

  async analyzePackageJsonChanges(file) {
    // In a real implementation, this would parse the actual diff
    // and identify specific dependency additions/removals/updates
    return {
      additions_estimated: Math.floor(file.additions / 5), // Rough estimate
      deletions_estimated: Math.floor(file.deletions / 5),
      modifications_estimated: Math.floor((file.changes - file.additions - file.deletions) / 5)
    };
  }

  analyzeLockFileChanges(file) {
    return {
      significant_changes: file.changes > 100,
      changes_count: file.changes,
      likely_major_update: file.changes > 1000
    };
  }

  estimateDependencyImpact(analysis) {
    if (analysis.lock_file_changes?.likely_major_update) return 'HIGH';
    if (analysis.package_json_changes?.additions_estimated > 5) return 'MEDIUM';
    if (analysis.lock_file_changes?.significant_changes) return 'MEDIUM';
    return 'LOW';
  }

  async analyzeAPIChanges(files) {
    const apiFiles = files?.filter(file =>
      /api|router|controller|endpoint|route/i.test(file.filename) ||
      /\.ts$|\.js$/.test(file.filename)
    ) || [];

    if (apiFiles.length === 0) {
      return { changes_detected: false };
    }

    return {
      changes_detected: true,
      potentially_affected_files: apiFiles.length,
      files: apiFiles.map(f => ({
        filename: f.filename,
        changes: f.changes,
        risk_level: f.changes > 50 ? 'HIGH' : f.changes > 20 ? 'MEDIUM' : 'LOW'
      })),
      estimated_breaking_changes: apiFiles.filter(f => f.changes > 50).length > 0
    };
  }

  async analyzeSecurityChanges(files, commits) {
    const securityKeywords = [
      'security', 'vulnerability', 'cve', 'auth', 'authentication',
      'authorization', 'password', 'token', 'secret', 'encrypt',
      'decrypt', 'hash', 'csrf', 'xss', 'sql injection'
    ];

    const securityFiles = files?.filter(file =>
      securityKeywords.some(keyword => 
        file.filename.toLowerCase().includes(keyword)
      )
    ) || [];

    const securityCommits = commits?.filter(commit =>
      securityKeywords.some(keyword =>
        commit.commit.message.toLowerCase().includes(keyword)
      )
    ) || [];

    return {
      security_related_changes: securityFiles.length > 0 || securityCommits.length > 0,
      security_files: securityFiles.map(f => f.filename),
      security_commits: securityCommits.length,
      risk_level: this.calculateSecurityRiskLevel(securityFiles, securityCommits)
    };
  }

  calculateSecurityRiskLevel(files, commits) {
    if (files.length > 3 || commits.length > 2) return 'HIGH';
    if (files.length > 0 || commits.length > 0) return 'MEDIUM';
    return 'LOW';
  }

  async analyzeComplexityChanges(files) {
    const codeFiles = files?.filter(file =>
      /\.(js|ts|jsx|tsx|py|java|go|rs|php|rb)$/.test(file.filename) &&
      file.status !== 'removed'
    ) || [];

    if (codeFiles.length === 0) {
      return { complexity_impact: 'NONE' };
    }

    const complexityIndicators = {
      large_additions: codeFiles.filter(f => f.additions > 100).length,
      large_deletions: codeFiles.filter(f => f.deletions > 100).length,
      major_modifications: codeFiles.filter(f => f.changes > 200).length,
      new_files: codeFiles.filter(f => f.status === 'added').length
    };

    const totalComplexityScore = 
      complexityIndicators.large_additions * 3 +
      complexityIndicators.large_deletions * 2 +
      complexityIndicators.major_modifications * 4 +
      complexityIndicators.new_files * 1;

    return {
      complexity_indicators: complexityIndicators,
      complexity_score: totalComplexityScore,
      complexity_impact: this.getComplexityImpact(totalComplexityScore),
      files_analyzed: codeFiles.length
    };
  }

  getComplexityImpact(score) {
    if (score > 20) return 'HIGH';
    if (score > 10) return 'MEDIUM';
    if (score > 0) return 'LOW';
    return 'NONE';
  }

  async analyzeTestChanges(files) {
    const testFiles = files?.filter(file =>
      /\.test\.|\.spec\.|__tests__|\/tests?\//i.test(file.filename)
    ) || [];

    const testAnalysis = {
      test_files_changed: testFiles.length,
      new_tests: testFiles.filter(f => f.status === 'added').length,
      modified_tests: testFiles.filter(f => f.status === 'modified').length,
      deleted_tests: testFiles.filter(f => f.status === 'removed').length,
      test_coverage_impact: 'UNKNOWN'
    };

    // Estimate test coverage impact
    if (testAnalysis.deleted_tests > 0) {
      testAnalysis.test_coverage_impact = 'NEGATIVE';
    } else if (testAnalysis.new_tests > testAnalysis.modified_tests) {
      testAnalysis.test_coverage_impact = 'POSITIVE';
    } else if (testFiles.length > 0) {
      testAnalysis.test_coverage_impact = 'NEUTRAL';
    }

    return testAnalysis;
  }

  async analyzeConfigChanges(files) {
    const configFiles = files?.filter(file =>
      /config|\.env|docker|\.yml$|\.yaml$|\.json$/i.test(file.filename) &&
      !file.filename.includes('package.json') // Handled separately
    ) || [];

    return {
      config_files_changed: configFiles.length,
      files: configFiles.map(f => ({
        filename: f.filename,
        type: this.getConfigType(f.filename),
        risk_level: this.getConfigRiskLevel(f)
      }))
    };
  }

  getConfigType(filename) {
    if (/docker/i.test(filename)) return 'docker';
    if (/\.env/i.test(filename)) return 'environment';
    if (/\.ya?ml$/i.test(filename)) return 'yaml';
    if (/config/i.test(filename)) return 'application_config';
    return 'other';
  }

  getConfigRiskLevel(file) {
    if (/\.env|secret|password/i.test(file.filename)) return 'HIGH';
    if (/docker|config/i.test(file.filename)) return 'MEDIUM';
    return 'LOW';
  }

  async analyzeDocumentationChanges(files) {
    const docFiles = files?.filter(file =>
      /\.md$|\.txt$|docs?\/|README/i.test(file.filename)
    ) || [];

    return {
      documentation_files_changed: docFiles.length,
      readme_changes: docFiles.filter(f => /readme/i.test(f.filename)).length > 0,
      changelog_changes: docFiles.filter(f => /changelog|changes/i.test(f.filename)).length > 0,
      documentation_impact: docFiles.length > 0 ? 'POSITIVE' : 'NONE'
    };
  }

  calculateImpactScores(analysis) {
    const scores = {
      technical_impact: 0,
      risk_impact: 0,
      business_impact: 0,
      maintenance_impact: 0
    };

    // Technical impact
    scores.technical_impact += analysis.basic_stats.files_changed * 0.1;
    scores.technical_impact += analysis.dependency_changes.changes_detected ? 2 : 0;
    scores.technical_impact += analysis.api_changes.changes_detected ? 3 : 0;
    scores.technical_impact += analysis.complexity_changes.complexity_score * 0.1;

    // Risk impact
    scores.risk_impact += analysis.file_changes.risk_files?.length * 2 || 0;
    scores.risk_impact += analysis.security_changes.security_related_changes ? 4 : 0;
    scores.risk_impact += analysis.config_changes.config_files_changed * 0.5;

    // Business impact
    scores.business_impact += analysis.api_changes.estimated_breaking_changes ? 5 : 0;
    scores.business_impact += analysis.basic_stats.files_changed > 20 ? 2 : 0;

    // Maintenance impact
    scores.maintenance_impact += analysis.dependency_changes.changes_detected ? 1 : 0;
    scores.maintenance_impact += analysis.test_changes.test_coverage_impact === 'NEGATIVE' ? 2 : 0;
    scores.maintenance_impact += analysis.complexity_changes.complexity_impact === 'HIGH' ? 3 : 0;

    // Normalize scores (0-10 scale)
    Object.keys(scores).forEach(key => {
      scores[key] = Math.min(10, Math.max(0, scores[key]));
    });

    return scores;
  }

  classifyChanges(analysis) {
    const classification = {
      change_types: [],
      overall_risk: 'LOW',
      complexity_level: 'LOW',
      recommended_action: 'AUTO_APPROVE'
    };

    // Classify change types
    if (analysis.security_changes.security_related_changes) {
      classification.change_types.push('SECURITY');
    }
    if (analysis.dependency_changes.changes_detected) {
      classification.change_types.push('DEPENDENCIES');
    }
    if (analysis.api_changes.changes_detected) {
      classification.change_types.push('API');
    }
    if (analysis.basic_stats.files_changed > 50) {
      classification.change_types.push('MAJOR_REFACTOR');
    }
    if (analysis.file_changes.categories.tests.length > 0) {
      classification.change_types.push('TESTING');
    }

    // Determine overall risk
    const maxRiskScore = Math.max(...Object.values(analysis.impact_scores));
    if (maxRiskScore >= 7) {
      classification.overall_risk = 'HIGH';
      classification.recommended_action = 'MANUAL_REVIEW';
    } else if (maxRiskScore >= 4) {
      classification.overall_risk = 'MEDIUM';
      classification.recommended_action = 'CONDITIONAL_APPROVE';
    }

    // Determine complexity level
    const complexityScore = analysis.impact_scores.technical_impact;
    if (complexityScore >= 7) {
      classification.complexity_level = 'HIGH';
    } else if (complexityScore >= 4) {
      classification.complexity_level = 'MEDIUM';
    }

    return classification;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const repoArg = args.find(arg => arg.startsWith('--repo='));
  const fromArg = args.find(arg => arg.startsWith('--from='));
  const toArg = args.find(arg => arg.startsWith('--to='));
  const outputArg = args.find(arg => arg.startsWith('--output='));

  if (!repoArg || !fromArg || !toArg) {
    console.error('Usage: node porte-delta-analyzer.js --repo=owner/repo --from=v1.0.0 --to=v1.1.0 [--output=path]');
    process.exit(1);
  }

  const repo = repoArg.split('=')[1];
  const fromVersion = fromArg.split('=')[1];
  const toVersion = toArg.split('=')[1];
  const outputPath = outputArg?.split('=')[1];

  try {
    const analyzer = new DeltaAnalyzer();
    const analysis = await analyzer.analyzeChanges(repo, fromVersion, toVersion);

    // Output results
    const output = JSON.stringify(analysis, null, 2);
    
    if (outputPath) {
      await fs.writeFile(outputPath, output);
      console.log(`Analysis saved to: ${outputPath}`);
    } else {
      console.log(output);
    }

    console.log('\n📊 Analysis Summary:');
    console.log(`Files changed: ${analysis.basic_stats.files_changed}`);
    console.log(`Overall risk: ${analysis.change_classification.overall_risk}`);
    console.log(`Recommended action: ${analysis.change_classification.recommended_action}`);

  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = DeltaAnalyzer;

// Run if called directly
if (require.main === module) {
  main();
}
