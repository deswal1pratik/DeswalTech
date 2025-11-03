/**
 * PBVS Workflow - Durable Plan-Build-Validate-Scale Execution
 *
 * This workflow orchestrates the entire PBVS lifecycle with full durability.
 * It can survive crashes, restarts, and multi-day executions without losing state.
 *
 * @version 4.1.0
 */

import { proxyActivities, sleep, defineSignal, defineQuery, setHandler } from '@temporalio/workflow';
import type * as activities from './activities';
import {
  PBVSProjectInput,
  PBVSResult,
  ProjectState,
  Task,
  BuildResult,
  WorkflowCheckpoint,
} from './types';

// Proxy activities with timeout and retry configuration
const {
  createPRD,
  parsePRDIntoTasks,
  executeTask,
  validateBuild,
  deployToEnvironment,
  storeCheckpoint,
  sendNotification,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '24 hours',  // Activities can run up to 24 hours
  retry: {
    initialInterval: '1 minute',
    maximumAttempts: 3,
    backoffCoefficient: 2,
    maximumInterval: '10 minutes',
  },
});

// Signals for external control
export const pauseSignal = defineSignal('pause');
export const resumeSignal = defineSignal('resume');
export const approveTaskSignal = defineSignal<[string]>('approveTask');

// Queries for state inspection
export const getStateQuery = defineQuery<ProjectState>('getState');
export const getProgressQuery = defineQuery<{ completed: number; total: number }>('getProgress');

/**
 * Main PBVS Workflow
 *
 * Orchestrates the full Plan → Build → Validate → Scale lifecycle.
 * Fully durable - can survive crashes and resume from last checkpoint.
 *
 * @param input - Project configuration
 * @returns Complete project result
 */
