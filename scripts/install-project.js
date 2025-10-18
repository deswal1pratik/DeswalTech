#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

class DeswalTechInstaller {
  constructor() {
    this.deswaltechPath = path.dirname(__dirname);
    this.currentProjectPath = process.cwd();
  }

  async install() {
    console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║                                                                ║'));
    console.log(chalk.cyan('║        🚀 DeswalTech Project Installation                      ║'));
    console.log(chalk.cyan('║        AI-Powered Development Powerhouse                      ║'));
    console.log(chalk.cyan('║                                                                ║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════════════╝\n'));

    try {
      // Check if we're in a valid project directory
      await this.validateProjectDirectory();

      // Get project configuration
      const config = await this.getProjectConfiguration();

      // Install DeswalTech components
      await this.installComponents(config);

      // Setup project structure
      await this.setupProjectStructure(config);

      // Configure MCPs
      await this.configureMCPs(config);

      // Setup infrastructure
      await this.setupInfrastructure(config);

      // Create project documentation
      await this.createProjectDocumentation(config);

      // Final setup
      await this.finalizeInstallation(config);

      console.log(chalk.green('\n✅ DeswalTech installation complete!'));
      console.log(chalk.yellow('\n📚 Next steps:'));
      console.log(chalk.white('1. Read PROJECT_SETUP.md for detailed instructions'));
      console.log(chalk.white('2. Run: npm run deswaltech:powerhouse'));
      console.log(chalk.white('3. Start building with Claude AI orchestration'));
      console.log(chalk.white('4. Use: npm run deswaltech:ask "Build me a feature"'));

    } catch (error) {
      console.error(chalk.red('\n❌ Installation failed:'), error.message);
      process.exit(1);
    }
  }

  async validateProjectDirectory() {
    const spinner = ora('Validating project directory...').start();

    try {
      // Check if package.json exists
      const packageJsonPath = path.join(this.currentProjectPath, 'package.json');
      if (!await fs.pathExists(packageJsonPath)) {
        throw new Error('No package.json found. Please run this command in a Node.js project directory.');
      }

      // Check if DeswalTech is already installed
      const deswaltechConfigPath = path.join(this.currentProjectPath, '.deswaltech');
      if (await fs.pathExists(deswaltechConfigPath)) {
        throw new Error('DeswalTech is already installed in this project.');
      }

      spinner.succeed('Project directory validated');
    } catch (error) {
      spinner.fail('Project directory validation failed');
      throw error;
    }
  }

  async getProjectConfiguration() {
    const questions = [
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        default: path.basename(this.currentProjectPath),
        validate: (input) => input.length > 0 || 'Project name is required'
      },
      {
        type: 'input',
        name: 'projectDescription',
        message: 'Describe your project:',
        default: 'AI-powered application built with DeswalTech'
      },
      {
        type: 'list',
        name: 'projectType',
        message: 'What type of project are you building?',
        choices: [
          'Full-stack Web Application',
          'Mobile Application',
          'API Backend',
          'Frontend Only',
          'Microservice',
          'Other'
        ],
        default: 'Full-stack Web Application'
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select features you want to include:',
        choices: [
          { name: 'Authentication (JWT, OAuth)', value: 'auth', checked: true },
          { name: 'Database (PostgreSQL)', value: 'database', checked: true },
          { name: 'Real-time features (WebSocket)', value: 'realtime', checked: false },
          { name: 'Payment processing (Stripe)', value: 'payments', checked: false },
          { name: 'File uploads (MinIO)', value: 'uploads', checked: false },
          { name: 'Email notifications', value: 'email', checked: false },
          { name: 'Monitoring (Prometheus)', value: 'monitoring', checked: true },
          { name: 'Testing framework', value: 'testing', checked: true }
        ]
      },
      {
        type: 'list',
        name: 'deployment',
        message: 'Where will you deploy this project?',
        choices: [
          'Railway',
          'Vercel',
          'Netlify',
          'AWS',
          'Google Cloud',
          'Local only',
          'Other'
        ],
        default: 'Railway'
      }
    ];

