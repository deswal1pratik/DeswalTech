/**
 * DeswalTech v4.1 - Type-Safe Schema Library
 *
 * Central export file for all Zod schemas used across the Nexus AI Team.
 * Ensures type safety and validation for all agent outputs.
 *
 * @module schemas
 * @version 4.1.0
 */

// Task Output Schemas
export {
  TaskOutputSchema,
  TaskStatus,
  ErrorDetailsSchema,
  createSuccessOutput,
  createBlockedOutput,
  createFailedOutput,
  type TaskOutput,
  type ErrorDetails,
} from './task-output.schema';

// PRD Schemas
export {
  PRDSchema,
  CapabilitySchema,
  FeatureSchema,
  NonFunctionalRequirementsSchema,
  TechnologyStackSchema,
  PhaseEnum,
  ComplexityEnum,
  PriorityEnum,
  validatePRD,
  extractFeaturesInOrder,
  calculateTotalHours,
  getFeaturesByPhase,
  type PRD,
  type Capability,
  type Feature,
  type NonFunctionalRequirements,
  type TechnologyStack,
} from './prd-output.schema';
