/**
 * Skill Quality & Conflict Prevention System
 *
 * Ensures all agent skills maintain highest quality standards,
 * prevents conflicts, and validates compliance with Agent Skills API.
 *
 * @version 4.1.0
 */

import fs from 'fs';
import path from 'path';
import { z } from 'zod';

/**
 * Skill YAML Frontmatter Schema
 */
const SkillFrontmatterSchema = z.object({
  name: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Skill name must be lowercase with hyphens only'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semantic (e.g., 1.0.0)').optional(),
  author: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
});

type SkillFrontmatter = z.infer<typeof SkillFrontmatterSchema>;

/**
 * Skill validation result
 */
interface SkillValidationResult {
  skillPath: string;
  skillName: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
  quality: {
    hasExamples: boolean;
    hasProcessSection: boolean;
    hasOutputFormat: boolean;
    documentationScore: number; // 0-100
  };
}

/**
 * Skill conflict detection result
 */
interface SkillConflict {
  type: 'duplicate-name' | 'similar-purpose' | 'dependency-missing';
  severity: 'error' | 'warning';
  skill1: string;
  skill2?: string;
  message: string;
}

/**
 * Skill registry
 */
interface SkillRegistry {
  skills: Map<string, SkillInfo>;
  conflicts: SkillConflict[];
  totalSkills: number;
  validSkills: number;
  invalidSkills: number;
}

interface SkillInfo {
  name: string;
  description: string;
  path: string;
  category: string; // 'core' | 'workflow'
  frontmatter: SkillFrontmatter;
  contentLength: number;
}

/**
 * Validate a single skill file
 */
export async function validateSkill(skillPath: string): Promise<SkillValidationResult> {
  const result: SkillValidationResult = {
    skillPath,
    skillName: path.basename(path.dirname(skillPath)),
    valid: true,
    errors: [],
    warnings: [],
    quality: {
      hasExamples: false,
      hasProcessSection: false,
      hasOutputFormat: false,
      documentationScore: 0,
    },
  };

  try {
    // 1. Check file exists
    if (!fs.existsSync(skillPath)) {
      result.valid = false;
      result.errors.push(`Skill file does not exist: ${skillPath}`);
      return result;
    }

    // 2. Read file content
    const content = fs.readFileSync(skillPath, 'utf-8');

    // 3. Validate YAML frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      result.valid = false;
      result.errors.push('Missing YAML frontmatter (must start with --- and end with ---)');
      return result;
    }

    // 4. Parse YAML frontmatter
    const yamlContent = frontmatterMatch[1];
    const frontmatter: any = {};

    yamlContent.split('\n').forEach((line) => {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        frontmatter[match[1]] = match[2].trim();
      }
    });

    // 5. Validate frontmatter schema
    try {
      SkillFrontmatterSchema.parse(frontmatter);
    } catch (error: any) {
      result.valid = false;
      result.errors.push(`Invalid frontmatter: ${error.message}`);
      return result;
    }

    // 6. Check skill name matches directory
    const expectedName = path.basename(path.dirname(skillPath));
    if (frontmatter.name !== expectedName) {
      result.warnings.push(
        `Skill name "${frontmatter.name}" does not match directory "${expectedName}"`
      );
    }

    // 7. Quality checks
    result.quality.hasProcessSection = content.includes('## Process') || content.includes('## Goal');
    result.quality.hasOutputFormat = content.includes('## Output Format') || content.includes('```');
    result.quality.hasExamples = content.includes('## Example') || content.includes('###');

    // 8. Calculate documentation score
    let score = 0;
    if (frontmatter.description.length > 50) score += 20;
    if (result.quality.hasProcessSection) score += 30;
    if (result.quality.hasOutputFormat) score += 30;
    if (result.quality.hasExamples) score += 20;
    result.quality.documentationScore = score;

    // 9. Quality warnings
    if (score < 70) {
      result.warnings.push(
        `Low documentation quality score: ${score}/100 (recommended: 80+)`
      );
    }

    if (!result.quality.hasProcessSection) {
      result.warnings.push('Missing "## Process" or "## Goal" section');
    }

    if (!result.quality.hasOutputFormat) {
      result.warnings.push('Missing "## Output Format" section with examples');
    }

    if (content.length < 500) {
      result.warnings.push('Skill documentation is very short (<500 characters)');
    }

  } catch (error: any) {
    result.valid = false;
    result.errors.push(`Unexpected error: ${error.message}`);
  }

  return result;
}

/**
 * Discover all skills in the skills directory
 */
export async function discoverSkills(skillsDir: string): Promise<SkillRegistry> {
  const registry: SkillRegistry = {
    skills: new Map(),
    conflicts: [],
    totalSkills: 0,
    validSkills: 0,
    invalidSkills: 0,
  };

  console.log(`[SkillValidator] Discovering skills in ${skillsDir}...`);

  // Scan for SKILL.md files
  const categories = ['core', 'workflow'];

  for (const category of categories) {
    const categoryPath = path.join(skillsDir, category);

    if (!fs.existsSync(categoryPath)) {
      console.warn(`[SkillValidator] Category directory not found: ${categoryPath}`);
      continue;
    }

    const skillDirs = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const skillDir of skillDirs) {
      const skillPath = path.join(categoryPath, skillDir, 'SKILL.md');

      if (!fs.existsSync(skillPath)) {
        console.warn(`[SkillValidator] SKILL.md not found in ${skillDir}`);
        continue;
      }

      registry.totalSkills++;

      // Validate skill
      const validation = await validateSkill(skillPath);

      if (validation.valid) {
        registry.validSkills++;

        // Read skill info
        const content = fs.readFileSync(skillPath, 'utf-8');
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        const frontmatter: any = {};

        if (frontmatterMatch) {
          frontmatterMatch[1].split('\n').forEach((line) => {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
              frontmatter[match[1]] = match[2].trim();
            }
          });
        }

        const skillInfo: SkillInfo = {
          name: frontmatter.name || skillDir,
          description: frontmatter.description || '',
          path: skillPath,
          category,
          frontmatter,
          contentLength: content.length,
        };

        registry.skills.set(skillInfo.name, skillInfo);
      } else {
        registry.invalidSkills++;
        console.error(`[SkillValidator] Invalid skill: ${skillPath}`);
        validation.errors.forEach(err => console.error(`  ❌ ${err}`));
      }

      // Show warnings
      if (validation.warnings.length > 0) {
        console.warn(`[SkillValidator] Warnings for ${validation.skillName}:`);
        validation.warnings.forEach(warn => console.warn(`  ⚠️  ${warn}`));
      }
    }
  }

  // Detect conflicts
  registry.conflicts = detectConflicts(registry);

  return registry;
}

