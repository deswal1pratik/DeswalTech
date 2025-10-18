#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { execSync } = require('child_process');

class DeswalTechSetup {
  constructor() {
    this.deswaltechPath = path.dirname(__dirname);
  }

  async setup() {
    console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║                                                                ║'));
    console.log(chalk.cyan('║        🚀 DeswalTech Setup & Configuration                      ║'));
    console.log(chalk.cyan('║        AI-Powered Development Powerhouse                      ║'));
    console.log(chalk.cyan('║                                                                ║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════════════╝\n'));

    try {
      // Install dependencies
      await this.installDependencies();

      // Setup MCP server
      await this.setupMCPServer();

      // Setup infrastructure
      await this.setupInfrastructure();

      // Create global CLI
      await this.createGlobalCLI();

      // Verify installation
      await this.verifyInstallation();

      console.log(chalk.green('\n✅ DeswalTech setup complete!'));
      console.log(chalk.yellow('\n📚 Next steps:'));
      console.log(chalk.white('1. Use: deswaltech install <project-directory>'));
      console.log(chalk.white('2. Or: npx deswaltech install <project-directory>'));
      console.log(chalk.white('3. Start building with AI orchestration'));

    } catch (error) {
      console.error(chalk.red('\n❌ Setup failed:'), error.message);
      process.exit(1);
    }
  }

  async installDependencies() {
    const spinner = ora('Installing dependencies...').start();

    try {
      // Install main dependencies
      execSync('npm install', { 
        cwd: this.deswaltechPath, 
        stdio: 'pipe' 
      });

      // Install MCP server dependencies
      execSync('npm install', { 
        cwd: path.join(this.deswaltechPath, 'mcp-server'), 
        stdio: 'pipe' 
      });

      spinner.succeed('Dependencies installed');
    } catch (error) {
      spinner.fail('Failed to install dependencies');
      throw error;
    }
  }

  async setupMCPServer() {
    const spinner = ora('Setting up MCP server...').start();

    try {
      const mcpServerPath = path.join(this.deswaltechPath, 'mcp-server');

      // Build MCP server
      execSync('npm run build', { 
        cwd: mcpServerPath, 
        stdio: 'pipe' 
      });

      // Create .env file if it doesn't exist
      const envPath = path.join(mcpServerPath, '.env');
      if (!await fs.pathExists(envPath)) {
        await fs.copy(
          path.join(mcpServerPath, 'env.example'),
          envPath
        );
      }

      spinner.succeed('MCP server configured');
    } catch (error) {
      spinner.fail('Failed to setup MCP server');
      throw error;
    }
  }

  async setupInfrastructure() {
    const spinner = ora('Setting up infrastructure...').start();

    try {
      const infrastructurePath = path.join(this.deswaltechPath, 'Infrastructure');

      // Start infrastructure services
      execSync('docker-compose up -d', { 
        cwd: infrastructurePath, 
        stdio: 'pipe' 
      });

      spinner.succeed('Infrastructure started');
    } catch (error) {
      spinner.warn('Infrastructure setup skipped (Docker not available)');
    }
  }

  async createGlobalCLI() {
    const spinner = ora('Creating global CLI...').start();

    try {
      // Make bin/deswaltech executable
      const binPath = path.join(this.deswaltechPath, 'bin/deswaltech');
      execSync(`chmod +x "${binPath}"`, { stdio: 'pipe' });

      // Create global symlink
      const globalBinPath = '/usr/local/bin/deswaltech';
      try {
        execSync(`ln -sf "${binPath}" "${globalBinPath}"`, { stdio: 'pipe' });
      } catch (error) {
        // Fallback to user bin
        const userBinPath = path.join(process.env.HOME, '.local/bin/deswaltech');
        await fs.ensureDir(path.dirname(userBinPath));
        execSync(`ln -sf "${binPath}" "${userBinPath}"`, { stdio: 'pipe' });
      }

      spinner.succeed('Global CLI created');
    } catch (error) {
      spinner.fail('Failed to create global CLI');
      throw error;
    }
  }

  async verifyInstallation() {
    const spinner = ora('Verifying installation...').start();

    try {
      // Test CLI
      execSync('deswaltech --help', { stdio: 'pipe' });

      // Test MCP server
      const mcpServerPath = path.join(this.deswaltechPath, 'mcp-server');
      execSync('npm start &', { 
        cwd: mcpServerPath, 
        stdio: 'pipe',
        detached: true 
      });

      // Wait a moment for server to start
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Test status
      execSync('deswaltech status', { stdio: 'pipe' });

      spinner.succeed('Installation verified');
    } catch (error) {
      spinner.fail('Installation verification failed');
      throw error;
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new DeswalTechSetup();
  setup.setup().catch(console.error);
}

module.exports = DeswalTechSetup;
