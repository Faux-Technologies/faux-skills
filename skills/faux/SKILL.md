---
name: faux
description: |
  AI-powered Figma design using Atomic Design methodology. Create production-quality components, design systems, and screens with variable bindings and proper sizing. 71 tools for comprehensive Figma control.
metadata:
  version: "5.0.0"
  category: design
  author: Faux Technologies
  short-description: Design in Figma with AI
---

# Faux: AI-Powered Figma Design

Faux gives AI agents 71 tools to design in Figma. This skill teaches the Atomic Design workflow: start with variables, build components bottom-up, compose screens, verify everything.

---

## 5-Phase Workflow

### Phase 1: Orient
Before creating anything, understand the current state:

1. `get_design_system` — See what variables, styles, and tokens exist
2. `get_page_structure` — Understand what's on the canvas
3. `get_components` — Know what's available for reuse

### Phase 2: Build Foundation (Design System)
Create the design system tokens FIRST, before any UI:

1. `create_variables` — Colors, spacing, radius scales
2. Create semantic tokens with Light/Dark modes
3. `create_text_styles` — Typography scale

### Phase 3: Build Components (Bottom-Up)
Create atoms before molecules, molecules before organisms:

1. Start with smallest components (buttons, tags, icons)
2. Build up to composite components (cards, nav bars)
3. Use `convertToComponent: true` when creating reusable elements

### Phase 4: Compose Screens
Assemble screens using existing components:

1. Create screen frames with proper dimensions
2. Use `$instance` to embed existing components
3. Use `$image` for inline images
4. Bind everything to the design system

### Phase 5: Verify
Always verify your work:

1. `get_screenshot` — Visual confirmation
2. `get_node_details` with `resolveBindings: true` — Verify variable bindings

---

## Core Tool: create_from_schema

This is the most powerful tool. Use it for almost everything.

### Variable Bindings
```json
"fill": "@CollectionName/VariableName|fallback"
"fill": "@Colors/Coral/500|#FF6B5B"
"fill": "@Tokens/Surface/Primary|#FFFFFF"
```
- Creates REAL Figma variable bindings (not just colors)
- Fallback after `|` is used if variable doesn't exist

### Sizing Rules (Critical)

| Behavior | Declaration |
|----------|-------------|
| Fit to children | `"hug-contents"` |
| Fill parent | `"fill-parent"` |
| Fixed size | number (pixels) |

**Important**: For `fill-parent` to work, the parent must have a constraint (fixed or fill).

### Key Schema Syntax

**AutoLayout (default type):**
```json
{
  "type": "AutoLayout",
  "direction": "horizontal|vertical",
  "spacing": 16,
  "padding": {"horizontal": 20, "vertical": 16},
  "justify": "start|center|end|space-between",
  "align": "start|center|end|stretch",
  "children": []
}
```

**Text:**
```json
{
  "type": "Text",
  "content": "Hello",
  "fontSize": 16,
  "fontWeight": "Regular|Medium|SemiBold|Bold",
  "$textStyle": "Heading/H1",
  "fill": "@Tokens/Content/Primary|#171717"
}
```

**Inline Icons:**
```json
{"$icon": "heart", "size": 24, "color": "@Tokens/Content/Primary|#FF6B5B"}
```

**Inline Images:**
```json
{"$image": "https://example.com/img.jpg", "width": 300, "height": 200, "scaleMode": "FILL"}
```
Width and height are REQUIRED for images.

**Component Instances:**
```json
{
  "$instance": "Button",
  "$variant": {"Style": "Primary", "Size": "Medium"},
  "$override": {"Label": "Click Me"}
}
```

**Expose Component Properties:**
```json
{
  "schema": {
    "type": "AutoLayout",
    "children": [
      {"type": "Text", "content": "Title", "$expose": {"characters": "title"}},
      {"$icon": "heart", "visible": false, "$expose": {"visible": {"name": "showIcon", "default": false}}}
    ]
  },
  "convertToComponent": true
}
```

---

## Creating Multi-Mode Variables (Light/Dark)