/**
 * Detect skill conflicts
 */
function detectConflicts(registry: SkillRegistry): SkillConflict[] {
  const conflicts: SkillConflict[] = [];
  const skills = Array.from(registry.skills.values());

  // 1. Check for duplicate names
  const nameCount = new Map<string, number>();
  skills.forEach(skill => {
    nameCount.set(skill.name, (nameCount.get(skill.name) || 0) + 1);
  });

  nameCount.forEach((count, name) => {
    if (count > 1) {
      conflicts.push({
        type: 'duplicate-name',
        severity: 'error',
        skill1: name,
        message: `Duplicate skill name "${name}" found ${count} times`,
      });
    }
  });

  // 2. Check for similar purposes (same words in description)
  for (let i = 0; i < skills.length; i++) {
    for (let j = i + 1; j < skills.length; j++) {
      const skill1 = skills[i];
      const skill2 = skills[j];

      const words1 = new Set(skill1.description.toLowerCase().split(/\s+/));
      const words2 = new Set(skill2.description.toLowerCase().split(/\s+/));

      const commonWords = [...words1].filter(w => words2.has(w) && w.length > 4);

      if (commonWords.length >= 3) {
        conflicts.push({
          type: 'similar-purpose',
          severity: 'warning',
          skill1: skill1.name,
          skill2: skill2.name,
          message: `Skills "${skill1.name}" and "${skill2.name}" have similar purposes (common words: ${commonWords.join(', ')})`,
        });
      }
    }
  }

  // 3. Check for missing dependencies
  skills.forEach(skill => {
    const deps = skill.frontmatter.dependencies || [];
    deps.forEach(dep => {
      if (!registry.skills.has(dep)) {
        conflicts.push({
          type: 'dependency-missing',
          severity: 'error',
          skill1: skill.name,
          skill2: dep,
          message: `Skill "${skill.name}" depends on "${dep}" which does not exist`,
        });
      }
    });
  });

  return conflicts;
}

/**
 * Print skill registry report
 */
export function printSkillReport(registry: SkillRegistry): void {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🔍 SKILL QUALITY & CONFLICT PREVENTION REPORT');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log(`📊 Summary:`);
  console.log(`  Total Skills: ${registry.totalSkills}`);
  console.log(`  Valid: ${registry.validSkills} ✅`);
  console.log(`  Invalid: ${registry.invalidSkills} ❌`);
  console.log(`  Conflicts: ${registry.conflicts.length}\n`);

  // List skills
  console.log('📋 Discovered Skills:\n');
  const categories = new Map<string, SkillInfo[]>();

  registry.skills.forEach(skill => {
    if (!categories.has(skill.category)) {
      categories.set(skill.category, []);
    }
    categories.get(skill.category)!.push(skill);
  });

  categories.forEach((skills, category) => {
    console.log(`  ${category.toUpperCase()}:`);
    skills.forEach(skill => {
      console.log(`    ✅ ${skill.name}`);
      console.log(`       ${skill.description}`);
      console.log(`       Path: ${skill.path}`);
    });
    console.log('');
  });

  // Show conflicts
  if (registry.conflicts.length > 0) {
    console.log('⚠️  CONFLICTS DETECTED:\n');

    const errors = registry.conflicts.filter(c => c.severity === 'error');
    const warnings = registry.conflicts.filter(c => c.severity === 'warning');

    if (errors.length > 0) {
      console.log('  ERRORS (must fix):');
      errors.forEach(conflict => {
        console.log(`    ❌ ${conflict.message}`);
      });
      console.log('');
    }

    if (warnings.length > 0) {
      console.log('  WARNINGS (review recommended):');
      warnings.forEach(conflict => {
        console.log(`    ⚠️  ${conflict.message}`);
      });
      console.log('');
    }
  } else {
    console.log('✅ No conflicts detected!\n');
  }

  console.log('═══════════════════════════════════════════════════════════\n');
}

/**
 * Main execution
 */
async function main() {
  const skillsDir = path.join(__dirname, 'nexus-ai-team', 'skills');

  console.log('🔍 Starting Skill Quality & Conflict Prevention System...\n');

  const registry = await discoverSkills(skillsDir);
  printSkillReport(registry);

  // Exit with error if conflicts found
  const criticalConflicts = registry.conflicts.filter(c => c.severity === 'error');
  if (criticalConflicts.length > 0) {
    console.error('❌ Critical conflicts found. Please resolve before proceeding.\n');
    process.exit(1);
  }

  if (registry.invalidSkills > 0) {
    console.error('❌ Invalid skills found. Please fix before proceeding.\n');
    process.exit(1);
  }

  console.log('✅ All skills validated successfully!\n');
  process.exit(0);
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
