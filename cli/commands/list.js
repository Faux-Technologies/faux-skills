/**
 * List command
 * Lists installed faux-skills
 */

import fs from 'fs';
import path from 'path';
import {
  log,
  logInfo,
  logWarning,
  getSkillsDir,
  getAllPlatformDirs,
  discoverSkills,
  parseSkillFrontmatter,
} from '../utils/helpers.js';

export async function list({ target, platform }) {
  log('\n  faux-skills list', 'bright');
  log('  Installed Figma design automation skills\n', 'dim');

  // If target specified, only check that directory
  if (target) {
    listSkillsInDir(target, 'custom');
    return;
  }

  // If platform specified, check that platform
  if (platform) {
    const dir = getSkillsDir(platform);
    listSkillsInDir(dir, platform);
    return;
  }

  // Otherwise, check all platforms
  const platforms = getAllPlatformDirs();
  let foundAny = false;

  for (const [platformName, dir] of Object.entries(platforms)) {
    if (fs.existsSync(dir)) {
      const found = listSkillsInDir(dir, platformName);
      if (found) foundAny = true;
    }
  }

  if (!foundAny) {
    logWarning('No faux-skills found in any platform directory.');
    log('');
    logInfo('Install with: faux-skills install');
    log('');
  }
}

function listSkillsInDir(dir, platformName) {
  if (!fs.existsSync(dir)) {
    return false;
  }

  // Discover installed skills
  const skillNames = discoverSkills(dir);
  const installed = [];

  for (const skill of skillNames) {
    const skillPath = path.join(dir, skill, 'SKILL.md');
    try {
      const content = fs.readFileSync(skillPath, 'utf-8');
      const frontmatter = parseSkillFrontmatter(content);

      installed.push({
        id: skill,
        name: frontmatter?.name || skill,
        description: extractFirstLine(frontmatter?.description),
      });
    } catch {
      installed.push({
        id: skill,
        name: skill,
        description: '',
      });
    }
  }

  if (installed.length === 0) {
    return false;
  }

  log(`  ${platformName}`, 'bright');
  log(`  ${dir}`, 'dim');
  log('');

  for (const skill of installed) {
    log(`    ${skill.name}`, 'cyan');
    if (skill.description) {
      log(`    ${skill.description}`, 'dim');
    }
    log('');
  }

  return true;
}

function extractFirstLine(description) {
  if (!description) return '';
  const lines = description.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('Use when')) {
      return trimmed;
    }
  }
  return '';
}
