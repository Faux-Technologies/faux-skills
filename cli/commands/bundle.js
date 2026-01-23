/**
 * Bundle command
 * Syncs faux-skills to an app bundle's Resources directory
 *
 * Features:
 * - Writes manifest file to track managed skills
 * - Version-aware: only updates if version changed
 * - Non-destructive: preserves user-added skills
 * - Idempotent: safe to run multiple times
 */

import fs from 'fs';
import path from 'path';
import {
  log,
  logSuccess,
  logInfo,
  logWarning,
  logError,
  discoverSkills,
  copyDir,
  removeDir,
  parseSkillFrontmatter,
} from '../utils/helpers.js';

const MANIFEST_FILE = '.faux-skills-manifest.json';

/**
 * Read manifest from target directory
 */
function readManifest(targetDir) {
  const manifestPath = path.join(targetDir, MANIFEST_FILE);
  if (fs.existsSync(manifestPath)) {
    try {
      return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    } catch (e) {
      logWarning(`Could not parse manifest: ${e.message}`);
    }
  }
  return { skills: {}, lastSync: null };
}

/**
 * Write manifest to target directory
 */
function writeManifest(targetDir, manifest) {
  const manifestPath = path.join(targetDir, MANIFEST_FILE);
  manifest.lastSync = new Date().toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

/**
 * Get skill metadata from SKILL.md
 */
function getSkillMetadata(skillDir) {
  const skillFile = path.join(skillDir, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    return null;
  }

  const content = fs.readFileSync(skillFile, 'utf-8');
  const frontmatter = parseSkillFrontmatter(content);

  // Extract version from metadata section
  const versionMatch = content.match(/version:\s*([\d.]+)/);
  const version = versionMatch ? versionMatch[1] : '0.0.0';

  // Get file hash for change detection
  const hash = simpleHash(content);

  return {
    name: frontmatter?.name || path.basename(skillDir),
    version,
    hash,
  };
}

/**
 * Simple hash for change detection
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

export async function bundle({ target, skillsDir, force = false }) {
  log('\n  faux-skills bundle', 'bright');
  log('  Syncing skills to app bundle\n', 'dim');

  // Validate target
  if (!target) {
    logError('Target directory is required.');
    logInfo('Usage: faux-skills bundle --target /path/to/App/Resources/skills');
    throw new Error('Missing target directory');
  }

  logInfo(`Source: ${skillsDir}`);
  logInfo(`Target: ${target}`);

  // Check source exists
  if (!fs.existsSync(skillsDir)) {
    logError(`Skills source not found: ${skillsDir}`);
    throw new Error('Skills source directory not found');
  }

  // Create target directory if needed
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
    logInfo(`Created directory: ${target}`);
  }

  // Read existing manifest
  const manifest = readManifest(target);
  const previousSkills = manifest.skills || {};

  // Discover available skills
  const availableSkills = discoverSkills(skillsDir);

  if (availableSkills.length === 0) {
    logWarning('No skills found in source directory.');
    return;
  }

  // Process each skill
  const results = {
    installed: [],
    updated: [],
    skipped: [],
    unchanged: [],
  };

  const newManifest = { skills: {}, lastSync: null };

  for (const skillName of availableSkills) {
    const srcSkillDir = path.join(skillsDir, skillName);
    const destSkillDir = path.join(target, skillName);

    // Get source metadata
    const srcMeta = getSkillMetadata(srcSkillDir);
    if (!srcMeta) {
      logWarning(`No valid SKILL.md found: ${skillName}`);
      results.skipped.push(skillName);
      continue;
    }

    // Check if update is needed
    const prevMeta = previousSkills[skillName];
    const needsUpdate = force || !prevMeta || prevMeta.hash !== srcMeta.hash;

    if (!needsUpdate) {
      results.unchanged.push(skillName);
      newManifest.skills[skillName] = prevMeta;
      continue;
    }

    // Remove existing if present
    if (fs.existsSync(destSkillDir)) {
      removeDir(destSkillDir);
      results.updated.push(skillName);
    } else {
      results.installed.push(skillName);
    }

    // Copy skill directory
    copyDir(srcSkillDir, destSkillDir);

    // Record in manifest
    newManifest.skills[skillName] = {
      version: srcMeta.version,
      hash: srcMeta.hash,
      installedAt: new Date().toISOString(),
    };
  }

  // Write updated manifest
  writeManifest(target, newManifest);

  // Summary
  log('');

  if (results.installed.length > 0) {
    logSuccess(`Installed ${results.installed.length} new skill(s):`);
    for (const skill of results.installed) {
      log(`    + ${skill}`, 'green');
    }
  }

  if (results.updated.length > 0) {
    logSuccess(`Updated ${results.updated.length} skill(s):`);
    for (const skill of results.updated) {
      log(`    ↻ ${skill}`, 'cyan');
    }
  }

  if (results.unchanged.length > 0) {
    logInfo(`Unchanged ${results.unchanged.length} skill(s):`);
    for (const skill of results.unchanged) {
      log(`    • ${skill}`, 'dim');
    }
  }

  if (results.skipped.length > 0) {
    logWarning(`Skipped ${results.skipped.length} skill(s):`);
    for (const skill of results.skipped) {
      log(`    ⚠ ${skill}`, 'yellow');
    }
  }

  log('');
  logInfo(`Manifest: ${path.join(target, MANIFEST_FILE)}`);
  log('');

  const totalChanges = results.installed.length + results.updated.length;
  if (totalChanges > 0) {
    logSuccess(`Bundle updated with ${totalChanges} change(s).`);
    log('');
    log('  Rebuild your app to include the updated skills.', 'dim');
  } else {
    logSuccess('Bundle is up to date.');
  }

  log('');
}
