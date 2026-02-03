---
# ============================================================================
# UNIVERSAL SKILL TEMPLATE
# ============================================================================
# This template works with Claude Code, Codex, Cursor, Windsurf, and OpenSkills.
# Each platform ignores fields it doesn't understand.
# ============================================================================

# === REQUIRED (All Platforms) ===
name: your-skill-name
description: |
  A clear description of what this skill does.

  Use when user mentions:
  - "trigger phrase 1"
  - "trigger phrase 2"
  - "related keyword"

  Requires: List any prerequisites (e.g., MCP server, plugins)

# === CLAUDE CODE SPECIFIC ===
# Codex and OpenSkills ignore these fields
allowed-tools:
  # Use wildcards for MCP tool groups
  - mcp__faux__*
  - mcp__faux-devtools__*
  # Or list specific tools
  # - mcp__faux__create_component
  # - mcp__faux__get_design_system

# === CODEX / OPENSKILLS SPECIFIC ===
# Claude Code ignores these fields
metadata:
  short-description: Brief one-liner for listings
  category: figma          # Category for organization
  version: 1.0.0           # Semantic version
  author: Your Name        # Optional
  tags:                    # Optional search tags
    - figma
    - design
    - automation
---

# Skill Title

Brief introduction to what this skill accomplishes.

## When to Use This Skill

- Scenario 1 where this skill is appropriate
- Scenario 2 where this skill is appropriate
- Scenario 3 where this skill is appropriate

## Prerequisites

1. **Required Tool/Service**: Description of what's needed
2. **Required Tool/Service**: Description of what's needed

## Core Workflow

### Step 1: Initial Setup

Description of the first step.

```
Example code or commands if applicable
```

### Step 2: Main Operation

Description of the main operation.

### Step 3: Validation

How to verify the operation succeeded.

## Quality Standards

- [ ] Checkbox item for quality requirement
- [ ] Another quality requirement
- [ ] Final quality check

## Common Patterns

### Pattern Name

Description of a common pattern with example.

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| Error type 1 | Why it happens | How to fix |
| Error type 2 | Why it happens | How to fix |

## References

Additional files in the `references/` folder:
- `examples.md` - Real-world examples
- `patterns.md` - Common patterns and templates
- `troubleshooting.md` - Detailed error solutions
