# CI/CD Integration - VibeThink Orchestrator

## Resumen

Esta guía describe la integración completa de testing en el pipeline de CI/CD para VibeThink Orchestrator. Incluye configuración de GitHub Actions, quality gates, reporting y deployment strategies.

## Arquitectura de CI/CD

### Pipeline Overview

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Push/PR                       │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                 Quality Gates                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Linting   │  │   Security  │  │   Coverage  │     │
│  │             │  │             │  │             │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                 Testing Pipeline                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │    Unit     │  │     E2E     │  │ Performance │     │
│  │   Tests     │  │   Tests     │  │   Tests     │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                 Build & Deploy                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │    Build    │  │   Deploy    │  │   Monitor   │     │
│  │             │  │             │  │             │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

## GitHub Actions Configuration

### Workflow Principal

```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'
  PNPM_VERSION: '8'

jobs:
  # Quality Gates
  quality-gates:
    name: Quality Gates
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run security audit
        run: npm run test:security:audit

      - name: Run security scan
        run: npm run test:security:scan
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      - name: Check TypeScript
        run: npm run type-check

  # Unit Tests
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: quality-gates
    strategy:
      matrix:
        node-version: [16, 18, 20]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage
        env:
          VITE_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unit-tests
          name: codecov-umbrella
          fail_ci_if_error: false

      - name: Check coverage thresholds
        run: |
          if [ $(node -e "console.log(require('./coverage/coverage-summary.json').total.lines.pct)") -lt 80 ]; then
            echo "Coverage is below 80%"
            exit 1
          fi

  # E2E Tests
  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: unit-tests
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Setup test database
        run: npm run test:db:setup
        env:
          TEST_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
          TEST_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}

      - name: Run E2E tests
        run: npx playwright test --project=${{ matrix.browser }}
        env:
          BASE_URL: ${{ secrets.TEST_BASE_URL }}
          TEST_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
          TEST_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report-${{ matrix.browser }}
          path: playwright-report/
          retention-days: 30

      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: screenshots-${{ matrix.browser }}
          path: test-results/
          retention-days: 30

  # Performance Tests
  performance-tests:
    name: Performance Tests
    runs-on: ubuntu-latest
    needs: e2e-tests
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install k6
        run: |
          sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6

      - name: Run performance tests
        run: k6 run tests/performance/load-test.js
        env:
          BASE_URL: ${{ secrets.PERFORMANCE_TEST_URL }}

      - name: Upload performance results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: performance-results
          path: performance-results/
          retention-days: 30

  # Build and Deploy
  build-and-deploy:
    name: Build and Deploy
    runs-on: ubuntu-latest
    needs: [unit-tests, e2e-tests, performance-tests]
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Deploy to staging
        run: npm run deploy:staging
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}

      - name: Run smoke tests
        run: npm run test:smoke
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}

  # Production Deploy
  production-deploy:
    name: Production Deploy
    runs-on: ubuntu-latest
    needs: build-and-deploy
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Deploy to production
        run: npm run deploy:production
        env:
          DEPLOY_KEY: ${{ secrets.PRODUCTION_DEPLOY_KEY }}

      - name: Run production smoke tests
        run: npm run test:smoke
        env:
          BASE_URL: ${{ secrets.PRODUCTION_URL }}

      - name: Notify deployment success
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-type: application/json' \
            -d '{"text":"🚀 Production deployment successful!"}'
```

### Workflow de Pull Request

```yaml
# .github/workflows/pull-request.yml
name: Pull Request Checks

on:
  pull_request:
    branches: [main, develop]

jobs:
  pr-checks:
    name: PR Quality Checks
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run unit tests
        run: npm run test:coverage

      - name: Check test coverage
        run: |
          COVERAGE=$(node -e "console.log(require('./coverage/coverage-summary.json').total.lines.pct)")
          echo "Coverage: $COVERAGE%"
          if [ $(echo "$COVERAGE < 80" | bc -l) -eq 1 ]; then
            echo "❌ Coverage is below 80%"
            exit 1
          fi
          echo "✅ Coverage is above 80%"

      - name: Run security audit
        run: npm run test:security:audit

      - name: Comment PR with results
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const coverage = JSON.parse(fs.readFileSync('./coverage/coverage-summary.json', 'utf8'));
            
            const comment = `## 🧪 Test Results
            
            ### Coverage
            - **Lines**: ${coverage.total.lines.pct}%
            - **Functions**: ${coverage.total.functions.pct}%
            - **Branches**: ${coverage.total.branches.pct}%
            - **Statements**: ${coverage.total.statements.pct}%
            
            ### Quality Gates
            - ✅ Linting: Passed
            - ✅ Unit Tests: Passed
            - ✅ Security Audit: Passed
            
            ${coverage.total.lines.pct >= 80 ? '✅ Coverage threshold met' : '❌ Coverage below threshold'}
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

