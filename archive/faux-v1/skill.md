---
name: faux
description: |
  AI-powered Figma design automation. Build components, design systems, and recreate web UI.
  Use when user mentions:
  - "create component", "build component", "figma component"
  - "design system", "design tokens", "variables", "text styles"
  - "icons", "icon library", "lucide", "heroicons"
  - "recreate from web", "copy from website", "extract from page"
  - "variants", "component set", "component properties"
  - "auto-layout", "responsive"
  Requires Figmatic MCP connection to Figma Desktop.
  For web extraction, also requires Faux DevTools MCP connection to browser.

# Claude Code
allowed-tools:
  # ═══════════════════════════════════════════════════════════════
  # FAUX DEVTOOLS MCP - Web Extraction Tools
  # ═══════════════════════════════════════════════════════════════
  - mcp__faux-devtools__take_screenshot
  - mcp__faux-devtools__screenshot_by_selector
  - mcp__faux-devtools__get_element_tree
  - mcp__faux-devtools__extract_element
  - mcp__faux-devtools__get_color_palette
  - mcp__faux-devtools__get_typography_map
  - mcp__faux-devtools__get_spacing_map
  - mcp__faux-devtools__get_layout_analysis
  - mcp__faux-devtools__get_theme_tokens
  - mcp__faux-devtools__evaluate_expression
  - mcp__faux-devtools__navigate_page
  - mcp__faux-devtools__list_pages
  - mcp__faux-devtools__select_page

  # ═══════════════════════════════════════════════════════════════
  # FIGMATIC MCP - Design System Tools
  # ═══════════════════════════════════════════════════════════════
  - mcp__figmatic__get_design_system
  - mcp__figmatic__create_variable
  - mcp__figmatic__batch_create_variables
  - mcp__figmatic__update_variable
  - mcp__figmatic__delete_variable
  - mcp__figmatic__bind_variable
  - mcp__figmatic__batch_bind_variables
  - mcp__figmatic__clone_with_variable_remap
  - mcp__figmatic__apply_gradient_fill

  # ═══════════════════════════════════════════════════════════════
  # FIGMATIC MCP - Typography Tools
  # ═══════════════════════════════════════════════════════════════
  - mcp__figmatic__check_font_available
  - mcp__figmatic__create_text_style
  - mcp__figmatic__batch_create_text_styles
  - mcp__figmatic__delete_text_style
  - mcp__figmatic__create_text_node

  # ═══════════════════════════════════════════════════════════════
  # FIGMATIC MCP - Icon Tools
  # ═══════════════════════════════════════════════════════════════
  - mcp__figmatic__search_icons
  - mcp__figmatic__create_icon_component
  - mcp__figmatic__batch_create_icons

  # ═══════════════════════════════════════════════════════════════
  # FIGMATIC MCP - Component Creation Tools
  # ═══════════════════════════════════════════════════════════════
  - mcp__figmatic__create_from_schema
  - mcp__figmatic__create_auto_layout
  - mcp__figmatic__create_component
  - mcp__figmatic__convert_to_component
  - mcp__figmatic__add_children
  - mcp__figmatic__wrap_in_container
  - mcp__figmatic__modify_node
  - mcp__figmatic__clone_node
  - mcp__figmatic__delete_node
  - mcp__figmatic__rename_node
  - mcp__figmatic__move_node
  - mcp__figmatic__batch_move_nodes
  - mcp__figmatic__align_nodes
  - mcp__figmatic__reorder_children

  # ═══════════════════════════════════════════════════════════════
  # FIGMATIC MCP - Component Property Tools
  # ═══════════════════════════════════════════════════════════════
  - mcp__figmatic__add_component_property
  - mcp__figmatic__edit_component_property
  - mcp__figmatic__delete_component_property
  - mcp__figmatic__bind_text_to_property
  - mcp__figmatic__bind_property_reference
  - mcp__figmatic__get_component_properties
  - mcp__figmatic__get_instance_properties
  - mcp__figmatic__set_instance_properties
  - mcp__figmatic__batch_set_instance_properties

  # ═══════════════════════════════════════════════════════════════
  # FIGMATIC MCP - Variant Tools
  # ═══════════════════════════════════════════════════════════════
  - mcp__figmatic__create_component_variants
  - mcp__figmatic__add_variant_to_component_set
  - mcp__figmatic__create_component_set_with_properties
  - mcp__figmatic__get_component_variants

  # ═══════════════════════════════════════════════════════════════
  # FIGMATIC MCP - Instance Tools
  # ═══════════════════════════════════════════════════════════════
  - mcp__figmatic__create_instance
  - mcp__figmatic__create_multiple_instances
  - mcp__figmatic__swap_component
  - mcp__figmatic__swap_instance_component
  - mcp__figmatic__set_nested_instance_exposure
  - mcp__figmatic__expose_nested_instance_by_path
  - mcp__figmatic__get_nested_instance_tree

  # ═══════════════════════════════════════════════════════════════
  # FIGMATIC MCP - Layout Tools
  # ═══════════════════════════════════════════════════════════════
  - mcp__figmatic__apply_responsive_pattern
  - mcp__figmatic__validate_responsive_layout
  - mcp__figmatic__copy_bindings
  - mcp__figmatic__copy_all_properties

  # ═══════════════════════════════════════════════════════════════
  # FIGMATIC MCP - Image Tools
  # ═══════════════════════════════════════════════════════════════
  - mcp__figmatic__import_image_from_url
  - mcp__figmatic__apply_image_fill
  - mcp__figmatic__batch_apply_images
  - mcp__figmatic__create_image_component
  - mcp__figmatic__batch_create_image_components

  # ═══════════════════════════════════════════════════════════════
  # FIGMATIC MCP - Query Tools
  # ═══════════════════════════════════════════════════════════════
  - mcp__figmatic__get_components
  - mcp__figmatic__get_component_metadata
  - mcp__figmatic__get_component_structure
  - mcp__figmatic__get_node_details
  - mcp__figmatic__get_page_structure
  - mcp__figmatic__find_nodes_by_name
  - mcp__figmatic__get_screenshot

  # ═══════════════════════════════════════════════════════════════
  # FIGMATIC MCP - Query Enhancement Tools (NEW)
  # ═══════════════════════════════════════════════════════════════
  - mcp__figmatic__suggest_variable_bindings
  - mcp__figmatic__get_text_segments
  - mcp__figmatic__get_css_properties
  - mcp__figmatic__get_inferred_layout

  # ═══════════════════════════════════════════════════════════════
  # FIGMATIC MCP - Viewport & Status Tools
  # ═══════════════════════════════════════════════════════════════
  - mcp__figmatic__set_viewport_center
  - mcp__figmatic__get_viewport
  - mcp__figmatic__scroll_to_node
  - mcp__figmatic__scroll_to_nodes
  - mcp__figmatic__show_status
  - mcp__figmatic__clear_status

  # ═══════════════════════════════════════════════════════════════
  # FIGMATIC MCP - Advanced Tools
  # ═══════════════════════════════════════════════════════════════
  - mcp__figmatic__execute_workflow
  - mcp__figmatic__discover_commands
  - mcp__figmatic__execute_figma_script

