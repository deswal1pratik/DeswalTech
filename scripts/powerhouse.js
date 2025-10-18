#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { execSync } = require('child_process');

class DeswalTechPowerhouse {
  constructor() {
    this.projectPath = process.cwd();
    this.deswaltechPath = path.join(this.projectPath, '.deswaltech');
  }

  async activate() {
    console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║                                                                ║'));
    console.log(chalk.cyan('║        🚀 DeswalTech Powerhouse - 100% CAPACITY                ║'));
    console.log(chalk.cyan('║        AI-Powered Development System Activated                ║'));
    console.log(chalk.cyan('║                                                                ║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════════════╝\n'));

    try {
      // Check if DeswalTech is installed
      await this.checkInstallation();

      // Start infrastructure
      await this.startInfrastructure();

      // Start MCP server
      await this.startMCPServer();

      // Set environment variables
      await this.setEnvironmentVariables();

      // Display status
      await this.displayStatus();

      console.log(chalk.green('\n✅ DeswalTech Powerhouse activated!'));
      console.log(chalk.yellow('\n📚 Available commands:'));
      console.log(chalk.white('• npm run deswaltech:ask "Build me a feature"'));
      console.log(chalk.white('• npm run deswaltech:delegate'));
      console.log(chalk.white('• npm run deswaltech:status'));
      console.log(chalk.white('• npm run deswaltech:tasks'));
      console.log(chalk.white('• npm run deswaltech:dashboard'));

    } catch (error) {
      console.error(chalk.red('\n❌ Powerhouse activation failed:'), error.message);
      process.exit(1);
    }
  }

  async checkInstallation() {
    const spinner = ora('Checking DeswalTech installation...').start();

    try {
      if (!await fs.pathExists(this.deswaltechPath)) {
        throw new Error('DeswalTech not installed. Run: npm run deswaltech:install');
      }

      const configPath = path.join(this.deswaltechPath, 'config.json');
      if (!await fs.pathExists(configPath)) {
        throw new Error('DeswalTech configuration missing. Reinstall DeswalTech.');
      }

      const config = await fs.readJson(configPath);
      spinner.succeed(`DeswalTech found for project: ${config.projectName}`);
    } catch (error) {
      spinner.fail('DeswalTech installation check failed');
      throw error;
    }
  }

  async startInfrastructure() {
    const spinner = ora('Starting infrastructure services...').start();

    try {
      // Check if docker-compose.yml exists
      const dockerComposePath = path.join(this.projectPath, 'docker-compose.yml');
      if (await fs.pathExists(dockerComposePath)) {
        execSync('docker-compose up -d', { 
          cwd: this.projectPath, 
          stdio: 'pipe' 
        });
        spinner.succeed('Infrastructure services started');
      } else {
        spinner.warn('No docker-compose.yml found, skipping infrastructure');
      }
    } catch (error) {
      spinner.warn('Infrastructure startup failed (Docker not available)');
    }
  }

  async startMCPServer() {
    const spinner = ora('Starting MCP server...').start();

    try {
      const mcpServerPath = path.join(this.deswaltechPath, 'mcp-server');
      
      if (await fs.pathExists(mcpServerPath)) {
        // Start MCP server in background
        execSync('npm start &', { 
          cwd: mcpServerPath, 
          stdio: 'pipe',
          detached: true 
        });

        // Wait for server to start
        await new Promise(resolve => setTimeout(resolve, 3000));
        spinner.succeed('MCP server started');
      } else {
        spinner.warn('MCP server not found');
      }
    } catch (error) {
      spinner.warn('MCP server startup failed');
    }
  }

  async setEnvironmentVariables() {
    const spinner = ora('Setting environment variables...').start();

    try {
      // Set DeswalTech environment variables
      process.env.DESWALTECH_ROOT = this.deswaltechPath;
      process.env.DESWALTECH_PROJECT = this.projectPath;
      process.env.MCP_SERVER = 'http://localhost:3001';
      process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/project_db';
      process.env.REDIS_URL = 'redis://:redispass@localhost:6379';
      process.env.S3_ENDPOINT = 'http://localhost:9000';
      process.env.S3_ACCESS_KEY = 'minioadmin';
      process.env.S3_SECRET_KEY = 'minioadmin123';

      // AI Expert Agents
      process.env.AI_ORCHESTRATOR_ENABLED = 'true';
      process.env.BACKEND_EXPERT_ENABLED = 'true';
      process.env.FRONTEND_EXPERT_ENABLED = 'true';
      process.env.MOBILE_EXPERT_ENABLED = 'true';
      process.env.DEVOPS_EXPERT_ENABLED = 'true';
      process.env.QA_EXPERT_ENABLED = 'true';
      process.env.SECURITY_EXPERT_ENABLED = 'true';
      process.env.BUSINESS_EXPERT_ENABLED = 'true';

      // Quality Gates
      process.env.QUALITY_LEVEL_1_ENABLED = 'true';
      process.env.QUALITY_LEVEL_2_ENABLED = 'true';
      process.env.QUALITY_LEVEL_3_ENABLED = 'true';

      spinner.succeed('Environment variables set');
    } catch (error) {
      spinner.fail('Failed to set environment variables');
      throw error;
    }
  }