export async function pbvsWorkflow(input: PBVSProjectInput): Promise<PBVSResult> {
  const projectId = `proj-${Date.now()}`;
  const startTime = Date.now();

  // Initialize project state
  let state: ProjectState = {
    projectId,
    status: 'planning',
    currentPhase: 'plan',
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedTasks: [],
    failedTasks: [],
    blockedTasks: [],
    totalTasks: 0,
    completedTasksCount: 0,
    estimatedHours: 0,
  };

  // Pause/resume control
  let isPaused = false;

  // Set up signal handlers
  setHandler(pauseSignal, () => {
    isPaused = true;
    console.log('[pbvsWorkflow] Workflow paused');
  });

  setHandler(resumeSignal, () => {
    isPaused = false;
    console.log('[pbvsWorkflow] Workflow resumed');
  });

  // Set up query handlers
  setHandler(getStateQuery, () => state);
  setHandler(getProgressQuery, () => ({
    completed: state.completedTasksCount,
    total: state.totalTasks,
  }));

  console.log(`[pbvsWorkflow] Starting PBVS workflow for project ${projectId}`);
  await sendNotification(`Starting project: ${input.projectGoal}`);

  try {
    // ========================================================================
    // PHASE 1: PLAN - Create PRD
    // ========================================================================
    console.log('[pbvsWorkflow] Phase 1: PLAN - Creating PRD...');
    state.currentPhase = 'plan';
    state.status = 'planning';
    state.updatedAt = new Date().toISOString();

    const prd = await createPRD(input);
    state.prd = prd;

    await storeCheckpoint({
      projectId,
      phase: 'plan',
      taskIndex: 0,
      state,
      timestamp: new Date().toISOString(),
    } as WorkflowCheckpoint);

    console.log(`[pbvsWorkflow] PRD created: ${prd.projectName}`);

    // ========================================================================
    // PHASE 2: PARSE - Convert PRD to Tasks
    // ========================================================================
    console.log('[pbvsWorkflow] Phase 2: PARSE - Converting PRD to tasks...');
    state.status = 'parsing';
    state.updatedAt = new Date().toISOString();

    const tasks = await parsePRDIntoTasks(prd);
    state.tasks = tasks;
    state.totalTasks = tasks.length;

    // Calculate total estimated hours
    state.estimatedHours = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);

    await storeCheckpoint({
      projectId,
      phase: 'build',
      taskIndex: 0,
      state,
      timestamp: new Date().toISOString(),
    } as WorkflowCheckpoint);

    console.log(`[pbvsWorkflow] ${tasks.length} tasks created`);
    await sendNotification(`Project parsed: ${tasks.length} tasks, ${state.estimatedHours} estimated hours`);

    // ========================================================================
    // PHASE 3: BUILD - Execute All Tasks
    // ========================================================================
    console.log('[pbvsWorkflow] Phase 3: BUILD - Executing tasks...');
    state.currentPhase = 'build';
    state.status = 'building';
    state.updatedAt = new Date().toISOString();

    const buildResults: BuildResult[] = [];

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      // Handle pause
      while (isPaused) {
        await sleep('1 second');
      }

      console.log(`[pbvsWorkflow] Executing task ${i + 1}/${tasks.length}: ${task.description}`);

      try {
        const taskStartTime = Date.now();
        const output = await executeTask(task);

        // Record build result
        const buildResult: BuildResult = {
          taskId: task.id,
          output,
          completedAt: new Date().toISOString(),
          duration: Date.now() - taskStartTime,
        };
        buildResults.push(buildResult);

        // Update task and state
        task.status = output.status === 'complete' ? 'completed' : output.status as any;
        task.output = output;

        if (output.status === 'complete') {
          state.completedTasks.push(task.id);
          state.completedTasksCount++;
        } else if (output.status === 'failed') {
          state.failedTasks.push(task.id);
        } else if (output.status === 'blocked') {
          state.blockedTasks.push(task.id);
        }

        state.updatedAt = new Date().toISOString();

        // Checkpoint every 5 tasks
        if ((i + 1) % 5 === 0) {
          await storeCheckpoint({
            projectId,
            phase: 'build',
            taskIndex: i + 1,
            state,
            timestamp: new Date().toISOString(),
          } as WorkflowCheckpoint);
        }

        console.log(`[pbvsWorkflow] Task ${i + 1} completed: ${output.status}`);
      } catch (error: any) {
        console.error(`[pbvsWorkflow] Task ${i + 1} failed:`, error.message);
        task.status = 'failed';
        state.failedTasks.push(task.id);
        state.updatedAt = new Date().toISOString();

        // Continue with next task instead of failing entire workflow
        await sendNotification(`Task failed: ${task.description}\nError: ${error.message}`);
      }
    }

    state.buildResults = buildResults;
    console.log(`[pbvsWorkflow] BUILD phase complete: ${state.completedTasksCount}/${state.totalTasks} tasks succeeded`);

    // ========================================================================
    // PHASE 4: VALIDATE - Run Quality Gates
    // ========================================================================
    console.log('[pbvsWorkflow] Phase 4: VALIDATE - Running quality gates...');
    state.currentPhase = 'validate';
    state.status = 'validating';
    state.updatedAt = new Date().toISOString();

    const validationResults = await validateBuild();
    state.validationResults = validationResults;

    if (!validationResults.overallPassed) {
      console.warn('[pbvsWorkflow] Validation failed - manual intervention required');
      await sendNotification('Validation incomplete - requires manual review');

      // Don't fail workflow, just pause for review
      isPaused = true;
      while (isPaused) {
        await sleep('5 seconds');
      }
    }

    console.log('[pbvsWorkflow] VALIDATE phase complete');

    // ========================================================================
    // PHASE 5: SCALE - Deploy to Production
    // ========================================================================
    console.log('[pbvsWorkflow] Phase 5: SCALE - Deploying...');
    state.currentPhase = 'scale';
    state.status = 'scaling';
    state.updatedAt = new Date().toISOString();

    // Deploy to staging first
    const stagingDeployment = await deployToEnvironment('staging');
    console.log(`[pbvsWorkflow] Deployed to staging: ${stagingDeployment.url}`);
    await sendNotification(`Staging deployment successful: ${stagingDeployment.url}`);

    // Wait for approval before production
    console.log('[pbvsWorkflow] Waiting for production deployment approval...');
    isPaused = true;
    while (isPaused) {
      await sleep('5 seconds');
    }

    // Deploy to production
    const productionDeployment = await deployToEnvironment('production');
    state.deploymentResult = productionDeployment;

    console.log(`[pbvsWorkflow] Deployed to production: ${productionDeployment.url}`);
    await sendNotification(`Production deployment successful: ${productionDeployment.url}`);

    // ========================================================================
    // Complete Workflow
    // ========================================================================
    state.status = 'completed';
    state.updatedAt = new Date().toISOString();

    const endTime = Date.now();
    const totalDuration = endTime - startTime;

    // Calculate actual hours from build results
    const actualHours = buildResults.reduce((sum, result) => sum + result.duration, 0) / (1000 * 60 * 60);
    state.actualHours = actualHours;

    const result: PBVSResult = {
      projectId,
      status: state.failedTasks.length > 0 ? 'partially_completed' : 'completed',
      prd: state.prd!,
      tasks: state.tasks!,
      buildResults,
      validationResults,
      deploymentResult: state.deploymentResult,
      totalTasks: state.totalTasks,
      completedTasks: state.completedTasksCount,
      failedTasks: state.failedTasks.length,
      estimatedHours: state.estimatedHours,
      actualHours,
      startedAt: state.startedAt,
      completedAt: new Date().toISOString(),
      duration: totalDuration,
    };

    console.log('[pbvsWorkflow] Workflow completed successfully!');
    console.log(`  Total tasks: ${result.totalTasks}`);
    console.log(`  Completed: ${result.completedTasks}`);
    console.log(`  Failed: ${result.failedTasks}`);
    console.log(`  Duration: ${(totalDuration / 1000 / 60).toFixed(2)} minutes`);

    await sendNotification(
      `Project completed!\n` +
      `Tasks: ${result.completedTasks}/${result.totalTasks}\n` +
      `Duration: ${(totalDuration / 1000 / 60).toFixed(2)} minutes\n` +
      `Production URL: ${result.deploymentResult?.url}`
    );

    return result;
  } catch (error: any) {
    console.error('[pbvsWorkflow] Workflow failed:', error);
    state.status = 'failed';
    state.updatedAt = new Date().toISOString();

    await sendNotification(`Project failed: ${error.message}`);
    throw error;
  }
}