# Codex
metadata:
  short-description: AI-powered Figma design automation
  category: figma
  version: 2.0.0
---

# Faux - Figma Design Automation

Unified skill for AI-powered Figma automation: web extraction, design systems, icons, and components.

---

## Web-to-Figma Recreation Workflow

When recreating components from a website, **ALWAYS follow this workflow**. Skipping steps leads to incorrect recreations.

```
┌─────────────────────────────────────────────────────────────────┐
│  WEB-TO-FIGMA WORKFLOW (MANDATORY)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PHASE 0: EXTRACT (Before ANY Figma work!)                      │
│  ─────────────────────────────────────────                      │
│  1. screenshot_by_selector    → Visual reference (ground truth) │
│  2. get_element_tree          → DOM hierarchy with dimensions   │
│  3. get_typography_map        → All text styles used            │
│  4. get_color_palette         → Colors grouped by usage         │
│  5. get_spacing_map           → Padding/margin/gap values       │
│  6. get_layout_analysis       → Flex/grid properties            │
│  7. evaluate_expression       → Extract actual text content     │
│                                                                 │
│  PHASE 1: MAP TO DESIGN SYSTEM                                  │
│  ─────────────────────────────                                  │
│  8. get_design_system         → Check existing tokens           │
│  9. get_components            → Check existing components       │
│  10. Compare extracted → existing (reuse where possible)        │
│                                                                 │
│  PHASE 2: CREATE MISSING ASSETS (in this order!)                │
│  ─────────────────────────────                                  │
│  11. batch_create_icons       → Create icons FIRST              │
│  12. batch_create_text_styles → Create missing typography       │
│  13. batch_create_variables   → Create missing tokens           │
│                                                                 │
│  PHASE 3: BUILD COMPONENT                                       │
│  ─────────────────────────────                                  │
│  14. create_from_schema       → Build with @Variable bindings   │
│  15. convert_to_component     → Add properties                  │
│                                                                 │
│  PHASE 4: VALIDATE                                              │
│  ─────────────────────────────                                  │
│  16. get_screenshot           → Compare with original           │
│  17. Iterate on differences                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Extraction Tools Reference

| Tool | Purpose | Key Output |
|------|---------|------------|
| `screenshot_by_selector` | Visual ground truth | PNG file |
| `get_element_tree` | DOM structure | Node hierarchy with dimensions |
| `get_typography_map` | Font extraction | fontFamily, fontSize, fontWeight, lineHeight, color |
| `get_color_palette` | Color extraction | backgrounds, borders, text colors with frequency |
| `get_spacing_map` | Spacing extraction | padding, margin, gap values |
| `get_layout_analysis` | Layout extraction | display type, flex direction, gap, alignment |
| `evaluate_expression` | Custom extraction | Any data via JavaScript |

### Phase 0: Extract from Web

**Step 1: Screenshot first (ground truth)**
```javascript
screenshot_by_selector({ selector: ".card", filePath: "/tmp/reference.png" })
```

**Step 2-6: Extract properties**
```javascript
get_element_tree({ selector: ".card", depth: 10 })
get_typography_map({ selector: ".card", depth: 8 })
get_color_palette({ selector: ".card", depth: 8 })
get_spacing_map({ selector: ".card", depth: 5 })
get_layout_analysis({ selector: ".card" })
```

**Step 7: Extract actual content (NEVER MAKE UP CONTENT)**
```javascript
evaluate_expression({
  expression: `
    Array.from(document.querySelectorAll('.card')).map(card => ({
      title: card.querySelector('h3')?.textContent?.trim(),
      description: card.querySelector('p')?.textContent?.trim()
    }))
  `
})
```

### Phase 1: Map to Design System

```javascript
get_design_system({ forceRefresh: true })
get_components({ searchTerm: "Card" })
```

**Decision tree:**
- Extracted color matches existing token? → Use existing token
- Extracted font matches existing style? → Use existing style
- Extracted icon available? → Use existing component
- Nothing matches? → Create in Phase 2

### Phase 2: Create Missing Assets

**Order matters: Icons → Text Styles → Variables**

```javascript
// 1. Icons FIRST (components need them)
batch_create_icons({
  icons: [
    { iconName: "lucide:accessibility" },
    { iconName: "lucide:heart" }
  ],
  size: 24,
  baseColorVariable: "Icon/Primary"
})

