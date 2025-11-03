/**
 * Industry-Standard 95% Test Coverage Enforcement
 *
 * Honest, real-world test coverage measurement and enforcement.
 * No false positives, no optimistic assumptions.
 *
 * Based on industry best practices:
 * - Google's 80%+ coverage requirement
 * - Microsoft's 90%+ for critical code
 * - Stripe's 95%+ for payment systems
 *
 * @version 4.1.0
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Coverage thresholds (industry standards)
 */
export const COVERAGE_THRESHOLDS = {
  critical: {
    // Authentication, payments, security
    statements: 95,
    branches: 90,
    functions: 95,
    lines: 95,
  },
  high: {
    // Business logic, APIs
    statements: 90,
    branches: 85,
    functions: 90,
    lines: 90,
  },
  standard: {
    // Standard application code
    statements: 85,
    branches: 80,
    functions: 85,
    lines: 85,
  },
  utilities: {
    // Utilities, helpers
    statements: 80,
    branches: 75,
    functions: 80,
    lines: 80,
  },
};

/**
 * File classification
 */
export type CoverageCategory = 'critical' | 'high' | 'standard' | 'utilities';

/**
 * Coverage report (from Jest/Istanbul)
 */
export interface CoverageReport {
  total: CoverageSummary;
  files: Map<string, FileCoverage>;
  timestamp: string;
  passed: boolean;
  failures: CoverageFailure[];
}

/**
 * Coverage summary
 */
export interface CoverageSummary {
  statements: { total: number; covered: number; pct: number };
  branches: { total: number; covered: number; pct: number };
  functions: { total: number; covered: number; pct: number };
  lines: { total: number; covered: number; pct: number };
}

/**
 * File-level coverage
 */
export interface FileCoverage {
  path: string;
  category: CoverageCategory;
  statements: { total: number; covered: number; pct: number };
  branches: { total: number; covered: number; pct: number };
  functions: { total: number; covered: number; pct: number };
  lines: { total: number; covered: number; pct: number };
  uncoveredLines: number[];
  passed: boolean;
}

/**
 * Coverage failure
 */
export interface CoverageFailure {
  file: string;
  category: CoverageCategory;
  metric: 'statements' | 'branches' | 'functions' | 'lines';
  actual: number;
  required: number;
  gap: number;
  severity: 'critical' | 'high' | 'medium';
}

/**
 * Classify file by coverage category
 */
export function classifyFile(filePath: string): CoverageCategory {
  const lowercasePath = filePath.toLowerCase();

  // Critical: Auth, payments, security
  if (
    lowercasePath.includes('auth') ||
    lowercasePath.includes('payment') ||
    lowercasePath.includes('security') ||
    lowercasePath.includes('encryption') ||
    lowercasePath.includes('jwt') ||
    lowercasePath.includes('session')
  ) {
    return 'critical';
  }

  // High: Business logic, APIs
  if (
    lowercasePath.includes('service') ||
    lowercasePath.includes('controller') ||
    lowercasePath.includes('repository') ||
    lowercasePath.includes('api') ||
    lowercasePath.includes('model')
  ) {
    return 'high';
  }

  // Utilities: Helpers, utils
  if (
    lowercasePath.includes('util') ||
    lowercasePath.includes('helper') ||
    lowercasePath.includes('constant') ||
    lowercasePath.includes('config')
  ) {
    return 'utilities';
  }

  // Default: Standard
  return 'standard';
}

/**
 * Run test coverage with Jest
 */
