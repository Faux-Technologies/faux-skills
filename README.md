# faux-skills

Universal AI agent skills for Figma design automation. Works with **Claude Code**, **Codex**, **Cursor**, **Windsurf**, and any platform supporting the [Agent Skills Specification](https://github.com/anthropics/agent-skills).

## What are Skills?

Skills are reusable instruction sets that teach AI agents how to perform specialized tasks. Each skill is a `SKILL.md` file containing:

- **YAML frontmatter**: Metadata, triggers, and tool permissions
- **Markdown body**: Detailed instructions for the agent
- **References folder**: Additional context files (optional)

## Skills Included

| Skill | Description |
|-------|-------------|
| `figma-design-system` | Create and manage design tokens, variables, and styles |
| `figma-component-builder` | Build production-ready components with properties and variants |
| `web-to-figma` | Extract web components and recreate them in Figma |
| `figma-icon-library` | Create icon components from Iconify's 275,000+ icons |

## Installation

### Quick Install (Recommended)

```bash
npx faux-skills install
```

This installs skills to `~/.claude/skills/` (Claude Code) or `~/.codex/skills/` (Codex).

### With OpenSkills (Universal)

```bash
# Install openskills globally
npm install -g openskills

# Install faux-skills
npx faux-skills install --target ~/.agent/skills

# Load into your AI tool
openskills load --from ~/.agent/skills
```

### Manual Installation

```bash
# Clone the repo
git clone https://github.com/faux-technologies/faux-skills.git

# Copy skills to your platform's directory
cp -r faux-skills/skills/* ~/.claude/skills/     # Claude Code
cp -r faux-skills/skills/* ~/.codex/skills/      # Codex
cp -r faux-skills/skills/* ~/.agent/skills/      # Universal
```

## Usage

### CLI Commands

```bash
# Install skills to default location
faux-skills install

# Install to specific directory
faux-skills install --target ~/.agent/skills

# List installed skills
faux-skills list

# Uninstall skills
faux-skills uninstall

# Validate skill files
faux-skills validate

# Sync skills across platforms
faux-skills sync
```

### In Your AI Agent

Once installed, skills are automatically discovered. Invoke them by:

1. **Natural language**: "Create a button component with size variants"
2. **Direct invocation**: `/figma-component-builder`
3. **Trigger phrases**: "design tokens", "icon library", etc.

## Skill Format

Skills use the universal `SKILL.md` format compatible with all platforms:

```yaml
---
# Required (all platforms)
name: skill-name
description: |
  What this skill does.

  Use when user mentions:
  - "trigger phrase 1"
  - "trigger phrase 2"

  Requires: Prerequisites listed here

# Claude Code specific (Codex ignores)
allowed-tools:
  - mcp__figmatic__*
  - mcp__faux-devtools__*

# Codex specific (Claude Code ignores)
metadata:
  short-description: Brief one-liner
  category: figma
  version: 1.0.0
---

# Skill Title

[Markdown instructions for the agent]
```

## Prerequisites

- **Figmatic MCP Server**: Configured in your AI tool
- **Figma Desktop**: With "AI Agent Bridge" plugin running
- **Node.js**: v18+ for CLI

## Directory Structure

```
faux-skills/
├── cli/                    # CLI tool source
│   ├── index.js           # Entry point
│   ├── commands/          # install, uninstall, list, etc.
│   └── utils/             # Helpers
├── skills/                 # Skill definitions
│   ├── figma-design-system/
│   │   ├── SKILL.md
│   │   └── references/
│   ├── figma-component-builder/
│   │   ├── SKILL.md
│   │   └── references/
│   ├── web-to-figma/
│   │   ├── SKILL.md
│   │   └── references/
│   └── figma-icon-library/
│       ├── SKILL.md
│       └── references/
├── templates/              # Skill templates
│   └── SKILL.template.md
├── gui/                    # Future: GUI for skill management
├── package.json
├── README.md
└── LICENSE
```

## Creating Your Own Skills

1. Copy the template:
   ```bash
   cp templates/SKILL.template.md skills/my-skill/SKILL.md
   ```

2. Edit the YAML frontmatter and Markdown body

3. Add reference files if needed:
   ```
   skills/my-skill/
   ├── SKILL.md
   └── references/
       ├── examples.md
       └── patterns.md
   ```

4. Validate your skill:
   ```bash
   faux-skills validate skills/my-skill
   ```

## Cross-Platform Compatibility

The SKILL.md format is designed for maximum compatibility:

| Field | Claude Code | Codex | OpenSkills |
|-------|-------------|-------|------------|
| `name` | Required | Required | Required |
| `description` | Required | Required | Required |
| `allowed-tools` | Used | Ignored | Ignored |
| `metadata` | Ignored | Used | Used |

Unknown fields are simply ignored by each platform, so you can include all fields in a single file.

## Related Projects

- [Figmatic](https://github.com/faux-technologies/figmatic) - AI-powered Figma automation
- [Figmatic MCP Server](https://github.com/faux-technologies/figmatic-mcp-server) - 63 Figma tools via MCP
- [OpenSkills](https://github.com/openskills-dev/openskills) - Universal skills loader

## License

MIT