// 2. Text styles (if needed)
batch_create_text_styles({
  styles: [
    { name: "Card/Title", fontFamily: "Inter", fontStyle: "SemiBold", fontSize: 20, lineHeight: { unit: "PIXELS", value: 28 } }
  ]
})

// 3. Variables (if needed)
batch_create_variables({
  collectionName: "Tokens",
  variables: [
    { name: "Card/Background", type: "COLOR", value: { r: 0.1, g: 0.1, b: 0.1, a: 1 } }
  ]
})
```

### Common Mistakes to Avoid

```
┌─────────────────────────────────────────────────────────────────┐
│  ❌ MISTAKES THAT CAUSE REWORK                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Skipping Phase 0 (extraction)                               │
│     → Results in made-up content and wrong styles               │
│                                                                 │
│  2. Creating icons AFTER building component                     │
│     → Have to rebuild to include real icons                     │
│                                                                 │
│  3. Inventing text content instead of extracting                │
│     → User has to point out all the wrong content               │
│                                                                 │
│  4. Assuming fonts instead of measuring                         │
│     → Typography won't match original                           │
│                                                                 │
│  5. Not comparing screenshots at the end                        │
│     → Differences go unnoticed until user complains             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Icon Library

Create icon components from Iconify's 275,000+ open-source icons.