```json
{
  "collectionName": "Tokens",
  "modes": ["Light", "Dark"],
  "variables": [
    {
      "name": "Surface/Primary",
      "type": "COLOR",
      "values": {
        "Light": {"r": 1, "g": 1, "b": 1, "a": 1},
        "Dark": {"r": 0.09, "g": 0.09, "b": 0.09, "a": 1}
      }
    }
  ]
}
```

Key points:
- Use `modes` array at collection level
- Use `values` object (not `value`) with mode names as keys
- Color values must be `{r, g, b, a}` objects with 0-1 values

---

## Best Practices

### 1. Batch Operations Over Individual Calls
- `create_variables` over multiple variable creations
- `modify_nodes` over multiple modifications
- `create_from_schema` over multiple individual creates

### 2. Design System First
Create variables and text styles BEFORE creating UI.

### 3. Schema Over Imperative
Prefer declarative `create_from_schema` over piecing together with multiple tool calls.

### 4. Components for Reuse
Use `convertToComponent: true` when creating elements you'll reuse, then reference with `$instance`.

### 5. Verify Variable Bindings
After creating UI with `@Variable` syntax, verify with:
```
get_node_details(nodeId, resolveBindings: true)
```

### 6. Screenshots
`get_screenshot` auto-scales large frames:
- Default format: JPG
- Default maxWidth: 1200px
- Use PNG only when transparency needed

---

## Common Failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| Frame stuck at 100px | Missing sizing | Add explicit width AND height |
| fill-parent not working | Parent has no constraint | Ensure parent has fixed or fill |
| Text overflowing | Missing textAutoResize | Add `textAutoResize: "HEIGHT"` |
| Instance invisible | Fill cleared | Restore fill with modify_nodes |
| Variable not binding | Wrong path | Check name exists in get_design_system |

---

## Top-Level Tools (19 tools)

### Orient (Read)
| Tool | Use |
|------|-----|
| `get_design_system` | What tokens/styles exist? |
| `get_page_structure` | What's on the canvas? |
| `get_components` | What's reusable? |
| `get_node_details` | Inspect any node |
| `get_screenshot` | Visual verification |

### Build (Write)
| Tool | Use |
|------|-----|
| `create_variables` | Build design tokens |
| `create_text_styles` | Build typography |
| `create_from_schema` | Create everything declaratively |
| `modify_nodes` | Change existing node properties |

### Prototype
| Tool | Use |
|------|-----|
| `connect_nodes` | Wire prototype connections |
| `get_connections` | Read prototype connections |
| `update_connections` | Update existing connections |
| `disconnect_nodes` | Remove prototype connections |

### Refine
| Tool | Use |
|------|-----|
| `find_nodes_by_name` | Locate nodes by name pattern |
| `query_nodes` | CSS-like selector queries |
| `bind_variables` | Wire up variable bindings post-creation |
| `delete_node` | Remove nodes |
| `move_nodes` | Reparent/reposition |

### Meta
| Tool | Use |
|------|-----|
| `execute_workflow` | Run any command sequence (47 additional commands) |

---

## Workflow Summary

```
1. Orient:     get_design_system, get_page_structure, get_components
2. Foundation: create_variables, create_text_styles
3. Components: create_from_schema (convertToComponent: true, use $expose)
4. Screens:    create_from_schema (using $instance, $image, @Variable, $textStyle)
5. Prototype:  connect_nodes (wire navigation between screens)
6. Verify:     get_screenshot, get_node_details
```

**Key insight**: `create_from_schema` with proper bindings is the most powerful pattern. Build a design system first, then compose everything declaratively.

---

## Reference Files

For detailed documentation, see the references/ folder:

- `schema-syntax.md` — Full create_from_schema primitive reference
- `variable-bindings.md` — @Variable syntax, multi-mode variables, scopes
- `component-patterns.md` — ComponentSet matrix mode, $expose, $exposeInstance
- `sizing-rules.md` — hug-contents, fill-parent, constraint chains
- `troubleshooting.md` — Common failures and error recovery
- `prototyping.md` — connect_nodes, animations, batch wiring
- `query-selectors.md` — CSS selector syntax for query_nodes
- `tool-catalog.md` — All 71 tools with descriptions
