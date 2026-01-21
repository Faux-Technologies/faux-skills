/**
 * Uninstall command
 * Removes faux-skills from the target directory
 */

import fs from 'fs';
import path from 'path';
import {
  log,
  logSuccess,
  logInfo,
  logWarning,
  getSkillsDir,
  discoverSkills,
  removeDir,
} from '../utils/helpers.js';

export async function uninstall({ target, platform }) {
  log('\n  faux-skills uninstall', 'bright');
  log('  Removing Figma design automation skills\n', 'dim');

  // Determine target directory
  const targetDir = target || getSkillsDir(platform);

  logInfo(`Target: ${targetDir}`);

  if (!fs.existsSync(targetDir)) {
    logWarning('Skills directory not found. Nothing to uninstall.');
    return;
  }

  // Discover installed skills
  const installedSkills = discoverSkills(targetDir);

  // Remove each skill
  const removed = [];

  for (const skill of installedSkills) {
    const skillDir = path.join(targetDir, skill);
    removeDir(skillDir);
    removed.push(skill);
  }

  // Summary
  log('');
  if (removed.length > 0) {
    logSuccess(`Removed ${removed.length} skill${removed.length > 1 ? 's' : ''}:`);
    for (const skill of removed) {
      log(`    • ${skill}`, 'cyan');
    }
  } else {
    logWarning('No faux-skills found to remove.');
  }

  log('');
  logSuccess('Uninstallation complete!\n');
}