### Workflow

```javascript
// 1. Search for icons (ALWAYS specify prefix)
search_icons({ query: "arrow", prefix: "lucide", limit: 5 })

// 2. Create icons (bind to design system)
batch_create_icons({
  icons: [
    { iconName: "lucide:home" },
    { iconName: "lucide:search" },
    { iconName: "lucide:user" }
  ],
  size: 24,
  baseColorVariable: "Icon/Primary",
  createComponentSet: true,
  componentSetName: "Icons"
})

// 3. Validate
get_screenshot({ nodeId: componentSetId })
```

### Recommended Icon Sets

| Set | Prefix | Style | Best For |
|-----|--------|-------|----------|
| **Lucide** | `lucide` | Clean, minimal | Modern apps, SaaS |
| **Heroicons** | `heroicons` | Tailwind style | Tailwind projects |
| **Phosphor** | `phosphor` | 6 weights | Weight flexibility |
| **Tabler** | `tabler` | 4,200+ icons | Large icon needs |
| **Material** | `material-symbols` | Google style | Material Design |

### Icon Color Binding

```
┌─────────────────────────────────────────────────────────────────┐
│  STROKE vs FILL (AUTO-DETECTED)                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STROKE icons: Lucide, Heroicons outline, Feather               │
│  FILL icons: Heroicons solid, Material filled, Phosphor fill    │
│                                                                 │
│  ✅ create_icon_component auto-detects and applies correctly    │
│  ✅ $iconColor in schema auto-detects and applies correctly     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Using Icons in Schemas

```javascript
create_from_schema({
  schema: {
    type: "AutoLayout",
    children: [
      {
        $instance: "Icon/Search",
        $iconColor: "@Icon/Primary | #666666"  // Auto-detects stroke/fill
      },
      { type: "Text", content: "Search" }
    ]
  }
})
```

---

## Design System

Create and manage design tokens (variables) and text styles.

### Two-Collection Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│  PRIMITIVES (single mode)         TOKENS (Light + Dark modes)  │
│  ─────────────────────────        ────────────────────────────  │
│  Colors/White                     Surface/Primary              │
│  Colors/Gray/500        ──────►     Light: alias → Colors/White│
│  Colors/Gray/900                    Dark: alias → Colors/Gray/900│
│                                                                 │
│  Raw values only.                 Semantic aliases.            │
│  No semantic meaning.             Mode-aware.                  │
└─────────────────────────────────────────────────────────────────┘
```

### Create Primitives

```javascript
batch_create_variables({
  collectionName: "Primitives",
  variables: [
    { name: "Colors/White", type: "COLOR", value: { r: 1, g: 1, b: 1, a: 1 } },
    { name: "Colors/Gray/900", type: "COLOR", value: { r: 0.11, g: 0.11, b: 0.11, a: 1 } },
    { name: "Spacing/4", type: "FLOAT", value: 16 },
    { name: "Radius/md", type: "FLOAT", value: 8 }
  ]
})
```

