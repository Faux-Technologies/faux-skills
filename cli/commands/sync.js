/**
 * Sync command
 * Syncs skills across all platform directories
 */

import fs from 'fs';
import path from 'path';
import {
  log,
  logSuccess,
  logInfo,
  logWarning,
  getAllPlatformDirs,
  discoverSkills,
  copyDir,
  removeDir,
} from '../utils/helpers.js';

export async function sync({ skillsDir }) {
  log('\n  faux-skills sync', 'bright');
  log('  Syncing skills across all platform directories\n', 'dim');

  // Check source skills exist
  if (!fs.existsSync(skillsDir)) {
    logWarning(`Skills source not found: ${skillsDir}`);
    logInfo('Run this command from the faux-skills directory.');
    return;
  }

  // Discover available skills
  const availableSkills = discoverSkills(skillsDir);

  if (availableSkills.length === 0) {
    logWarning('No skills found in source directory.');
    logInfo(`Add skills to: ${skillsDir}`);
    return;
  }

  const platforms = getAllPlatformDirs();
  const synced = [];

  for (const [platformName, dir] of Object.entries(platforms)) {
    // Skip if directory doesn't exist and parent doesn't exist
    const parentDir = path.dirname(dir);
    if (!fs.existsSync(parentDir)) {
      logInfo(`Skipping ${platformName} (parent directory doesn't exist)`);
      continue;
    }

    // Create skills directory if needed
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Sync each skill
    let count = 0;
    for (const skill of availableSkills) {
      const srcSkillDir = path.join(skillsDir, skill);
      const destSkillDir = path.join(dir, skill);

      // Remove existing and copy fresh
      if (fs.existsSync(destSkillDir)) {
        removeDir(destSkillDir);
      }
      copyDir(srcSkillDir, destSkillDir);
      count++;
    }

    if (count > 0) {
      synced.push({ platform: platformName, dir, count });
    }
  }

  // Summary
  log('');
  if (synced.length > 0) {
    logSuccess(`Synced to ${synced.length} platform${synced.length > 1 ? 's' : ''}:`);
    log('');
    for (const { platform, dir, count } of synced) {
      log(`    ${platform}`, 'cyan');
      log(`    ${dir}`, 'dim');
      log(`    ${count} skill${count > 1 ? 's' : ''}`, 'dim');
      log('');
    }
  } else {
    logWarning('No platform directories found to sync.');
    log('');
    logInfo('Create at least one of:');
    for (const [name, dir] of Object.entries(platforms)) {
      log(`    ${name}: ${path.dirname(dir)}`, 'dim');
    }
  }

  log('');
  logSuccess('Sync complete!\n');
}
