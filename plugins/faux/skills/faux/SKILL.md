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

## Design Thinking

Before designing, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement Figma designs that are:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Design Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the design's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use design tokens for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Design for micro-interactions and state transitions. Focus on high-impact moments: hover states, active states, and transitions that surprise and delight.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate detail with extensive layering and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

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

**The Dam Metaphor**: Think of constraints as water flow:
- `fill-parent` = open channel (constraint flows through)
- `hug-contents` = **dam** (constraint STOPS here)
- Fixed = reservoir (provides constraint)

**Critical Rule**: For `fill-parent` to work, EVERY container in the chain must pass the constraint. One `hug-contents` breaks the chain.

**Text Dual Requirement**: Text needs BOTH width constraint AND `textAutoResize: "HEIGHT"`. Neither alone works.

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

### 3. Always Use AutoLayout
**Never use plain Frames. Always use AutoLayout.** AutoLayout provides:
- Automatic spacing and alignment
- Responsive resizing (hug-contents, fill-parent)
- Proper constraint propagation
- Predictable child arrangement

Plain Frames require manual positioning and don't respond to content changes.

### 4. Schema Over Imperative
Prefer declarative `create_from_schema` over piecing together with multiple tool calls.

### 5. Components for Reuse
Use `convertToComponent: true` when creating elements you'll reuse, then reference with `$instance`.

### 6. Verify Variable Bindings
After creating UI with `@Variable` syntax, verify with:
```
get_node_details(nodeId, resolveBindings: true)
```

### 7. Screenshots
`get_screenshot` auto-scales large frames:
- Default format: JPG
- Default maxWidth: 1200px
- Use PNG only when transparency needed

---

## Common Failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| Frame stuck at 100px | Missing sizing | Add explicit width AND height |
| fill-parent not working | Chain broken by hug-contents | Trace chain; every node must fill or be fixed |
| Text overflowing | Missing BOTH requirements | Add width constraint AND `textAutoResize: "HEIGHT"` |
| Internal element not responding | Propagation chain broken | Every container between boundary and element must fill |
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
- `design-aesthetics.md` — Visual design principles, typography, color, anti-patterns
- `troubleshooting.md` — Common failures and error recovery
- `prototyping.md` — connect_nodes, animations, batch wiring
- `query-selectors.md` — CSS selector syntax for query_nodes
- `tool-catalog.md` — All 71 tools with descriptions