export function runCoverage(): string {
  console.log('[Coverage] Running test suite with coverage...\n');

  try {
    const output = execSync('npm test -- --coverage --coverageReporters=json-summary --coverageReporters=json', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    console.log('[Coverage] Test suite completed\n');
    return output;
  } catch (error: any) {
    // Jest exits with non-zero if tests fail, but we still get coverage
    console.warn('[Coverage] Some tests failed, but coverage was collected\n');
    return error.stdout || '';
  }
}

/**
 * Parse Jest coverage report
 */
export function parseCoverageReport(coverageDir: string = 'coverage'): CoverageReport {
  const summaryPath = path.join(coverageDir, 'coverage-summary.json');
  const detailPath = path.join(coverageDir, 'coverage-final.json');

  if (!fs.existsSync(summaryPath)) {
    throw new Error(`Coverage summary not found at ${summaryPath}. Run tests with --coverage first.`);
  }

  // Read summary
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));

  // Read detailed coverage
  let details: any = {};
  if (fs.existsSync(detailPath)) {
    details = JSON.parse(fs.readFileSync(detailPath, 'utf-8'));
  }

  // Parse total coverage
  const total: CoverageSummary = {
    statements: summary.total.statements,
    branches: summary.total.branches,
    functions: summary.total.functions,
    lines: summary.total.lines,
  };

  // Parse file-level coverage
  const files = new Map<string, FileCoverage>();
  const failures: CoverageFailure[] = [];

  Object.keys(details).forEach((filePath) => {
    const fileData = details[filePath];
    const category = classifyFile(filePath);
    const thresholds = COVERAGE_THRESHOLDS[category];

    // Calculate uncovered lines
    const uncoveredLines: number[] = [];
    if (fileData.statementMap && fileData.s) {
      Object.keys(fileData.s).forEach((key) => {
        if (fileData.s[key] === 0) {
          const stmt = fileData.statementMap[key];
          if (stmt && stmt.start) {
            uncoveredLines.push(stmt.start.line);
          }
        }
      });
    }

    const fileCoverage: FileCoverage = {
      path: filePath,
      category,
      statements: {
        total: fileData.s ? Object.keys(fileData.s).length : 0,
        covered: fileData.s ? Object.values(fileData.s).filter((v: any) => v > 0).length : 0,
        pct: 0,
      },
      branches: {
        total: fileData.b ? Object.keys(fileData.b).length : 0,
        covered: fileData.b ? Object.values(fileData.b).filter((v: any) => v.some((n: any) => n > 0)).length : 0,
        pct: 0,
      },
      functions: {
        total: fileData.f ? Object.keys(fileData.f).length : 0,
        covered: fileData.f ? Object.values(fileData.f).filter((v: any) => v > 0).length : 0,
        pct: 0,
      },
      lines: {
        total: fileData.l ? Object.keys(fileData.l).length : 0,
        covered: fileData.l ? Object.values(fileData.l).filter((v: any) => v > 0).length : 0,
        pct: 0,
      },
      uncoveredLines,
      passed: true,
    };

    // Calculate percentages
    fileCoverage.statements.pct = fileCoverage.statements.total > 0
      ? (fileCoverage.statements.covered / fileCoverage.statements.total) * 100
      : 100;

    fileCoverage.branches.pct = fileCoverage.branches.total > 0
      ? (fileCoverage.branches.covered / fileCoverage.branches.total) * 100
      : 100;

    fileCoverage.functions.pct = fileCoverage.functions.total > 0
      ? (fileCoverage.functions.covered / fileCoverage.functions.total) * 100
      : 100;

    fileCoverage.lines.pct = fileCoverage.lines.total > 0
      ? (fileCoverage.lines.covered / fileCoverage.lines.total) * 100
      : 100;

    // Check thresholds
    const metrics: Array<'statements' | 'branches' | 'functions' | 'lines'> = [
      'statements',
      'branches',
      'functions',
      'lines',
    ];

    metrics.forEach((metric) => {
      const actual = fileCoverage[metric].pct;
      const required = thresholds[metric];

      if (actual < required) {
        fileCoverage.passed = false;

        failures.push({
          file: filePath,
          category,
          metric,
          actual: Math.round(actual * 10) / 10,
          required,
          gap: Math.round((required - actual) * 10) / 10,
          severity: category === 'critical' ? 'critical' : category === 'high' ? 'high' : 'medium',
        });
      }
    });

    files.set(filePath, fileCoverage);
  });

  return {
    total,
    files,
    timestamp: new Date().toISOString(),
    passed: failures.length === 0,
    failures,
  };
}

/**
 * Print coverage report
 */
