#!/usr/bin/env node

/**
 * DeswalTech Package Verification Script
 * 
 * This script verifies that DeswalTech is properly configured for GitHub/npm distribution
 * Run: node scripts/verify-package.js
 */

const fs = require('fs-extra');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function banner() {
  log('\n╔════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                                                                ║', 'cyan');
  log('║         DeswalTech Package Verification                       ║', 'cyan');
  log('║         Ensuring GitHub/npm Distribution Ready                ║', 'cyan');
  log('║                                                                ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════════╝\n', 'cyan');
}

async function verifyFile(filePath, description) {
  const exists = await fs.pathExists(filePath);
  if (exists) {
    log(`  ✅ ${description}`, 'green');
    return true;
  } else {
    log(`  ❌ ${description}`, 'red');
    log(`     Missing: ${filePath}`, 'yellow');
    return false;
  }
}

async function verifyDirectory(dirPath, description) {
  const exists = await fs.pathExists(dirPath);
  if (exists) {
    const stats = await fs.stat(dirPath);
    if (stats.isDirectory()) {
      log(`  ✅ ${description}`, 'green');
      return true;
    }
  }
  log(`  ❌ ${description}`, 'red');
  log(`     Missing: ${dirPath}`, 'yellow');
  return false;
}

async function verify() {
  banner();
  
  const rootDir = path.resolve(__dirname, '..');
  let allPassed = true;
  
  // 1. Essential Files
  log('📄 Verifying Essential Files...', 'bright');
  const essentialFiles = [
    ['package.json', 'Package configuration'],
    ['README.md', 'Main documentation'],
    ['LICENSE', 'License file'],
    ['.gitignore', 'Git ignore file'],
    ['.npmignore', 'npm ignore file'],
    ['mcp.json', 'MCP configuration'],
    ['railway.json', 'Railway deployment config'],
  ];
  
  for (const [file, desc] of essentialFiles) {
    const passed = await verifyFile(path.join(rootDir, file), desc);
    if (!passed) allPassed = false;
  }
  log('');
  
  // 2. Nexus AI Agent Files
  log('👥 Verifying Nexus AI Agent Files...', 'bright');
  const agentFiles = [
    'architect.md',
    'backend.md',
    'devops.md',
    'frontend.md',
    'qa-tester.md',
    'security.md',
    'supervisor.md',
  ];
  
  const agentsDir = path.join(rootDir, 'Nexus Ai/nexus-ai-team/agents');
  for (const file of agentFiles) {
    const passed = await verifyFile(path.join(agentsDir, file), file);
    if (!passed) allPassed = false;
  }
  log('');

  // 3. Nexus AI Skill Files
  log('🛠️ Verifying Nexus AI Skill Files...', 'bright');
  const skillFiles = [
    'core/delegator/SKILL.md',
    'core/socratic-brainstorm/SKILL.md',
    'workflow/prd-creator/SKILL.md',
    'workflow/task-executor/SKILL.md',
    'workflow/task-parser/SKILL.md',
  ];

  const skillsDir = path.join(rootDir, 'Nexus Ai/nexus-ai-team/skills');
  for (const file of skillFiles) {
    const passed = await verifyFile(path.join(skillsDir, file), file);
    if (!passed) allPassed = false;
  }
  log('');
  
  // 4. Scripts
  log('📜 Verifying Scripts...', 'bright');
  const scriptFiles = [
    'verify-package.js',
  ];
  
  const scriptsDir = path.join(rootDir, 'scripts');
  for (const file of scriptFiles) {
    const passed = await verifyFile(path.join(scriptsDir, file), file);
    if (!passed) allPassed = false;
  }
  log('');
  
  // 5. Infrastructure
  log('🏗️ Verifying Infrastructure Files...', 'bright');
  const infraFiles = [
    ['Infrastructure/docker-compose.yml', 'Docker Compose config'],
    ['Infrastructure/README.md', 'Infrastructure docs'],
    ['Infrastructure/start-services.sh', 'Start services script'],
    ['Infrastructure/stop-services.sh', 'Stop services script'],
    ['Infrastructure/restart-services.sh', 'Restart services script'],
  ];
  
  for (const [file, desc] of infraFiles) {
    const passed = await verifyFile(path.join(rootDir, file), desc);
    if (!passed) allPassed = false;
  }
  log('');
  
  // 6. MCP Server
  log('🔌 Verifying MCP Server...', 'bright');
  const mcpFiles = [
    ['mcp-server/package.json', 'MCP package.json'],
    ['mcp-server/tsconfig.json', 'MCP TypeScript config'],
    ['mcp-server/src/index.ts', 'MCP source code'],
    ['mcp-server/env.example', 'MCP environment example'],
    ['mcp-server/Dockerfile', 'MCP Dockerfile'],
  ];
  
  for (const [file, desc] of mcpFiles) {
    const passed = await verifyFile(path.join(rootDir, file), desc);
    if (!passed) allPassed = false;
  }
  log('');
  

  // 8. Package.json Validation
  log('⚙️ Verifying package.json Configuration...', 'bright');
  try {
    const packageJson = await fs.readJson(path.join(rootDir, 'package.json'));
    
    const checks = [
      [packageJson.name === 'deswaltech', 'Package name is "deswaltech"'],
      [packageJson.version, 'Version is set'],
      [packageJson.description, 'Description is set'],
      [packageJson.keywords && packageJson.keywords.length > 0, 'Keywords are defined'],
      [packageJson.repository && packageJson.repository.url, 'Repository URL is set'],
      [packageJson.license === 'MIT', 'License is MIT'],
      [packageJson.files && packageJson.files.length > 0, 'Files list is defined'],
      [packageJson.engines && packageJson.engines.node, 'Node version requirement is set'],
    ];
    
    for (const [passed, desc] of checks) {
      if (passed) {.
        log(`  ✅ ${desc}`, 'green');
      } else {
        log(`  ❌ ${desc}`, 'red');
        allPassed = false;
      }
    }
  } catch (error) {
    log(`  ❌ Failed to read package.json: ${error.message}`, 'red');
    allPassed = false;
  }
  log('');
  
  // 9. .gitignore Validation
  log('🚫 Verifying .gitignore...', 'bright');
  try {
    const gitignore = await fs.readFile(path.join(rootDir, '.gitignore'), 'utf8');
    const checks = [
      [gitignore.includes('node_modules'), 'Ignores node_modules'],
      [gitignore.includes('.env'), 'Ignores .env files'],
      [gitignore.includes('dist/'), 'Ignores dist/'],
      [gitignore.includes('*.log'), 'Ignores log files'],
      [gitignore.includes('.DS_Store'), 'Ignores .DS_Store'],
    ];
    
    for (const [passed, desc] of checks) {
      if (passed) {
        log(`  ✅ ${desc}`, 'green');
      } else {
        log(`  ⚠️  ${desc}`, 'yellow');
      }
    }
  } catch (error) {
    log(`  ❌ Failed to read .gitignore: ${error.message}`, 'red');
    allPassed = false;
  }
  log('');
  
  // 10. .npmignore Validation
  log('📦 Verifying .npmignore...', 'bright');
  try {
    const npmignore = await fs.readFile(path.join(rootDir, '.npmignore'), 'utf8');
    const checks = [
      [npmignore.includes('test'), 'Excludes tests'],
      [npmignore.includes('.git'), 'Excludes .git'],
      [npmignore.includes('node_modules'), 'Excludes node_modules'],
    ];
    
    for (const [passed, desc] of checks) {
      if (passed) {
        log(`  ✅ ${desc}`, 'green');
      } else {
        log(`  ⚠️  ${desc}`, 'yellow');
      }
    }
  } catch (error) {
    log(`  ❌ Failed to read .npmignore: ${error.message}`, 'red');
    allPassed = false;
  }
  log('');
  
  // Final Summary
  log('═══════════════════════════════════════════════════════════════', 'cyan');
  if (allPassed) {
    log('✅ All verifications passed!', 'green');
    log('DeswalTech is ready for GitHub/npm distribution', 'green');
    log('');
    log('Next steps:', 'bright');
    log('1. Commit all changes: git add . && git commit -m "Prepare for distribution"', 'cyan');
    log('2. Push to GitHub: git push origin main', 'cyan');
    log('3. Create GitHub release: See README.md for new instructions', 'cyan');
    log('4. Publish to npm: npm publish --access public', 'cyan');
  } else {
    log('❌ Some verifications failed', 'red');
    log('Please fix the issues above before distributing', 'yellow');
    process.exit(1);
  }
  log('═══════════════════════════════════════════════════════════════\n', 'cyan');
}

// Run verification
verify().catch(error => {
  log(`\n❌ Verification failed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

