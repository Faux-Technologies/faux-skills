/**
 * Install command
 * Installs faux-skills to the target directory
 */

import fs from 'fs';
import path from 'path';
import {
  log,
  logSuccess,
  logInfo,
  logWarning,
  logError,
  getSkillsDir,
  discoverSkills,
  copyDir,
  removeDir,
} from '../utils/helpers.js';

export async function install({ target, platform, skillsDir }) {
  log('\n  faux-skills install', 'bright');
  log('  Installing Figma design automation skills\n', 'dim');

  // Determine target directory
  const targetDir = target || getSkillsDir(platform);

  logInfo(`Target: ${targetDir}`);

  // Check source skills exist
  if (!fs.existsSync(skillsDir)) {
    logError(`Skills source not found: ${skillsDir}`);
    logInfo('Run this command from the faux-skills directory.');
    throw new Error('Skills source directory not found');
  }

  // Create target directory if needed
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    logInfo(`Created directory: ${targetDir}`);
  }

  // Discover available skills
  const availableSkills = discoverSkills(skillsDir);

  if (availableSkills.length === 0) {
    logWarning('No skills found in source directory.');
    logInfo(`Add skills to: ${skillsDir}`);
    logInfo('Each skill needs a SKILL.md file.');
    return;
  }

  // Install each skill
  const installed = [];
  const skipped = [];

  for (const skill of availableSkills) {
    const srcSkillDir = path.join(skillsDir, skill);
    const destSkillDir = path.join(targetDir, skill);

    // Check if skill source exists
    if (!fs.existsSync(srcSkillDir)) {
      logWarning(`Skill not found: ${skill}`);
      skipped.push(skill);
      continue;
    }

    // Check for SKILL.md
    const skillFile = path.join(srcSkillDir, 'SKILL.md');
    if (!fs.existsSync(skillFile)) {
      logWarning(`No SKILL.md found: ${skill}`);
      skipped.push(skill);
      continue;
    }

    // Remove existing if present
    if (fs.existsSync(destSkillDir)) {
      removeDir(destSkillDir);
    }

    // Copy skill directory
    copyDir(srcSkillDir, destSkillDir);
    installed.push(skill);
  }

  // Summary
  log('');
  if (installed.length > 0) {
    logSuccess(`Installed ${installed.length} skill${installed.length > 1 ? 's' : ''}:`);
    for (const skill of installed) {
      log(`    • ${skill}`, 'cyan');
    }
  }

  if (skipped.length > 0) {
    log('');
    logWarning(`Skipped ${skipped.length} skill${skipped.length > 1 ? 's' : ''}:`);
    for (const skill of skipped) {
      log(`    • ${skill}`, 'yellow');
    }
  }

  log('');
  logInfo(`Location: ${targetDir}`);
  log('');
  logSuccess('Installation complete!');
  log('');
  log('  Skills will be automatically discovered by your AI agent.', 'dim');
  log('  Invoke with /skill-name or describe your task naturally.\n', 'dim');
}