export function printCoverageReport(report: CoverageReport): void {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('📊 INDUSTRY-STANDARD TEST COVERAGE REPORT');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Total coverage
  console.log('📈 Overall Coverage:\n');
  console.log(`  Statements: ${report.total.statements.pct.toFixed(2)}% (${report.total.statements.covered}/${report.total.statements.total})`);
  console.log(`  Branches:   ${report.total.branches.pct.toFixed(2)}% (${report.total.branches.covered}/${report.total.branches.total})`);
  console.log(`  Functions:  ${report.total.functions.pct.toFixed(2)}% (${report.total.functions.covered}/${report.total.functions.total})`);
  console.log(`  Lines:      ${report.total.lines.pct.toFixed(2)}% (${report.total.lines.covered}/${report.total.lines.total})\n`);

  // Coverage by category
  const categories = new Map<CoverageCategory, FileCoverage[]>();
  report.files.forEach((file) => {
    if (!categories.has(file.category)) {
      categories.set(file.category, []);
    }
    categories.get(file.category)!.push(file);
  });

  console.log('📂 Coverage by Category:\n');
  (['critical', 'high', 'standard', 'utilities'] as CoverageCategory[]).forEach((category) => {
    const files = categories.get(category) || [];
    if (files.length === 0) return;

    const thresholds = COVERAGE_THRESHOLDS[category];
    const avgStatements = files.reduce((sum, f) => sum + f.statements.pct, 0) / files.length;
    const passed = files.filter(f => f.passed).length;
    const failed = files.length - passed;

    console.log(`  ${category.toUpperCase()}: ${files.length} files`);
    console.log(`    Required: ${thresholds.statements}% statements`);
    console.log(`    Actual:   ${avgStatements.toFixed(2)}% average`);
    console.log(`    Status:   ${passed} passed, ${failed} failed`);
    console.log('');
  });

  // Failures
  if (report.failures.length > 0) {
    console.log('❌ COVERAGE FAILURES:\n');

    const criticalFailures = report.failures.filter(f => f.severity === 'critical');
    const highFailures = report.failures.filter(f => f.severity === 'high');
    const mediumFailures = report.failures.filter(f => f.severity === 'medium');

    if (criticalFailures.length > 0) {
      console.log('  🚨 CRITICAL (Must fix immediately):\n');
      criticalFailures.forEach((failure) => {
        const file = report.files.get(failure.file)!;
        console.log(`    ${failure.file}`);
        console.log(`      ${failure.metric}: ${failure.actual}% (required: ${failure.required}%, gap: ${failure.gap}%)`);
        if (file.uncoveredLines.length > 0) {
          console.log(`      Uncovered lines: ${file.uncoveredLines.slice(0, 10).join(', ')}${file.uncoveredLines.length > 10 ? '...' : ''}`);
        }
        console.log('');
      });
    }

    if (highFailures.length > 0) {
      console.log('  ⚠️  HIGH (Fix before production):\n');
      highFailures.forEach((failure) => {
        console.log(`    ${failure.file}`);
        console.log(`      ${failure.metric}: ${failure.actual}% (required: ${failure.required}%, gap: ${failure.gap}%)\n`);
      });
    }

    if (mediumFailures.length > 0) {
      console.log('  ℹ️  MEDIUM (Improve coverage):\n');
      mediumFailures.forEach((failure) => {
        console.log(`    ${failure.file}`);
        console.log(`      ${failure.metric}: ${failure.actual}% (required: ${failure.required}%, gap: ${failure.gap}%)\n`);
      });
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`❌ COVERAGE CHECK FAILED: ${report.failures.length} files below threshold`);
    console.log('═══════════════════════════════════════════════════════════════\n');
  } else {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('✅ COVERAGE CHECK PASSED: All files meet their thresholds');
    console.log('═══════════════════════════════════════════════════════════════\n');
  }
}

/**
 * Generate Jest coverage configuration
 */
export function generateJestConfig(): string {
  const config = {
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.d.ts',
      '!src/**/*.test.{js,jsx,ts,tsx}',
      '!src/**/__tests__/**',
      '!src/**/__mocks__/**',
    ],
    coverageThresholds: {
      global: {
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 85,
      },
    },
    coverageReporters: [
      'json',
      'json-summary',
      'text',
      'lcov',
      'html',
    ],
  };

  return JSON.stringify(config, null, 2);
}

/**
 * Create coverage enforcement script for CI/CD
 */
export function generateCIScript(): string {
  return `#!/bin/bash
# Coverage Enforcement Script
# Enforces industry-standard 95% coverage for critical code

set -e

echo "🧪 Running test suite with coverage..."
npm test -- --coverage

echo ""
echo "📊 Checking coverage thresholds..."
npx tsx Nexus\\ Ai/coverage-enforcer.ts

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Coverage check failed. Please add tests to meet thresholds."
  exit 1
fi

echo ""
echo "✅ Coverage check passed!"
exit 0
`;
}

/**
 * Main execution
 */
async function main() {
  console.log('🧪 Starting Industry-Standard Coverage Enforcement...\n');

  // Run coverage
  runCoverage();

  // Parse report
  const report = parseCoverageReport();

  // Print report
  printCoverageReport(report);

  // Save report for future reference
  const reportDir = path.join(process.cwd(), 'logs', 'coverage');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportPath = path.join(reportDir, `coverage-${report.timestamp.slice(0, 10)}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

  console.log(`📄 Detailed report saved: ${reportPath}\n`);

  // Exit with error if coverage failed
  if (!report.passed) {
    console.error('❌ Coverage enforcement failed. Add tests to meet thresholds.\n');
    process.exit(1);
  }

  console.log('✅ Coverage enforcement passed!\n');
  process.exit(0);
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