## Quality Gates

### Definición de Gates

```typescript
// scripts/quality-gates.ts
interface QualityGate {
  name: string;
  condition: () => boolean | Promise<boolean>;
  threshold: number;
  current: number;
  status: 'PASS' | 'FAIL' | 'WARNING';
}

const qualityGates: QualityGate[] = [
  {
    name: 'Unit Test Coverage',
    condition: () => getCoveragePercentage() >= 80,
    threshold: 80,
    current: 0,
    status: 'FAIL',
  },
  {
    name: 'E2E Test Pass Rate',
    condition: () => getE2EPassRate() >= 95,
    threshold: 95,
    current: 0,
    status: 'FAIL',
  },
  {
    name: 'Performance Response Time',
    condition: () => getAverageResponseTime() <= 2000,
    threshold: 2000,
    current: 0,
    status: 'FAIL',
  },
  {
    name: 'Security Vulnerabilities',
    condition: () => getSecurityVulnerabilities() === 0,
    threshold: 0,
    current: 0,
    status: 'FAIL',
  },
];

export async function runQualityGates(): Promise<boolean> {
  console.log('🔍 Running Quality Gates...');
  
  let allPassed = true;
  
  for (const gate of qualityGates) {
    try {
      gate.current = await getCurrentValue(gate.name);
      gate.status = await gate.condition() ? 'PASS' : 'FAIL';
      
      console.log(`${gate.status === 'PASS' ? '✅' : '❌'} ${gate.name}: ${gate.current}/${gate.threshold}`);
      
      if (gate.status === 'FAIL') {
        allPassed = false;
      }
    } catch (error) {
      console.error(`❌ Error checking ${gate.name}:`, error);
      allPassed = false;
    }
  }
  
  console.log(`\n${allPassed ? '✅ All Quality Gates Passed' : '❌ Some Quality Gates Failed'}`);
  return allPassed;
}
```

### Implementación de Gates

```typescript
// scripts/quality-gates/coverage-gate.ts
import { readFileSync } from 'fs';
import { join } from 'path';

export function getCoveragePercentage(): number {
  try {
    const coveragePath = join(process.cwd(), 'coverage', 'coverage-summary.json');
    const coverage = JSON.parse(readFileSync(coveragePath, 'utf8'));
    return coverage.total.lines.pct;
  } catch (error) {
    console.error('Error reading coverage file:', error);
    return 0;
  }
}

export function checkCoverageGate(threshold: number = 80): boolean {
  const coverage = getCoveragePercentage();
  const passed = coverage >= threshold;
  
  console.log(`📊 Coverage: ${coverage}% (threshold: ${threshold}%)`);
  console.log(`Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  
  return passed;
}
```

```typescript
// scripts/quality-gates/performance-gate.ts
import { readFileSync } from 'fs';
import { join } from 'path';

export function getPerformanceMetrics(): {
  averageResponseTime: number;
  p95ResponseTime: number;
  errorRate: number;
} {
  try {
    const resultsPath = join(process.cwd(), 'performance-results', 'results.json');
    const results = JSON.parse(readFileSync(resultsPath, 'utf8'));
    
    return {
      averageResponseTime: results.metrics.http_req_duration.values.avg,
      p95ResponseTime: results.metrics.http_req_duration.values['p(95)'],
      errorRate: results.metrics.http_req_failed.values.rate * 100,
    };
  } catch (error) {
    console.error('Error reading performance results:', error);
    return {
      averageResponseTime: 0,
      p95ResponseTime: 0,
      errorRate: 100,
    };
  }
}

