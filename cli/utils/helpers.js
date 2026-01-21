/**
 * CLI utility helpers
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

// ANSI colors
export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

export function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

export function logSuccess(message) {
  log(`  ✓ ${message}`, 'green');
}

export function logInfo(message) {
  log(`  ℹ ${message}`, 'blue');
}

export function logWarning(message) {
  log(`  ⚠ ${message}`, 'yellow');
}

export function logError(message) {
  log(`  ✗ ${message}`, 'red');
}

/**
 * Get platform-specific skills directory
 */
export function getSkillsDir(platform) {
  const home = os.homedir();

  switch (platform) {
    case 'claude-code':
      return path.join(home, '.claude', 'skills');
    case 'codex':
      return path.join(home, '.codex', 'skills');
    case 'universal':
      return path.join(home, '.agent', 'skills');
    default:
      // Auto-detect: prefer Claude Code if .claude exists
      if (fs.existsSync(path.join(home, '.claude'))) {
        return path.join(home, '.claude', 'skills');
      }
      if (fs.existsSync(path.join(home, '.codex'))) {
        return path.join(home, '.codex', 'skills');
      }
      // Default to Claude Code
      return path.join(home, '.claude', 'skills');
  }
}

/**
 * Discover skills in a directory
 * A valid skill has a SKILL.md file
 */
export function discoverSkills(skillsDir) {
  if (!fs.existsSync(skillsDir)) {
    return [];
  }

  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  const skills = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('.')) continue;

    const skillFile = path.join(skillsDir, entry.name, 'SKILL.md');
    if (fs.existsSync(skillFile)) {
      skills.push(entry.name);
    }
  }

  return skills;
}

/**
 * Recursively copy directory
 */
export function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Recursively remove directory
 */
export function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Parse SKILL.md frontmatter
 */
export function parseSkillFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const result = {};

  // Simple YAML parser for frontmatter
  const lines = yaml.split('\n');
  let currentKey = null;
  let inMultiline = false;
  let multilineValue = [];

  for (const line of lines) {
    // Skip comments
    if (line.trim().startsWith('#')) continue;

    // Check for multiline value indicator
    if (line.match(/^(\w[\w-]*):\s*\|$/)) {
      currentKey = line.match(/^(\w[\w-]*)/)[1];
      inMultiline = true;
      multilineValue = [];
      continue;
    }

    // Check for key-value pair
    const kvMatch = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kvMatch && !inMultiline) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();
      if (value) {
        result[currentKey] = value;
      }
      continue;
    }

    // Handle multiline content
    if (inMultiline) {
      if (line.match(/^\s{2}/) || line.trim() === '') {
        multilineValue.push(line.replace(/^\s{2}/, ''));
      } else {
        // End of multiline
        result[currentKey] = multilineValue.join('\n').trim();
        inMultiline = false;

        // Process this line as a new key
        const newKvMatch = line.match(/^(\w[\w-]*):\s*(.*)$/);
        if (newKvMatch) {
          currentKey = newKvMatch[1];
          const value = newKvMatch[2].trim();
          if (value) {
            result[currentKey] = value;
          }
        }
      }
    }
  }

  // Handle any remaining multiline
  if (inMultiline && multilineValue.length > 0) {
    result[currentKey] = multilineValue.join('\n').trim();
  }

  return result;
}

/**
 * Get all platform directories
 */
export function getAllPlatformDirs() {
  const home = os.homedir();
  return {
    'claude-code': path.join(home, '.claude', 'skills'),
    'codex': path.join(home, '.codex', 'skills'),
    'universal': path.join(home, '.agent', 'skills'),
  };
}
