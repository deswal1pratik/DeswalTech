/**
 * Start PBVS Workflow - Temporal Workflow Starter
 *
 * Starts a durable PBVS workflow for long-running projects.
 *
 * Usage:
 *   npx tsx start-workflow.ts --project "Your project goal"
 *   npx tsx start-workflow.ts --project "Build SaaS auth" --stakeholder "product@example.com"
 *
 * @version 4.1.0
 */

import { Connection, Client } from '@temporalio/client';
import { pbvsWorkflow } from './pbvs-workflow';
import type { PBVSProjectInput } from './types';

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const projectIndex = args.indexOf('--project');
  const stakeholderIndex = args.indexOf('--stakeholder');

  if (projectIndex === -1) {
    console.error('❌ Missing required argument: --project');
    console.log('\nUsage:');
    console.log('  npx tsx start-workflow.ts --project "Your project goal"');
    console.log('  npx tsx start-workflow.ts --project "Build SaaS" --stakeholder "user@example.com"');
    process.exit(1);
  }

  const projectGoal = args[projectIndex + 1];
  const stakeholder = stakeholderIndex !== -1 ? args[stakeholderIndex + 1] : 'default@deswal.tech';

  console.log('🚀 Starting PBVS Workflow with Temporal\n');
  console.log('📋 Project Goal:', projectGoal);
  console.log('👤 Stakeholder:', stakeholder);
  console.log('');

  try {
    // Connect to Temporal server
    console.log('🔗 Connecting to Temporal server (localhost:7233)...');
    const connection = await Connection.connect({
      address: 'localhost:7233',
    });

    const client = new Client({ connection });
    console.log('✅ Connected to Temporal\n');

    // Prepare workflow input
    const input: PBVSProjectInput = {
      projectGoal,
      stakeholder,
      timeline: {
        estimatedDuration: 'TBD during planning',
      },
      qualityRequirements: {
        testCoverage: 90,
        performanceTargets: ['<100ms API p95', '<2.5s LCP'],
        securityStandards: ['OWASP Top 10 2025', 'NIST SSDF'],
      },
    };

    // Start workflow
    const workflowId = `pbvs-${Date.now()}`;
    console.log('▶️  Starting workflow...');
    console.log('   Workflow ID:', workflowId);
    console.log('   Task Queue: deswaltech-agents');
    console.log('');

    const handle = await client.workflow.start(pbvsWorkflow, {
      taskQueue: 'deswaltech-agents',
      workflowId,
      args: [input],
    });

    console.log('✅ Workflow started successfully!\n');
    console.log('═'.repeat(60));
    console.log('🎯 WORKFLOW INFORMATION');
    console.log('═'.repeat(60));
    console.log(`Workflow ID:     ${handle.workflowId}`);
    console.log(`Run ID:          ${handle.firstExecutionRunId}`);
    console.log(`Temporal UI:     http://localhost:8080/namespaces/default/workflows/${handle.workflowId}`);
    console.log('═'.repeat(60));
    console.log('');

    console.log('📊 Monitoring Options:\n');
    console.log('1. Temporal UI: http://localhost:8080');
    console.log('2. Query workflow state:');
    console.log(`   const state = await handle.query('getState');`);
    console.log('3. Query progress:');
    console.log(`   const progress = await handle.query('getProgress');`);
    console.log('');

    console.log('⏸️  Control Options:\n');
    console.log('   Pause:  await handle.signal("pause");');
    console.log('   Resume: await handle.signal("resume");');
    console.log('');

    console.log('⏳ Workflow is now running...');
    console.log('   The workflow will continue even if this process exits.');
    console.log('   Progress is preserved and can survive crashes.\n');

    // Optionally wait for result
    const shouldWait = args.includes('--wait');
    if (shouldWait) {
      console.log('⏱️  Waiting for workflow to complete...\n');

      const result = await handle.result();

      console.log('');
      console.log('═'.repeat(60));
      console.log('✅ WORKFLOW COMPLETED');
      console.log('═'.repeat(60));
      console.log(`Project:         ${result.prd.projectName}`);
      console.log(`Status:          ${result.status}`);
      console.log(`Total Tasks:     ${result.totalTasks}`);
      console.log(`Completed:       ${result.completedTasks}`);
      console.log(`Failed:          ${result.failedTasks}`);
      console.log(`Duration:        ${(result.duration / 1000 / 60).toFixed(2)} minutes`);
      console.log(`Estimated Hours: ${result.estimatedHours}h`);
      console.log(`Actual Hours:    ${result.actualHours.toFixed(2)}h`);
      if (result.deploymentResult) {
        console.log(`Deployment:      ${result.deploymentResult.url}`);
      }
      console.log('═'.repeat(60));
      console.log('');
    } else {
      console.log('💡 Tip: Add --wait flag to wait for completion');
      console.log('   Otherwise, workflow continues in background\n');
    }

    console.log('✨ Done!\n');
  } catch (error: any) {
    console.error('❌ Error starting workflow:', error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