### Create Semantic Tokens

```javascript
batch_create_variables({
  collectionName: "Tokens",
  modes: ["Light", "Dark"],
  variables: [
    {
      name: "Surface/Primary",
      type: "COLOR",
      values: {
        "Light": { alias: "Colors/White" },
        "Dark": { alias: "Colors/Gray/900" }
      }
    }
  ]
})
```

### Create Text Styles

```javascript
check_font_available({ family: "Inter" })  // ALWAYS check first

batch_create_text_styles({
  styles: [
    { name: "Heading/H1", fontFamily: "Inter", fontStyle: "Bold", fontSize: 32, lineHeight: { unit: "PIXELS", value: 40 } },
    { name: "Body/Medium", fontFamily: "Inter", fontStyle: "Regular", fontSize: 16, lineHeight: { unit: "PIXELS", value: 24 } }
  ]
})
```

---

## Component Building

### create_from_schema (Declarative)

```javascript
create_from_schema({
  schema: {
    type: "AutoLayout",
    name: "Card",
    direction: "vertical",
    padding: 24,
    spacing: 16,
    cornerRadius: "@Radius/lg | 12",
    fill: "@Surface/Primary | #FFFFFF",
    children: [
      {
        type: "Text",
        name: "Title",
        content: "Card Title",
        $textStyle: "Heading/H3",
        width: "fill-parent"
      },
      {
        type: "Text",
        name: "Description",
        content: "Card description here",
        $textStyle: "Body/Medium",
        width: "fill-parent"
      }
    ]
  }
})
```

### Variable Binding Syntax

```
@VariableName | fallback

Examples:
fill: "@Surface/Primary | #FFFFFF"
cornerRadius: "@Radius/md | 8"
spacing: "@Spacing/4 | 16"
```

### convert_to_component (Add Properties)

```javascript
convert_to_component({
  nodeId: frameId,
  componentName: "Card",
  componentProperties: [
    {
      name: "Title",
      type: "TEXT",
      defaultValue: "Card Title",
      bindToNode: "Title"  // Deep searches all descendants
    },
    {
      name: "ShowDescription",
      type: "BOOLEAN",
      defaultValue: true,
      bindToNode: "Description"
    }
  ],
  autoExposeInstances: true
})
```

### Property Types

| Type | Use For | Bind To |
|------|---------|---------|
| TEXT | Editable labels | `bind_text_to_property` → characters |
| BOOLEAN | Show/hide elements | `bind_property_reference` → visible |
| INSTANCE_SWAP | Swap icons/nested | `bind_property_reference` → mainComponent |

---

## Layout Patterns

### Flexbox Fractal Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│  VERTICAL container → children get:                             │
│    layoutSizingHorizontal = FILL (stretch width)                │
│    layoutSizingVertical = HUG (shrink height)                   │
│                                                                 │
│  HORIZONTAL container → children get:                           │
│    layoutSizingHorizontal = HUG (shrink width)                  │
│    layoutSizingVertical = FILL (stretch height)                 │
│                                                                 │
│  EXCEPTIONS: Icons, avatars, badges → use FIXED                 │
└─────────────────────────────────────────────────────────────────┘
```

### Grid/Wrapping Layout

```javascript
create_auto_layout({
  name: "Grid",
  layoutMode: "HORIZONTAL",
  layoutWrap: "WRAP",
  itemSpacing: 16,           // Horizontal gap
  counterAxisSpacing: 16     // Vertical gap (DON'T FORGET!)
})
```

### Gradient Angle Mapping (CSS → Figma)

```
┌─────────────────────────────────────────────────────────────────┐
│  CSS ANGLE → FIGMA ANGLE                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CSS linear-gradient angles describe direction gradient GOES:   │
│  • 0deg = to top (↑)                                           │
│  • 90deg = to right (→)                                        │
│  • 180deg = to bottom (↓)                                      │
│  • 270deg = to left (←)                                        │
│                                                                 │
│  Figma apply_gradient_fill angle:                               │
│  • 0 = right (→)                                               │
│  • 90 = down (↓)                                               │
│  • 180 = left (←)                                              │
│  • 270 = up (↑)                                                │
│                                                                 │
│  CONVERSION: Figma angle = (CSS angle + 90) % 360               │
│                                                                 │
│  Common patterns:                                               │
│  • CSS 180deg (top→bottom) → Figma 90                          │
│  • CSS 90deg (left→right) → Figma 0                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Query Enhancement Tools (NEW)

