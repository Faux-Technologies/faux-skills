# faux-skills

AI agent skills for Figma design automation. Works with **Claude Code**, **Codex**, **Cursor**, **Windsurf**, and any platform supporting the [Agent Skills Specification](https://agentskills.io).

## Quick Install

```bash
npx skills add Faux-Technologies/faux-skills
```

This installs the Faux skill to your AI agent's skills directory.

### Targeting Specific Agents

```bash
# Claude Code
npx skills add Faux-Technologies/faux-skills -a claude-code

# Codex
npx skills add Faux-Technologies/faux-skills -a codex

# Cursor
npx skills add Faux-Technologies/faux-skills -a cursor

# Global install (available to all agents)
npx skills add Faux-Technologies/faux-skills -g
```

### List Available Skills

```bash
npx skills add Faux-Technologies/faux-skills --list
```

## What's Included

| Skill | Description |
|-------|-------------|
| `faux` | AI-powered Figma design with 71 tools. Atomic Design workflow: variables → components → screens. |

### Skill Structure

```
skills/faux/
├── SKILL.md                 # Core methodology (280 lines)
└── references/
    ├── schema-syntax.md     # create_from_schema reference
    ├── variable-bindings.md # @Variable syntax, multi-mode themes
    ├── component-patterns.md # ComponentSet, $expose, variants
    ├── sizing-rules.md      # hug-contents, fill-parent
    ├── troubleshooting.md   # Common failures & fixes
    ├── prototyping.md       # connect_nodes, animations
    ├── query-selectors.md   # CSS selector syntax
    └── tool-catalog.md      # All 71 tools
```

## Prerequisites

1. **Faux MCP Server** — Configure in your AI tool's MCP settings:
   ```json
   {
     "mcpServers": {
       "faux": {
         "url": "https://mcp.faux.design/mcp"
       }
     }
   }
   ```

2. **Figma Desktop** — With the Faux plugin running

See [faux.design/docs/setup](https://faux.design/docs/setup) for complete setup instructions.

## Manual Installation

If you prefer manual installation:

```bash
# Clone the repo
git clone https://github.com/Faux-Technologies/faux-skills.git

# Copy to your agent's skills directory
cp -r faux-skills/skills/faux ~/.claude/skills/     # Claude Code
cp -r faux-skills/skills/faux ~/.codex/skills/      # Codex
cp -r faux-skills/skills/faux .cursor/skills/       # Cursor (project-local)
```

## The Faux Workflow

The skill teaches the **Atomic Design** workflow:

1. **Orient** — `get_design_system`, `get_page_structure`, `get_components`
2. **Foundation** — `create_variables`, `create_text_styles`
3. **Components** — `create_from_schema` with `convertToComponent: true`
4. **Screens** — `create_from_schema` using `$instance`, `$image`, `@Variable`
5. **Verify** — `get_screenshot`, `get_node_details`

### Key Syntax

```json
// Variable bindings
"fill": "@Colors/Primary|#3B82F6"

// Inline icons
{"$icon": "heart", "size": 24, "color": "@Tokens/Accent|#FF6B5B"}

// Component instances
{"$instance": "Button", "$variant": {"Style": "Primary"}, "$override": {"Label": "Click"}}

// Sizing
"width": "fill-parent"    // Fill available space
"height": "hug-contents"  // Fit to children
```

## Cross-Platform Compatibility

The skill uses the universal [Agent Skills](https://agentskills.io) format:

| Platform | Status | Location |
|----------|--------|----------|
| Claude Code | ✅ Full support | `~/.claude/skills/` |
| Codex | ✅ Full support | `~/.codex/skills/` |
| Cursor | ✅ Full support | `.cursor/skills/` |
| Windsurf | ✅ Supported | `.windsurf/skills/` |
| VS Code Copilot | ✅ Supported | `.github/skills/` |
| Gemini CLI | ✅ Supported | Agent-specific |

## Related

- [Faux](https://faux.design) — AI-powered Figma design platform
- [Setup Guide](https://faux.design/docs/setup) — Complete installation instructions
- [Agent Skills Specification](https://agentskills.io) — The open standard

## License

MIT
