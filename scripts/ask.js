#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

class DeswalTechAsk {
  constructor() {
    this.projectPath = process.cwd();
    this.deswaltechPath = path.join(this.projectPath, '.deswaltech');
  }

  async ask(request) {
    console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║                                                                ║'));
    console.log(chalk.cyan('║        🤖 DeswalTech AI Team - Building Your Request           ║'));
    console.log(chalk.cyan('║        Claude AI Orchestrating Specialist Agents               ║'));
    console.log(chalk.cyan('║                                                                ║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════════════╝\n'));

    try {
      // Check if DeswalTech is installed
      await this.checkInstallation();

      // Get the request
      const userRequest = request || await this.getUserRequest();

      // Analyze the request
      const analysis = await this.analyzeRequest(userRequest);

      // Create orchestration plan
      const plan = await this.createOrchestrationPlan(analysis);

      // Display the plan
      await this.displayPlan(plan);

      // Generate Claude instructions
      await this.generateClaudeInstructions(userRequest, plan);

      console.log(chalk.green('\n✅ AI Team orchestration plan created!'));
      console.log(chalk.yellow('\n📚 Next steps:'));
      console.log(chalk.white('1. Copy the Claude instructions above'));
      console.log(chalk.white('2. Paste them into Cursor IDE'));
      console.log(chalk.white('3. Claude will orchestrate the specialist team'));
      console.log(chalk.white('4. Watch as your project gets built automatically'));

    } catch (error) {
      console.error(chalk.red('\n❌ AI Team request failed:'), error.message);
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

  async getUserRequest() {
    const questions = [
      {
        type: 'input',
        name: 'request',
        message: 'What would you like the AI team to build?',
        validate: (input) => input.length > 0 || 'Request is required'
      }
    ];

    const answers = await inquirer.prompt(questions);
    return answers.request;
  }

  async analyzeRequest(request) {
    const spinner = ora('Analyzing your request...').start();

    try {
      // Simple keyword analysis to determine required components
      const analysis = {
        request: request,
        components: [],
        technologies: [],
        features: [],
        complexity: 'medium'
      };

      // Analyze for backend components
      if (request.toLowerCase().includes('api') || 
          request.toLowerCase().includes('backend') || 
          request.toLowerCase().includes('server') ||
          request.toLowerCase().includes('database')) {
        analysis.components.push('backend');
        analysis.technologies.push('Node.js', 'PostgreSQL', 'Express');
      }

      // Analyze for frontend components
      if (request.toLowerCase().includes('frontend') || 
          request.toLowerCase().includes('ui') || 
          request.toLowerCase().includes('dashboard') ||
          request.toLowerCase().includes('web') ||
          request.toLowerCase().includes('react')) {
        analysis.components.push('frontend');
        analysis.technologies.push('React', 'Next.js', 'TailwindCSS');
      }

      // Analyze for mobile components
      if (request.toLowerCase().includes('mobile') || 
          request.toLowerCase().includes('app') || 
          request.toLowerCase().includes('ios') ||
          request.toLowerCase().includes('android')) {
        analysis.components.push('mobile');
        analysis.technologies.push('React Native', 'Expo');
      }

      // Analyze for specific features
      if (request.toLowerCase().includes('auth') || 
          request.toLowerCase().includes('login') || 
          request.toLowerCase().includes('user')) {
        analysis.features.push('authentication');
      }

      if (request.toLowerCase().includes('payment') || 
          request.toLowerCase().includes('stripe') || 
          request.toLowerCase().includes('billing')) {
        analysis.features.push('payments');
      }

      if (request.toLowerCase().includes('real-time') || 
          request.toLowerCase().includes('live') || 
          request.toLowerCase().includes('websocket')) {
        analysis.features.push('realtime');
      }

      if (request.toLowerCase().includes('upload') || 
          request.toLowerCase().includes('file') || 
          request.toLowerCase().includes('image')) {
        analysis.features.push('uploads');
      }

      // Determine complexity
      if (analysis.components.length > 2 || analysis.features.length > 2) {
        analysis.complexity = 'high';
      } else if (analysis.components.length === 1 && analysis.features.length <= 1) {
        analysis.complexity = 'low';
      }

      spinner.succeed('Request analyzed');
      return analysis;
    } catch (error) {
      spinner.fail('Request analysis failed');
      throw error;
    }
  }

  async createOrchestrationPlan(analysis) {
    const spinner = ora('Creating orchestration plan...').start();

    try {
      const plan = {
        analysis: analysis,
        agents: [],
        tasks: [],
        mcpUsage: [],
        qualityGates: []
      };

      // Determine which agents are needed
      if (analysis.components.includes('backend')) {
        plan.agents.push({
          name: 'Backend Expert',
          role: 'Build APIs, databases, and server-side logic',
          tasks: [
            'Design API architecture',
            'Implement database schema',
            'Create authentication system',
            'Build business logic',
            'Set up real-time features'
          ]
        });
      }

      if (analysis.components.includes('frontend')) {
        plan.agents.push({
          name: 'Frontend Expert',
          role: 'Build web UI and user experience',
          tasks: [
            'Design component architecture',
            'Implement responsive UI',
            'Integrate with APIs',
            'Add state management',
            'Optimize performance'
          ]
        });
      }

      if (analysis.components.includes('mobile')) {
        plan.agents.push({
          name: 'Mobile Expert',
          role: 'Build iOS and Android applications',
          tasks: [
            'Design mobile architecture',
            'Implement cross-platform UI',
            'Integrate with APIs',
            'Add offline capabilities',
            'Implement push notifications'
          ]
        });
      }

      // Always include DevOps for deployment
      plan.agents.push({
        name: 'DevOps Expert',
        role: 'Handle infrastructure and deployment',
        tasks: [
          'Set up CI/CD pipeline',
          'Configure production deployment',
          'Set up monitoring',
          'Optimize performance',
          'Ensure scalability'
        ]
      });

      // Always include QA for testing
      plan.agents.push({
        name: 'QA Expert',
        role: 'Ensure quality through comprehensive testing',
        tasks: [
          'Write unit tests',
          'Create integration tests',
          'Implement E2E tests',
          'Performance testing',
          'Security testing'
        ]
      });

      // Always include Security for protection
      plan.agents.push({
        name: 'Security Expert',
        role: 'Implement security measures',
        tasks: [
          'Implement authentication',
          'Add authorization',
          'Encrypt sensitive data',
          'Security headers',
          'OWASP compliance'
        ]
      });

      // Always include Business for validation
      plan.agents.push({
        name: 'Business Expert',
        role: 'Validate requirements and ROI',
        tasks: [
          'Validate user requirements',
          'Define success metrics',
          'Optimize user experience',
          'Business logic validation',
          'Go-to-market strategy'
        ]
      });

      // Determine MCP usage
      if (analysis.features.includes('authentication')) {
        plan.mcpUsage.push('Supabase (Authentication)');
      }
      if (analysis.features.includes('payments')) {
        plan.mcpUsage.push('Stripe (Payment Processing)');
      }
      if (analysis.components.includes('frontend')) {
        plan.mcpUsage.push('shadcn (Component Library)');
      }
      if (analysis.features.includes('uploads')) {
        plan.mcpUsage.push('MinIO (File Storage)');
      }

      // Quality gates
      plan.qualityGates = [
        'Level 1: Code quality, security, performance',
        'Level 2: Integration testing, E2E validation',
        'Level 3: Business requirements, stakeholder approval'
      ];

      spinner.succeed('Orchestration plan created');
      return plan;
    } catch (error) {
      spinner.fail('Orchestration plan creation failed');
      throw error;
    }
  }

  async displayPlan(plan) {
    console.log(chalk.blue('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.blue('📋 ORCHESTRATION PLAN'));
    console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

    console.log(chalk.yellow('\n🎯 Request:'));
    console.log(chalk.white(plan.analysis.request));

    console.log(chalk.yellow('\n🔍 Analysis:'));
    console.log(chalk.white(`• Components: ${plan.analysis.components.join(', ')}`));
    console.log(chalk.white(`• Technologies: ${plan.analysis.technologies.join(', ')}`));
    console.log(chalk.white(`• Features: ${plan.analysis.features.join(', ')}`));
    console.log(chalk.white(`• Complexity: ${plan.analysis.complexity}`));

    console.log(chalk.yellow('\n🤖 Specialist Agents:'));
    plan.agents.forEach(agent => {
      console.log(chalk.green(`✅ ${agent.name}`));
      console.log(chalk.white(`   Role: ${agent.role}`));
      console.log(chalk.white(`   Tasks: ${agent.tasks.join(', ')}`));
      console.log('');
    });

    if (plan.mcpUsage.length > 0) {
      console.log(chalk.yellow('\n🔌 MCPs to Use:'));
      plan.mcpUsage.forEach(mcp => {
        console.log(chalk.green(`✅ ${mcp}`));
      });
    }

    console.log(chalk.yellow('\n✨ Quality Gates:'));
    plan.qualityGates.forEach(gate => {
      console.log(chalk.green(`✅ ${gate}`));
    });
  }

  async generateClaudeInstructions(request, plan) {
    console.log(chalk.blue('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.blue('🤖 CLAUDE AI INSTRUCTIONS'));
    console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

    const instructions = `
Take the Orchestrator role from .deswaltech/ORCHESTRATOR_INSTRUCTIONS.md

I want to build: ${request}

ANALYSIS:
- Components needed: ${plan.analysis.components.join(', ')}
- Technologies: ${plan.analysis.technologies.join(', ')}
- Features: ${plan.analysis.features.join(', ')}
- Complexity: ${plan.analysis.complexity}

SPECIALIST AGENTS TO COORDINATE:
${plan.agents.map(agent => `- ${agent.name}: ${agent.role}`).join('\n')}

MCPs TO USE:
${plan.mcpUsage.length > 0 ? plan.mcpUsage.map(mcp => `- ${mcp}`).join('\n') : '- Use all available MCPs as needed'}

QUALITY STANDARDS:
${plan.qualityGates.map(gate => `- ${gate}`).join('\n')}

INSTRUCTIONS:
1. Read .deswaltech/ORCHESTRATOR_INSTRUCTIONS.md for your role
2. Reference .deswaltech/agents/ for specialist guidance
3. Plan the complete architecture
4. Delegate tasks to specialist agents
5. Coordinate collaboration between agents
6. Use MCPs for acceleration
7. Enforce quality standards at every step
8. Deliver production-ready code

Start by analyzing the requirements and creating a detailed implementation plan.
`;

    console.log(chalk.white(instructions));
  }
}

// Run ask if called directly
if (require.main === module) {
  const ask = new DeswalTechAsk();
  const request = process.argv[2];
  ask.ask(request).catch(console.error);
}

module.exports = DeswalTechAsk;
