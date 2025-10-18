#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { execSync } = require('child_process');

class DeswalTechStatus {
  constructor() {
    this.projectPath = process.cwd();
    this.deswaltechPath = path.join(this.projectPath, '.deswaltech');
  }

  async check() {
    console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║                                                                ║'));
    console.log(chalk.cyan('║        📊 DeswalTech System Status Check                        ║'));
    console.log(chalk.cyan('║        AI-Powered Development System Health                    ║'));
    console.log(chalk.cyan('║                                                                ║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════════════╝\n'));

    try {
      // Check DeswalTech installation
      await this.checkInstallation();

      // Check MCP server
      await this.checkMCPServer();

      // Check infrastructure
      await this.checkInfrastructure();

      // Check project configuration
      await this.checkProjectConfig();

      // Display overall status
      await this.displayOverallStatus();

    } catch (error) {
      console.error(chalk.red('\n❌ Status check failed:'), error.message);
      process.exit(1);
    }
  }

  async checkInstallation() {
    const spinner = ora('Checking DeswalTech installation...').start();

    try {
      if (!await fs.pathExists(this.deswaltechPath)) {
        spinner.fail('DeswalTech not installed');
        console.log(chalk.red('❌ DeswalTech not found in this project'));
        console.log(chalk.yellow('💡 Run: npm run deswaltech:install'));
        return false;
      }

      const configPath = path.join(this.deswaltechPath, 'config.json');
      if (!await fs.pathExists(configPath)) {
        spinner.fail('DeswalTech configuration missing');
        console.log(chalk.red('❌ Configuration file not found'));
        return false;
      }

      const config = await fs.readJson(configPath);
      spinner.succeed(`DeswalTech installed for: ${config.projectName}`);
      return true;
    } catch (error) {
      spinner.fail('Installation check failed');
      return false;
    }
  }

  async checkMCPServer() {
    const spinner = ora('Checking MCP server...').start();

    try {
      const mcpServerPath = path.join(this.deswaltechPath, 'mcp-server');
      if (!await fs.pathExists(mcpServerPath)) {
        spinner.fail('MCP server not found');
        return false;
      }

      // Check if server is running
      try {
        execSync('curl -s http://localhost:3001/health > /dev/null', { stdio: 'pipe' });
        spinner.succeed('MCP server running on port 3001');
        return true;
      } catch (error) {
        spinner.warn('MCP server not running');
        console.log(chalk.yellow('💡 Start with: npm run deswaltech:powerhouse'));
        return false;
      }
    } catch (error) {
      spinner.fail('MCP server check failed');
      return false;
    }
  }

  async checkInfrastructure() {
    const spinner = ora('Checking infrastructure services...').start();

    try {
      const dockerComposePath = path.join(this.projectPath, 'docker-compose.yml');
      if (!await fs.pathExists(dockerComposePath)) {
        spinner.warn('No docker-compose.yml found');
        return false;
      }

      // Check Docker services
      try {
        const output = execSync('docker-compose ps --services', { 
          cwd: this.projectPath, 
          stdio: 'pipe' 
        }).toString();
        
        const services = output.trim().split('\n').filter(s => s.length > 0);
        if (services.length > 0) {
          spinner.succeed(`${services.length} Docker services configured`);
          return true;
        } else {
          spinner.warn('No Docker services running');
          return false;
        }
      } catch (error) {
        spinner.warn('Docker not available');
        return false;
      }
    } catch (error) {
      spinner.fail('Infrastructure check failed');
      return false;
    }
  }

  async checkProjectConfig() {
    const spinner = ora('Checking project configuration...').start();

    try {
      const configPath = path.join(this.deswaltechPath, 'config.json');
      if (!await fs.pathExists(configPath)) {
        spinner.fail('Project configuration missing');
        return false;
      }

      const config = await fs.readJson(configPath);
      
      // Check required files
      const requiredFiles = [
        'agents',
        'mcp-server',
        'templates',
        'tools'
      ];

      let allFilesExist = true;
      for (const file of requiredFiles) {
        const filePath = path.join(this.deswaltechPath, file);
        if (!await fs.pathExists(filePath)) {
          allFilesExist = false;
          break;
        }
      }

      if (allFilesExist) {
        spinner.succeed('Project configuration complete');
        return true;
      } else {
        spinner.fail('Project configuration incomplete');
        return false;
      }
    } catch (error) {
      spinner.fail('Project configuration check failed');
      return false;
    }
  }

  async displayOverallStatus() {
    console.log(chalk.blue('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.blue('📊 OVERALL SYSTEM STATUS'));
    console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

    // Check each component
    const installation = await this.checkInstallation();
    const mcpServer = await this.checkMCPServer();
    const infrastructure = await this.checkInfrastructure();
    const projectConfig = await this.checkProjectConfig();

    // Calculate overall health
    const checks = [installation, mcpServer, infrastructure, projectConfig];
    const passedChecks = checks.filter(check => check === true).length;
    const totalChecks = checks.length;
    const healthPercentage = (passedChecks / totalChecks) * 100;

    console.log(chalk.yellow('\n📈 Health Score:'));
    console.log(chalk.white(`${passedChecks}/${totalChecks} checks passed (${healthPercentage.toFixed(0)}%)`));

    if (healthPercentage >= 75) {
      console.log(chalk.green('✅ System Status: HEALTHY'));
    } else if (healthPercentage >= 50) {
      console.log(chalk.yellow('⚠️  System Status: DEGRADED'));
    } else {
      console.log(chalk.red('❌ System Status: CRITICAL'));
    }

    // Display recommendations
    console.log(chalk.yellow('\n💡 Recommendations:'));
    
    if (!installation) {
      console.log(chalk.red('• Install DeswalTech: npm run deswaltech:install'));
    }
    
    if (!mcpServer) {
      console.log(chalk.yellow('• Start MCP server: npm run deswaltech:powerhouse'));
    }
    
    if (!infrastructure) {
      console.log(chalk.yellow('• Start infrastructure: docker-compose up -d'));
    }
    
    if (!projectConfig) {
      console.log(chalk.red('• Reinstall DeswalTech: npm run deswaltech:install'));
    }

    if (healthPercentage >= 75) {
      console.log(chalk.green('• System ready for development'));
      console.log(chalk.green('• Use: npm run deswaltech:ask "Build me a feature"'));
    }

    console.log(chalk.blue('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  }
}

// Run status if called directly
if (require.main === module) {
  const status = new DeswalTechStatus();
  status.check().catch(console.error);
}

module.exports = DeswalTechStatus;
