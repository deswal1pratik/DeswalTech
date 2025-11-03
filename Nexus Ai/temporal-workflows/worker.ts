/**
 * Temporal Worker - Executes PBVS Workflow Activities
 *
 * This worker process runs activities (tasks) for the PBVS workflow.
 * It should be started before running workflows.
 *
 * @version 4.1.0
 */

import { Worker } from '@temporalio/worker';
import * as activities from './activities';

async function run() {
  console.log('🚀 Starting Temporal Worker for DeswalTech PBVS...\n');

  try {
    // Create worker
    const worker = await Worker.create({
      workflowsPath: require.resolve('./pbvs-workflow'),
      activities,
      taskQueue: 'deswaltech-agents',
      maxConcurrentActivityTaskExecutions: 5,
      maxConcurrentWorkflowTaskExecutions: 100,
    });

    console.log('✅ Worker created successfully');
    console.log('📋 Task Queue: deswaltech-agents');
    console.log('⚙️  Max Concurrent Activities: 5');
    console.log('⚙️  Max Concurrent Workflows: 100\n');

    console.log('🔗 Connected to Temporal Server: localhost:7233');
    console.log('🌐 Temporal UI: http://localhost:8080\n');

    console.log('👷 Worker is ready to execute PBVS workflows...\n');

    // Run the worker
    await worker.run();
  } catch (error) {
    console.error('❌ Worker failed to start:', error);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