Four new tools that leverage underutilized Figma Plugin APIs for smarter workflows.

### suggest_variable_bindings

**Purpose:** Auto-map node values to existing design tokens using Figma's `inferredVariables` API.

```javascript
// After building a component with raw values
suggest_variable_bindings({
  nodeId: componentId,
  recursive: true  // Also check children
})

// Returns:
// {
//   suggestions: {
//     "fills": [{ variableName: "Surface/Primary", collectionName: "Tokens", ... }],
//     "cornerRadius": [{ variableName: "Radius/md", collectionName: "Primitives", ... }]
//   },
//   unmatched: ["strokeWeight", "opacity"]
// }
```

**Workflow:** Build → suggest_variable_bindings → bind_variable for each match

### get_text_segments

**Purpose:** Extract per-segment typography from mixed-style text using `getStyledTextSegments()`.

```javascript
get_text_segments({ nodeId: textNodeId })

// Returns segments with different styles:
// {
//   segments: [
//     { characters: "Hello ", fontSize: 16, fontWeight: 400 },
//     { characters: "World", fontSize: 16, fontWeight: 700 }  // Bold
//   ],
//   hasMixedStyles: true
// }
```

**Use case:** Recreating text with mixed formatting (bold words, multiple colors).

### get_css_properties

**Purpose:** Get CSS-like properties using `getCSSAsync()` for validation/comparison.

```javascript
get_css_properties({ nodeId: frameId })

// Returns CSS similar to browser DevTools:
// {
//   css: {
//     "width": "320px",
//     "background": "linear-gradient(180deg, #191919, #242424)",
//     "border-radius": "8px"
//   }
// }
```

**Use case:** Compare extracted web CSS with Figma output to validate recreation.

### get_inferred_layout

**Purpose:** Detect auto-layout settings for manual frames using `inferredAutoLayout`.

```javascript
get_inferred_layout({ nodeId: manualFrameId })

// Returns:
// {
//   isAutoLayout: false,
//   inferredLayout: {
//     layoutMode: "VERTICAL",
//     itemSpacing: 16,
//     paddingTop: 24,
//     ...
//   },
//   recommendation: "Convert to VERTICAL auto-layout with 16px spacing"
// }
```

**Use case:** When recreating web components, detect patterns and convert to auto-layout.

---

## Core Principles

```
┌─────────────────────────────────────────────────────────────────┐
│  DESIGN TOKEN FIRST (CRITICAL)                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ❌ NEVER hardcode values:                                      │
│  fill: "#3B82F6"                                                │
│                                                                 │
│  ✅ ALWAYS use variable binding with fallback:                  │
│  fill: "@Interactive/Primary | #3B82F6"                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────┐
│  VISUAL VALIDATION (MANDATORY)                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  After EVERY creation step:                                     │
│  get_screenshot({ nodeId: createdNodeId })                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────┐
│  RESEARCH BEFORE IMPLEMENTATION                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. get_design_system → Understand existing tokens              │
│  2. get_components → Check existing components                  │
│  3. THEN create new elements                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## References

- Component properties: [references/component-properties.md](references/component-properties.md)
- Variant patterns: [references/variant-patterns.md](references/variant-patterns.md)
- Token architecture: [references/token-architecture.md](references/token-architecture.md)
- Icon sets: [references/iconify-sets.md](references/iconify-sets.md)