export function checkPerformanceGate(): boolean {
  const metrics = getPerformanceMetrics();
  const passed = 
    metrics.averageResponseTime <= 2000 &&
    metrics.p95ResponseTime <= 3000 &&
    metrics.errorRate <= 1;
  
  console.log(`⚡ Performance Metrics:`);
  console.log(`  - Average Response Time: ${metrics.averageResponseTime}ms`);
  console.log(`  - 95th Percentile: ${metrics.p95ResponseTime}ms`);
  console.log(`  - Error Rate: ${metrics.errorRate}%`);
  console.log(`Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  
  return passed;
}
```

## Reporting y Notificaciones

### Test Reports

```yaml
# .github/workflows/reporting.yml
name: Test Reporting

on:
  workflow_run:
    workflows: ["CI/CD Pipeline"]
    types: [completed]

jobs:
  generate-reports:
    name: Generate Test Reports
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion != 'skipped' }}
    
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          path: artifacts

      - name: Generate HTML report
        run: |
          npm install -g jest-html-reporter
          jest-html-reporter --coverageReporters=html

      - name: Upload HTML report
        uses: actions/upload-artifact@v3
        with:
          name: test-report-html
          path: test-report.html
          retention-days: 30

      - name: Generate Slack notification
        run: |
          node scripts/generate-slack-report.js
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}

      - name: Send email report
        run: |
          node scripts/send-email-report.js
        env:
          SMTP_HOST: ${{ secrets.SMTP_HOST }}
          SMTP_USER: ${{ secrets.SMTP_USER }}
          SMTP_PASS: ${{ secrets.SMTP_PASS }}
```

### Slack Notifications

```javascript
// scripts/generate-slack-report.js
const fs = require('fs');
const path = require('path');

async function generateSlackReport() {
  const coverage = JSON.parse(fs.readFileSync('./coverage/coverage-summary.json', 'utf8'));
  const e2eResults = JSON.parse(fs.readFileSync('./test-results/results.json', 'utf8'));
  
  const message = {
    text: '🧪 Test Results Summary',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🧪 Test Results Summary',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Coverage*\n${coverage.total.lines.pct}%`,
          },
          {
            type: 'mrkdwn',
            text: `*E2E Tests*\n${e2eResults.stats.passed}/${e2eResults.stats.total}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: coverage.total.lines.pct >= 80 
            ? '✅ All quality gates passed'
            : '❌ Some quality gates failed',
        },
      },
    ],
  };
  
  // Send to Slack
  const response = await fetch(process.env.SLACK_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  
  if (!response.ok) {
    throw new Error('Failed to send Slack notification');
  }
}

generateSlackReport().catch(console.error);
```

## Deployment Strategies

### Blue-Green Deployment

```yaml
# .github/workflows/blue-green-deploy.yml
name: Blue-Green Deployment

on:
  push:
    branches: [main]

jobs:
  blue-green-deploy:
    name: Blue-Green Deployment
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Deploy to blue environment
        run: |
          # Deploy to blue environment
          npm run deploy:blue
          
          # Run smoke tests on blue
          npm run test:smoke:blue
          
          # If tests pass, switch traffic to blue
          npm run switch-traffic:blue

      - name: Run full test suite on blue
        run: |
          npm run test:e2e:blue
          npm run test:performance:blue

      - name: Deploy to green environment
        if: success()
        run: |
          # Deploy to green environment
          npm run deploy:green
          
          # Run smoke tests on green
          npm run test:smoke:green

      - name: Switch traffic to green
        if: success()
        run: |
          # Switch traffic to green
          npm run switch-traffic:green
          
          # Decommission blue
          npm run decommission:blue
```

### Canary Deployment

```yaml
# .github/workflows/canary-deploy.yml
name: Canary Deployment

on:
  push:
    branches: [main]

jobs:
  canary-deploy:
    name: Canary Deployment
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Deploy canary (5% traffic)
        run: |
          npm run deploy:canary
          npm run set-traffic:canary:5

      - name: Monitor canary
        run: |
          # Monitor for 5 minutes
          npm run monitor:canary --duration=300

      - name: Increase canary traffic (25%)
        if: success()
        run: |
          npm run set-traffic:canary:25
          npm run monitor:canary --duration=300

      - name: Full deployment
        if: success()
        run: |
          npm run deploy:full
          npm run set-traffic:full:100
          npm run decommission:canary
```

## Monitoring y Alerting

### Health Checks

```typescript
// scripts/health-check.ts
interface HealthCheck {
  name: string;
  check: () => Promise<boolean>;
  timeout: number;
}

const healthChecks: HealthCheck[] = [
  {
    name: 'Application Health',
    check: async () => {
      const response = await fetch(`${process.env.BASE_URL}/health`);
      return response.ok;
    },
    timeout: 5000,
  },
  {
    name: 'Database Connection',
    check: async () => {
      const response = await fetch(`${process.env.BASE_URL}/api/health/db`);
      return response.ok;
    },
    timeout: 3000,
  },
  {
    name: 'External APIs',
    check: async () => {
      const response = await fetch(`${process.env.BASE_URL}/api/health/external`);
      return response.ok;
    },
    timeout: 10000,
  },
];

export async function runHealthChecks(): Promise<boolean> {
  console.log('🏥 Running Health Checks...');
  
  let allHealthy = true;
  
  for (const check of healthChecks) {
    try {
      const isHealthy = await Promise.race([
        check.check(),
        new Promise<boolean>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), check.timeout)
        ),
      ]);
      
      console.log(`${isHealthy ? '✅' : '❌'} ${check.name}`);
      
      if (!isHealthy) {
        allHealthy = false;
      }
    } catch (error) {
      console.error(`❌ ${check.name}: ${error.message}`);
      allHealthy = false;
    }
  }
  
  return allHealthy;
}
```

### Performance Monitoring

```typescript
// scripts/performance-monitor.ts
interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
}

export async function monitorPerformance(): Promise<PerformanceMetrics> {
  const startTime = Date.now();
  
  // Make test requests
  const requests = Array(10).fill(null).map(() => 
    fetch(`${process.env.BASE_URL}/api/health`)
  );
  
  const responses = await Promise.allSettled(requests);
  const endTime = Date.now();
  
  const successfulRequests = responses.filter(r => r.status === 'fulfilled').length;
  const failedRequests = responses.length - successfulRequests;
  
  return {
    responseTime: (endTime - startTime) / responses.length,
    throughput: successfulRequests / ((endTime - startTime) / 1000),
    errorRate: (failedRequests / responses.length) * 100,
    memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
    cpuUsage: process.cpuUsage().user / 1000000, // seconds
  };
}
```

## Rollback Strategies

### Automatic Rollback

```yaml
# .github/workflows/rollback.yml
name: Automatic Rollback

on:
  workflow_run:
    workflows: ["Production Deploy"]
    types: [completed]

jobs:
  monitor-and-rollback:
    name: Monitor and Rollback
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    
    steps:
      - name: Wait for deployment
        run: sleep 60

      - name: Run health checks
        run: npm run health-check
        id: health-check

      - name: Run smoke tests
        run: npm run test:smoke
        id: smoke-tests

      - name: Check error rates
        run: npm run check-error-rates
        id: error-check

      - name: Automatic rollback
        if: steps.health-check.outcome == 'failure' || steps.smoke-tests.outcome == 'failure' || steps.error-check.outcome == 'failure'
        run: |
          echo "🚨 Automatic rollback triggered"
          npm run rollback:production
          
          # Notify team
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-type: application/json' \
            -d '{"text":"🚨 Automatic rollback triggered due to health check failures"}'
```

### Manual Rollback

```bash
#!/bin/bash
# scripts/rollback.sh

set -e

ENVIRONMENT=$1
VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$VERSION" ]; then
  echo "Usage: ./rollback.sh <environment> <version>"
  echo "Example: ./rollback.sh production v1.2.3"
  exit 1
fi

echo "🔄 Rolling back $ENVIRONMENT to version $VERSION..."

# Rollback deployment
npm run rollback:$ENVIRONMENT --version=$VERSION

# Run health checks
npm run health-check:$ENVIRONMENT

# Run smoke tests
npm run test:smoke:$ENVIRONMENT

echo "✅ Rollback completed successfully"

# Notify team
curl -X POST $SLACK_WEBHOOK \
  -H 'Content-type: application/json' \
  -d "{\"text\":\"🔄 Manual rollback completed for $ENVIRONMENT to version $VERSION\"}"
```

## Conclusión

Esta configuración de CI/CD proporciona un pipeline robusto y automatizado para VibeThink Orchestrator. Los quality gates, testing comprehensivo y estrategias de deployment aseguran que solo código de alta calidad llegue a producción.

La integración de monitoring y alerting permite detectar y responder rápidamente a problemas, mientras que las estrategias de rollback proporcionan seguridad adicional para el deployment en producción. 