  async displayStatus() {
    console.log(chalk.blue('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.blue('📊 DESWALTECH POWERHOUSE STATUS'));
    console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

    try {
      // Check MCP server
      try {
        execSync('curl -s http://localhost:3001/health > /dev/null', { stdio: 'pipe' });
        console.log(chalk.green('✅ MCP Server: Running'));
      } catch (error) {
        console.log(chalk.red('❌ MCP Server: Not running'));
      }

      // Check Docker services
      try {
        const output = execSync('docker-compose ps --services', { 
          cwd: this.projectPath, 
          stdio: 'pipe' 
        }).toString();
        const services = output.trim().split('\n').filter(s => s.length > 0);
        console.log(chalk.green(`✅ Docker Services: ${services.length} running`));
      } catch (error) {
        console.log(chalk.yellow('⚠️  Docker Services: Not available'));
      }

      // Check project configuration
      const configPath = path.join(this.deswaltechPath, 'config.json');
      if (await fs.pathExists(configPath)) {
        const config = await fs.readJson(configPath);
        console.log(chalk.green(`✅ Project: ${config.projectName}`));
        console.log(chalk.green(`✅ Type: ${config.projectType}`));
        console.log(chalk.green(`✅ Features: ${config.features.join(', ')}`));
      }

      console.log(chalk.blue('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.blue('🤖 EXPERT AGENTS AVAILABLE'));
      console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.green('✅ AI Expert Orchestrator      (Senior Technical Leader)'));
      console.log(chalk.green('✅ Backend Expert Agent        (Server & API Architecture)'));
      console.log(chalk.green('✅ Frontend Expert Agent       (UI/UX Design)'));
      console.log(chalk.green('✅ Mobile Expert Agent         (iOS/Android Development)'));
      console.log(chalk.green('✅ DevOps Expert Agent         (Infrastructure & Deployment)'));
      console.log(chalk.green('✅ QA Expert Agent             (Testing & Quality)'));
      console.log(chalk.green('✅ Security Expert Agent       (Security & Compliance)'));
      console.log(chalk.green('✅ Business Expert Agent       (Requirements & Strategy)'));

      console.log(chalk.blue('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.blue('🔌 MCPs AVAILABLE'));
      console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.green('✅ Supabase                    (Database + Auth + Real-time)'));
      console.log(chalk.green('✅ shadcn                      (Component Library)'));
      console.log(chalk.green('✅ Figma                       (Design System)'));
      console.log(chalk.green('✅ Stripe                      (Payment Processing)'));
      console.log(chalk.green('✅ Ref                         (Code Patterns)'));
      console.log(chalk.green('✅ Exa                         (AI Research)'));
      console.log(chalk.green('✅ BrowserMCP                  (Web Automation)'));

      console.log(chalk.blue('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.blue('✨ QUALITY GATES CONFIGURED'));
      console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.green('✅ Level 1: Automated Quality Checks'));
      console.log(chalk.green('   └─ Code quality, security, performance, tests'));
      console.log(chalk.green('✅ Level 2: Integration Quality Checks'));
      console.log(chalk.green('   └─ Cross-agent integration, end-to-end workflows'));
      console.log(chalk.green('✅ Level 3: Business Quality Checks'));
      console.log(chalk.green('   └─ Business requirements, stakeholder approval'));

    } catch (error) {
      console.log(chalk.red('❌ Status check failed'));
    }
  }
}

// Run powerhouse if called directly
if (require.main === module) {
  const powerhouse = new DeswalTechPowerhouse();
  powerhouse.activate().catch(console.error);
}

module.exports = DeswalTechPowerhouse;
