#!/usr/bin/env node

/**
 * faux-skills CLI
 *
 * Universal AI agent skills installer for Figma design automation.
 * Works with Claude Code, Codex, Cursor, Windsurf, and OpenSkills.
 */

import { fileURLToPath } from 'url';
import path from 'path';
import { install } from './commands/install.js';
import { uninstall } from './commands/uninstall.js';
import { list } from './commands/list.js';
import { validate } from './commands/validate.js';
import { sync } from './commands/sync.js';
import { bundle } from './commands/bundle.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors
const colors = {
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

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function showHelp() {
  log('\n  faux-skills', 'bright');
  log('  Universal AI agent skills for Figma design automation\n', 'dim');

  log('  Usage:', 'bright');
  log('    faux-skills <command> [options]\n');

  log('  Commands:', 'bright');
  log('    install [--target <dir>]   Install skills to target directory');
  log('    bundle --target <dir>      Sync skills to app bundle (with manifest)');
  log('    uninstall                  Remove installed skills');
  log('    list                       List installed skills');
  log('    validate [path]            Validate skill files');
  log('    sync                       Sync skills across platforms\n');

  log('  Options:', 'bright');
  log('    --target, -t <dir>   Target directory for installation');
  log('    --platform, -p       Target platform (claude-code, codex, universal)');
  log('    --force, -f          Force update even if unchanged (bundle command)');
  log('    --help, -h           Show this help message');
  log('    --version, -v        Show version number\n');

  log('  Default install locations:', 'bright');
  log('    Claude Code:  ~/.claude/skills/', 'dim');
  log('    Codex:        ~/.codex/skills/', 'dim');
  log('    Universal:    ~/.agent/skills/\n', 'dim');

  log('  Examples:', 'bright');
  log('    faux-skills install', 'cyan');
  log('    faux-skills install --target ~/.agent/skills', 'cyan');
  log('    faux-skills bundle --target ./App/Resources/skills', 'cyan');
  log('    faux-skills bundle --target ./App/Resources/skills --force', 'cyan');
  log('    faux-skills list', 'cyan');
  log('    faux-skills validate skills/figma-design-system\n', 'cyan');

  log('  More info: https://github.com/faux-technologies/faux-skills\n', 'dim');
}

async function showVersion() {
  const fs = await import('fs');
  const content = await fs.promises.readFile(path.join(__dirname, '..', 'package.json'), 'utf-8');
  const packageJson = JSON.parse(content);
  log(`faux-skills v${packageJson.version}`);
}

function parseArgs(args) {
  const parsed = {
    command: null,
    target: null,
    platform: null,
    path: null,
    force: false,
    help: false,
    version: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg === '--version' || arg === '-v') {
      parsed.version = true;
    } else if (arg === '--force' || arg === '-f') {
      parsed.force = true;
    } else if (arg === '--target' || arg === '-t') {
      parsed.target = args[++i];
    } else if (arg === '--platform' || arg === '-p') {
      parsed.platform = args[++i];
    } else if (!arg.startsWith('-')) {
      if (!parsed.command) {
        parsed.command = arg;
      } else {
        parsed.path = arg;
      }
    }
  }

  return parsed;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || (!args.command && !args.version)) {
    showHelp();
    process.exit(0);
  }

  if (args.version) {
    await showVersion();
    process.exit(0);
  }

  const skillsDir = path.join(__dirname, '..', 'skills');

  try {
    switch (args.command) {
      case 'install':
        await install({ target: args.target, platform: args.platform, skillsDir });
        break;

      case 'bundle':
        await bundle({ target: args.target, skillsDir, force: args.force });
        break;

      case 'uninstall':
        await uninstall({ target: args.target, platform: args.platform });
        break;

      case 'list':
        await list({ target: args.target, platform: args.platform });
        break;

      case 'validate':
        await validate({ path: args.path || skillsDir });
        break;

      case 'sync':
        await sync({ skillsDir });
        break;

      default:
        log(`\n  Unknown command: ${args.command}`, 'red');
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    log(`\n  Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