    return await inquirer.prompt(questions);
  }

  async installComponents(config) {
    const spinner = ora('Installing DeswalTech components...').start();

    try {
      // Create .deswaltech directory
      await fs.ensureDir(path.join(this.currentProjectPath, '.deswaltech'));

      // Copy agent files
      await fs.copy(
        path.join(this.deswaltechPath, 'agents'),
        path.join(this.currentProjectPath, '.deswaltech/agents')
      );

      // Copy infrastructure templates
      await fs.copy(
        path.join(this.deswaltechPath, 'Infrastructure'),
        path.join(this.currentProjectPath, '.deswaltech/infrastructure')
      );

      // Copy MCP server
      await fs.copy(
        path.join(this.deswaltechPath, 'mcp-server'),
        path.join(this.currentProjectPath, '.deswaltech/mcp-server')
      );

      // Copy templates
      await fs.copy(
        path.join(this.deswaltechPath, 'Templates'),
        path.join(this.currentProjectPath, '.deswaltech/templates')
      );

      // Copy tools
      await fs.copy(
        path.join(this.deswaltechPath, 'Tools'),
        path.join(this.currentProjectPath, '.deswaltech/tools')
      );

      // Copy documentation
      await fs.copy(
        path.join(this.deswaltechPath, 'DESWALTECH_COMPLETE_GUIDE.md'),
        path.join(this.currentProjectPath, '.deswaltech/DESWALTECH_GUIDE.md')
      );

      await fs.copy(
        path.join(this.deswaltechPath, 'ORCHESTRATOR_INSTRUCTIONS.md'),
        path.join(this.currentProjectPath, '.deswaltech/ORCHESTRATOR_INSTRUCTIONS.md')
      );

      spinner.succeed('DeswalTech components installed');
    } catch (error) {
      spinner.fail('Failed to install components');
      throw error;
    }
  }

  async setupProjectStructure(config) {
    const spinner = ora('Setting up project structure...').start();

    try {
      // Create project directories
      const directories = [
        'src',
        'src/backend',
        'src/frontend',
        'src/mobile',
        'src/shared',
        'tests',
        'docs',
        'scripts'
      ];

      for (const dir of directories) {
        await fs.ensureDir(path.join(this.currentProjectPath, dir));
      }

      // Create basic project files
      await this.createProjectFiles(config);

      spinner.succeed('Project structure created');
    } catch (error) {
      spinner.fail('Failed to setup project structure');
      throw error;
    }
  }

  async createProjectFiles(config) {
    // Create .deswaltech/config.json
    const deswaltechConfig = {
      projectName: config.projectName,
      projectDescription: config.projectDescription,
      projectType: config.projectType,
      features: config.features,
      deployment: config.deployment,
      installedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    await fs.writeJson(
      path.join(this.currentProjectPath, '.deswaltech/config.json'),
      deswaltechConfig,
      { spaces: 2 }
    );

    // Create .deswaltech/mcp.json
    const mcpConfig = {
      mcpServers: {
        Figma: {
          url: "http://127.0.0.1:3845/mcp"
        },
        shadcn: {
          command: "npx",
          args: ["shadcn@latest", "mcp"]
        },
        supabase: {
          command: "npx",
          args: [
            "-y",
            "@supabase/mcp-server-supabase",
            "--read-only",
            "--project-ref=vtevoxxsslmjuuxbimzj"
          ],
          env: {
            SUPABASE_ACCESS_TOKEN: "sbp_a056626d50719c5c02d7adc3c78f35d905c2dfab"
          }
        },
        browsermcp: {
          command: "npx",
          args: ["@browsermcp/mcp@latest"]
        },
        Ref: {
          type: "http",
          url: "https://api.ref.tools/mcp?apiKey=ref-fd7b4ceb643c30336f9b"
        },
        Exa: {
          command: "npx",
          args: ["@exa/mcp-server"],
          env: {
            EXA_API_KEY: "YOUR_EXA_API_KEY_HERE"
          }
        }
      }
    };

    await fs.writeJson(
      path.join(this.currentProjectPath, '.deswaltech/mcp.json'),
      mcpConfig,
      { spaces: 2 }
    );

    // Create .cursorules
    const cursorules = `# 🎯 ${config.projectName} - DeswalTech Integration

## Purpose
This project uses DeswalTech AI-powered development powerhouse for building production-ready applications.

## DeswalTech Integration
- **Orchestrator**: Claude AI coordinates specialist agents
- **Agents**: Backend, Frontend, Mobile, DevOps, QA, Security, Business experts
- **MCPs**: Supabase, shadcn, Figma, Stripe, Ref, Exa, BrowserMCP
- **Quality**: 3-level quality gates enforced
- **Infrastructure**: Docker Compose + Railway deployment

## How to Use
1. Read .deswaltech/ORCHESTRATOR_INSTRUCTIONS.md
2. Reference .deswaltech/agents/ for specialist guidance
3. Use MCPs for acceleration
4. Enforce quality standards
5. Coordinate team collaboration

## Project Configuration
- **Name**: ${config.projectName}
- **Type**: ${config.projectType}
- **Features**: ${config.features.join(', ')}
- **Deployment**: ${config.deployment}

## Available Commands
- \`npm run deswaltech:powerhouse\` - Activate DeswalTech
- \`npm run deswaltech:ask "Build me a feature"\` - Ask AI team
- \`npm run deswaltech:status\` - Check system status
- \`npm run deswaltech:delegate\` - Delegate tasks

## Quality Standards
- Code quality: Linted, formatted, TypeScript
- Testing: >80% coverage, integration, E2E
- Security: Authentication, authorization, encryption
- Performance: <100ms API, optimized queries
- Documentation: Complete setup and API docs

## MCPs Available
- Supabase: Database + Auth + Real-time
- shadcn: Component library
- Figma: Design system
- Stripe: Payment processing
- Ref: Code patterns
- Exa: AI research
- BrowserMCP: Web automation

## Ready to Build
Tell Claude: "Take the Orchestrator role from .deswaltech/ORCHESTRATOR_INSTRUCTIONS.md and build [your feature] using the specialist agents and MCPs."
`;

    await fs.writeFile(
      path.join(this.currentProjectPath, '.cursorules'),
      cursorules
    );
  }

  async configureMCPs(config) {
    const spinner = ora('Configuring MCPs...').start();

    try {
      // Copy MCP configuration to project root
      await fs.copy(
        path.join(this.currentProjectPath, '.deswaltech/mcp.json'),
        path.join(this.currentProjectPath, 'mcp.json')
      );

      spinner.succeed('MCPs configured');
    } catch (error) {
      spinner.fail('Failed to configure MCPs');
      throw error;
    }
  }

  async setupInfrastructure(config) {
    const spinner = ora('Setting up infrastructure...').start();

    try {
      // Create docker-compose.yml for local development
      const dockerCompose = `version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: ${config.projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass redispass
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin123
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  postgres_data:
  redis_data:
  minio_data:
  grafana_data:
`;

      await fs.writeFile(
        path.join(this.currentProjectPath, 'docker-compose.yml'),
        dockerCompose
      );

      // Create prometheus.yml
      const prometheusConfig = `global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
`;

      await fs.writeFile(
        path.join(this.currentProjectPath, 'prometheus.yml'),
        prometheusConfig
      );

      spinner.succeed('Infrastructure configured');
    } catch (error) {
      spinner.fail('Failed to setup infrastructure');
      throw error;
    }
  }

  async createProjectDocumentation(config) {
    const spinner = ora('Creating project documentation...').start();

    try {
      // Create PROJECT_SETUP.md
      const setupDoc = `# 🚀 ${config.projectName} - Project Setup

## Overview
${config.projectDescription}

## DeswalTech Integration
This project uses DeswalTech AI-powered development powerhouse for building production-ready applications.

## Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Start Infrastructure
\`\`\`bash
docker-compose up -d
\`\`\`

### 3. Activate DeswalTech
\`\`\`bash
npm run deswaltech:powerhouse
\`\`\`

### 4. Start Building
\`\`\`bash
npm run deswaltech:ask "Build me a feature"
\`\`\`

## Available Commands

### DeswalTech Commands
- \`npm run deswaltech:powerhouse\` - Activate DeswalTech at 100% capacity
- \`npm run deswaltech:ask "request"\` - Ask AI team to build something
- \`npm run deswaltech:delegate\` - Delegate tasks to specific agents
- \`npm run deswaltech:status\` - Check system status
- \`npm run deswaltech:tasks\` - View assigned tasks
- \`npm run deswaltech:dashboard\` - Open monitoring dashboard

### Development Commands
- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run test\` - Run tests
- \`npm run lint\` - Lint code

## Project Structure
\`\`\`
${config.projectName}/
├── .deswaltech/           # DeswalTech configuration
│   ├── agents/            # Specialist agent files
│   ├── infrastructure/    # Infrastructure templates
│   ├── mcp-server/       # MCP server
│   ├── templates/         # Project templates
│   └── tools/             # Utility scripts
├── src/                   # Source code
│   ├── backend/           # Backend code
│   ├── frontend/          # Frontend code
│   ├── mobile/            # Mobile code
│   └── shared/            # Shared code
├── tests/                 # Tests
├── docs/                  # Documentation
├── scripts/               # Build scripts
├── docker-compose.yml     # Local infrastructure
├── mcp.json              # MCP configuration
└── .cursorules           # Cursor AI rules
\`\`\`

## Features Included
${config.features.map(feature => `- ${feature}`).join('\n')}

## Deployment
Target deployment: ${config.deployment}

## Quality Standards
- Code quality: Linted, formatted, TypeScript
- Testing: >80% coverage, integration, E2E
- Security: Authentication, authorization, encryption
- Performance: <100ms API, optimized queries
- Documentation: Complete setup and API docs

## MCPs Available
- Supabase: Database + Auth + Real-time
- shadcn: Component library
- Figma: Design system
- Stripe: Payment processing
- Ref: Code patterns
- Exa: AI research
- BrowserMCP: Web automation

## Getting Help
1. Read .deswaltech/DESWALTECH_GUIDE.md for complete documentation
2. Check .deswaltech/ORCHESTRATOR_INSTRUCTIONS.md for orchestration guide
3. Reference .deswaltech/agents/ for specialist guidance
4. Use MCPs for acceleration

## Ready to Build
Tell Claude: "Take the Orchestrator role from .deswaltech/ORCHESTRATOR_INSTRUCTIONS.md and build [your feature] using the specialist agents and MCPs."
`;

      await fs.writeFile(
        path.join(this.currentProjectPath, 'PROJECT_SETUP.md'),
        setupDoc
      );

      spinner.succeed('Project documentation created');
    } catch (error) {
      spinner.fail('Failed to create documentation');
      throw error;
    }
  }

  async finalizeInstallation(config) {
    const spinner = ora('Finalizing installation...').start();

    try {
      // Update package.json with DeswalTech scripts
      const packageJsonPath = path.join(this.currentProjectPath, 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);

      packageJson.scripts = {
        ...packageJson.scripts,
        'deswaltech:powerhouse': 'node .deswaltech/tools/powerhouse.js',
        'deswaltech:ask': 'node .deswaltech/tools/ask.js',
        'deswaltech:delegate': 'node .deswaltech/tools/delegate.js',
        'deswaltech:status': 'node .deswaltech/tools/status.js',
        'deswaltech:tasks': 'node .deswaltech/tools/tasks.js',
        'deswaltech:dashboard': 'node .deswaltech/tools/dashboard.js'
      };

      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

      // Create .gitignore entries
      const gitignorePath = path.join(this.currentProjectPath, '.gitignore');
      let gitignore = '';
      
      if (await fs.pathExists(gitignorePath)) {
        gitignore = await fs.readFile(gitignorePath, 'utf8');
      }

      const deswaltechGitignore = `
# DeswalTech
.deswaltech/config.json
.deswaltech/mcp-server/.env
.deswaltech/mcp-server/dist/
.deswaltech/mcp-server/node_modules/
`;

      if (!gitignore.includes('# DeswalTech')) {
        await fs.writeFile(gitignorePath, gitignore + deswaltechGitignore);
      }

      spinner.succeed('Installation finalized');
    } catch (error) {
      spinner.fail('Failed to finalize installation');
      throw error;
    }
  }
}

// Run installation if called directly
if (require.main === module) {
  const installer = new DeswalTechInstaller();
  installer.install().catch(console.error);
}

module.exports = DeswalTechInstaller;
