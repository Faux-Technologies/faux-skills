/**
 * Validate command
 * Validates skill files for correctness
 */

import fs from 'fs';
import path from 'path';
import {
  log,
  logSuccess,
  logInfo,
  logWarning,
  logError,
  parseSkillFrontmatter,
} from '../utils/helpers.js';

export async function validate({ path: targetPath }) {
  log('\n  faux-skills validate', 'bright');
  log('  Validating skill files\n', 'dim');

  // Check if path is a directory or file
  const stat = fs.statSync(targetPath);

  if (stat.isFile()) {
    await validateSkillFile(targetPath);
  } else if (stat.isDirectory()) {
    await validateSkillsDir(targetPath);
  } else {
    throw new Error(`Invalid path: ${targetPath}`);
  }
}

async function validateSkillsDir(dir) {
  logInfo(`Scanning: ${dir}`);
  log('');

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let total = 0;
  let passed = 0;
  let failed = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillFile = path.join(dir, entry.name, 'SKILL.md');
    if (fs.existsSync(skillFile)) {
      total++;
      const result = await validateSkillFile(skillFile, entry.name);
      if (result) {
        passed++;
      } else {
        failed++;
      }
    }
  }

  // Summary
  log('');
  log('  Summary', 'bright');
  log(`    Total:  ${total}`, 'dim');
  logSuccess(`Passed: ${passed}`);
  if (failed > 0) {
    logError(`Failed: ${failed}`);
  }
  log('');
}

async function validateSkillFile(filePath, skillName = null) {
  const name = skillName || path.basename(path.dirname(filePath));

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const errors = [];
    const warnings = [];

    // Check for frontmatter
    if (!content.startsWith('---')) {
      errors.push('Missing YAML frontmatter (must start with ---)');
    }

    // Parse frontmatter
    const frontmatter = parseSkillFrontmatter(content);

    if (!frontmatter) {
      errors.push('Could not parse YAML frontmatter');
    } else {
      // Required fields
      if (!frontmatter.name) {
        errors.push('Missing required field: name');
      }
      if (!frontmatter.description) {
        errors.push('Missing required field: description');
      }

      // Recommended fields
      if (!frontmatter['allowed-tools'] && !frontmatter.allowedTools) {
        warnings.push('Missing allowed-tools (recommended for Claude Code)');
      }

      // Check description quality
      if (frontmatter.description) {
        if (!frontmatter.description.includes('Use when')) {
          warnings.push('Description should include "Use when user mentions:" section');
        }
      }
    }

    // Check markdown body
    const bodyMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
    if (!bodyMatch || !bodyMatch[1].trim()) {
      warnings.push('Empty markdown body');
    }

    // Output results
    if (errors.length === 0 && warnings.length === 0) {
      logSuccess(`${name}`);
      return true;
    }

    if (errors.length > 0) {
      logError(`${name}`);
      for (const error of errors) {
        log(`      ✗ ${error}`, 'red');
      }
    } else {
      logWarning(`${name}`);
    }

    for (const warning of warnings) {
      log(`      ⚠ ${warning}`, 'yellow');
    }

    return errors.length === 0;
  } catch (error) {
    logError(`${name}: ${error.message}`);
    return false;
  }
}
