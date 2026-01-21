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
  log('    uninstall                  Remove installed skills');
  log('    list                       List installed skills');
  log('    validate [path]            Validate skill files');
  log('    sync                       Sync skills across platforms\n');

  log('  Options:', 'bright');
  log('    --target, -t <dir>   Target directory for installation');
  log('    --platform, -p       Target platform (claude-code, codex, universal)');
  log('    --help, -h           Show this help message');
  log('    --version, -v        Show version number\n');

  log('  Default install locations:', 'bright');
  log('    Claude Code:  ~/.claude/skills/', 'dim');
  log('    Codex:        ~/.codex/skills/', 'dim');
  log('    Universal:    ~/.agent/skills/\n', 'dim');

  log('  Examples:', 'bright');
  log('    faux-skills install', 'cyan');
  log('    faux-skills install --target ~/.agent/skills', 'cyan');
  log('    faux-skills list', 'cyan');
  log('    faux-skills validate skills/figma-design-system\n', 'cyan');

  log('  More info: https://github.com/faux-technologies/faux-skills\n', 'dim');
}

function showVersion() {
  const packageJson = JSON.parse(
    await import('fs').then(fs =>
      fs.promises.readFile(path.join(__dirname, '..', 'package.json'), 'utf-8')
    )
  );
  log(`faux-skills v${packageJson.version}`);
}

function parseArgs(args) {
  const parsed = {
    command: null,
    target: null,
    platform: null,
    path: null,
    help: false,
    version: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg === '--version' || arg === '-v') {
      parsed.version = true;
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
