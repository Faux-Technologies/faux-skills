---
name: faux
description: |
  AI-powered Figma design automation using Atomic Design methodology.
  Use when user mentions:
  - "create component", "build component", "figma component"
  - "design system", "design tokens", "variables", "text styles"
  - "icons", "icon library", "lucide", "heroicons"
  - "recreate from web", "copy from website", "extract from page"
  - "variants", "component set", "component properties"
  - "auto-layout", "responsive"
  Requires faux MCP connection to Figma Desktop.
  For web extraction, also requires Faux DevTools MCP connection to browser.

# Claude Code
allowed-tools:
  # FAUX DEVTOOLS MCP - Web Extraction Tools
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

  # FAUX MCP - Read Tools (18 tools)
  - mcp__faux__get_design_system
  - mcp__faux__get_screenshot
  - mcp__faux__get_node_details
  - mcp__faux__get_page_structure
  - mcp__faux__find_nodes_by_name
  - mcp__faux__query_nodes
  - mcp__faux__get_components
  - mcp__faux__get_component_structure
  - mcp__faux__get_component_properties
  - mcp__faux__get_instance_properties
  - mcp__faux__get_nested_instance_tree
  - mcp__faux__get_variables
  - mcp__faux__get_variable_collections
  - mcp__faux__get_text_segments
  - mcp__faux__get_selection
  - mcp__faux__get_viewport
  - mcp__faux__get_connections
  - mcp__faux__get_flow_starting_points

  # FAUX MCP - Write Tools (49 tools)
  - mcp__faux__create_from_schema
  - mcp__faux__create_variables
  - mcp__faux__create_variable_collection
  - mcp__faux__create_text_styles
  - mcp__faux__modify_nodes
  - mcp__faux__delete_node
  - mcp__faux__clone_node
  - mcp__faux__resize_node
  - mcp__faux__flatten_node
  - mcp__faux__move_nodes
  - mcp__faux__reorder_children
  - mcp__faux__add_children
  - mcp__faux__wrap_in_container
  - mcp__faux__align_nodes
  - mcp__faux__group_nodes
  - mcp__faux__ungroup_nodes
  - mcp__faux__set_constraints
  - mcp__faux__bind_variables
  - mcp__faux__update_variable
  - mcp__faux__delete_variable
  - mcp__faux__delete_variable_collection
  - mcp__faux__set_variable_mode
  - mcp__faux__apply_gradient_fill
  - mcp__faux__convert_to_component
  - mcp__faux__add_component_property
  - mcp__faux__edit_component_property
  - mcp__faux__delete_component_property
  - mcp__faux__expose_as_component_property
  - mcp__faux__add_variant_to_component_set
  - mcp__faux__create_instance
  - mcp__faux__create_multiple_instances
  - mcp__faux__set_instance_properties
  - mcp__faux__swap_component
  - mcp__faux__detach_instance
  - mcp__faux__import_image_from_url
  - mcp__faux__create_image_component
  - mcp__faux__create_image_components
  - mcp__faux__apply_images
  - mcp__faux__search_icons
  - mcp__faux__create_icon_component
  - mcp__faux__create_icons
  - mcp__faux__connect_nodes
  - mcp__faux__update_connections
  - mcp__faux__disconnect_nodes
  - mcp__faux__set_reactions
  - mcp__faux__scroll_to_nodes
  - mcp__faux__set_viewport_center
  - mcp__faux__set_selection
  - mcp__faux__show_status
  - mcp__faux__clear_status

  # FAUX MCP - Meta Tools (4 tools)
  - mcp__faux__execute_workflow
  - mcp__faux__execute_figma_script
  - mcp__faux__signal_work_start
  - mcp__faux__signal_work_end

# Codex
metadata:
  short-description: AI-powered Figma design automation with Atomic Design
  category: figma
  version: 4.0.0
---

# Faux - Figma Design Automation

AI-powered Figma design automation using **Atomic Design** methodology.

> "We're not designing pages, we're designing systems of components." — Brad Frost

---

## Faux MCP Tool Architecture

**71 tools** organized into Read, Write, and Meta categories. Most tools are top-level; additional operations are available via `execute_workflow`.

### Core Tools (Most Used)

| Category | Tool | Purpose |
|----------|------|---------|
| **Read** | `get_design_system` | Variables, text/paint/effect styles, library variables |
| | `get_screenshot` | Capture node as PNG/JPG |
| | `get_node_details` | Node properties, dimensions, bindings |
| | `get_page_structure` | Canvas structure overview |
| | `find_nodes_by_name` | Search by name pattern, type filter |
| | `query_nodes` | CSS-like selector queries |
| | `get_components` | List available components |
| **Write** | `create_from_schema` | Declarative UI creation from JSON schema |
| | `create_variables` | Create design token variables |
| | `create_text_styles` | Create typography styles |
| | `modify_nodes` | Modify multiple node properties |
| | `bind_variables` | Bind variables to node properties |
| | `create_instance` | Create component instance |
| | `create_icons` | Batch create icon components from Iconify |
| | `connect_nodes` | Wire prototype connections |
| **Meta** | `execute_workflow` | Run multiple commands in sequence |
| | `execute_figma_script` | Run raw Figma Plugin API code |

### The `execute_workflow` Pattern

Operations not available as top-level tools can be run via `execute_workflow`. Use **snake_case** command names.

```javascript
execute_workflow({
  commands: [
    { command: "create_icons", params: {
      icons: [{ iconName: "lucide:star" }],
      createComponentSet: true
    }}
  ]
})
```

### Key Workflow Commands

| Category | Commands |
|----------|----------|
| **Icons** | `search_icons`, `create_icon_component`, `create_icons` |
| **Variables** | `create_variable_collection`, `update_variable`, `delete_variable`, `set_variable_mode` |
| **Styles** | `create_text_styles` |
| **Components** | `convert_to_component`, `add_component_property`, `edit_component_property`, `expose_as_component_property`, `add_variant_to_component_set` |
| **Instances** | `create_instance`, `create_multiple_instances`, `swap_component`, `set_instance_properties`, `detach_instance` |
| **Layout** | `resize_node`, `clone_node`, `wrap_in_container`, `align_nodes`, `group_nodes`, `reorder_children` |
| **Queries** | `get_components`, `get_component_structure`, `get_component_properties`, `get_instance_properties` |
| **Images** | `import_image_from_url`, `apply_images`, `create_image_component` |
| **Prototype** | `connect_nodes`, `update_connections`, `disconnect_nodes`, `get_connections` |

---

## Core Principle: Design System First

**Never create monolithic components.** Always decompose into reusable atoms before composing up.

```
USER REQUEST
     │
     ▼
┌─────────────────────────────────────────┐
│         ANALYSIS PHASE                  │
│  "What patterns exist in this request?" │
└─────────────────────┬───────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────┐
│         DECOMPOSITION PHASE             │
│  "What reusable atoms do I need?"       │
└─────────────────────┬───────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────┐
│         BUILD PHASE                     │
│  Atoms → Molecules → Organism           │
└─────────────────────┬───────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────┐
│         COMPOSE PHASE                   │
│  Assemble final component from parts    │
└─────────────────────────────────────────┘
```

---

## Phase 0: Understand Request

Before touching any tool, mentally decompose the request:

### Pattern Recognition Checklist

| Pattern | Reusable Component | Priority |
|---------|-------------------|----------|
| Icon + Text | `MetaItem` | High |
| Icon + Number + Label | `Rating`, `Stat` | High |
| Title + Subtitle | `Header` | Medium |
| Image + Content below | `MediaCard` base | Medium |
| Repeating items | `ListItem` | High |
| Active/Inactive states | Variants | High |
| Level indicator (●●●○) | `LevelIndicator` | Medium |
| Avatar + Name + Meta | `UserBadge` | High |
| Button with icon | `IconButton` | High |
| Tag/Chip/Badge | `Tag` | High |

### Ask Yourself

1. **"Have I seen this pattern before?"** → Check existing components
2. **"Will this pattern repeat?"** → Extract as component
3. **"Is this the smallest useful unit?"** → If no, decompose further
4. **"Can this work in other contexts?"** → If yes, make it generic

---

## Phase 1: Orientation

**Goal:** Understand existing design system before creating anything.

### Required Checks

```
┌─────────────────────────────────────────┐
│ 1. get_design_system                    │
│    └── Cache this! Refer back often     │
│        ├── Variables: colors, spacing   │
│        ├── Text styles: existing type   │
│        └── Effect styles: shadows       │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│ 2. find_nodes_by_name                   │
│    └── searchTerm: "*", nodeType: "COMPONENT"
│        ├── Icons already created?       │
│        ├── Buttons, badges, tags?       │
│        └── Any matching patterns?       │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│ 3. find_nodes_by_name (FRAME/SECTION)   │
│    └── Where to place new components    │
│    OR: execute_workflow + get_page_structure
└─────────────────────────────────────────┘
```

### Reuse Decision Tree

```
Need a pattern (e.g., icon + text)?
              │
              ▼
┌─────────────────────────────────────────┐
│ Does component exist?                   │
│ find_nodes_by_name({                    │
│   searchTerm: "Avatar", nodeType: "COMPONENT"
│ })                                      │
└────────────────┬────────────────────────┘
                 │
           ┌─────┴─────┐
           │           │
           ▼           ▼
          YES          NO
           │           │
           ▼           ▼
      Use instance   Create atom
      $instance:     component
      "ComponentName" FIRST
```

---

## Phase 2: Atomic Design Hierarchy

### Level 0: Design Tokens (Variables)

Create or verify before anything else.

#### Collection Separation Principle (CRITICAL)

**Separate raw values from semantic meaning.** Two collections, not one:

```
Primitives Collection (single mode - raw values):
├── Colors/
│   ├── Gray/50, 100, 200... 900
│   ├── Blue/50, 100... 900
│   └── Red/50, 100... 900
├── Spacing/
│   └── 4, 8, 12, 16, 20, 24, 32, 48, 64
└── Radius/
    └── 0, 4, 8, 12, 16, 9999

Tokens Collection (multi-mode - semantic aliases):
├── Modes: Light, Dark
├── Colors/
│   ├── bg-primary      → Gray/50 (Light) | Gray/900 (Dark)
│   ├── bg-secondary    → Gray/100 (Light) | Gray/800 (Dark)
│   ├── text-primary    → Gray/900 (Light) | Gray/50 (Dark)
│   └── text-secondary  → Gray/600 (Light) | Gray/400 (Dark)
├── Spacing/
│   └── card-padding    → alias to Primitives/Spacing/16
└── Radius/
    └── card            → alias to Primitives/Radius/12
```

**Rule:** Components bind to Tokens, NEVER to Primitives directly.

**Via:** `create_variables` and `create_text_styles` tools

### Level 1: Atoms

Smallest reusable units. **Create these FIRST.**

| Atom | Structure | Properties |
|------|-----------|------------|
| `Icon/*` | Vector in frame | Color (variable bound) |
| `Tag` | Frame + Text | Label, Variant (style) |
| `Avatar` | Frame + Image/Initials | Size variant, Image |
| `Badge` | Frame + Text | Count, Variant |
| `Divider` | Line or Frame | Orientation |

**Tool:** `create_icons` for icon components, or `create_from_schema` with `convertToComponent: true`

### Level 2: Molecules

Combinations of atoms.

| Molecule | Atoms Used | Properties |
|----------|------------|------------|
| `MetaItem` | Icon + Text | Icon (swap), Label |
| `Rating` | Icon/Star + Text + Text | Value, Count |
| `LevelIndicator` | Icons or Text | Level (1-4) |
| `UserBadge` | Avatar + Text + Text | Name, Role, Image |
| `IconButton` | Icon + optional Text | Icon (swap), Label, Variant |
| `StatItem` | Text + Text | Value, Label |

**Build pattern:**
```javascript
// MetaItem molecule
{
  type: "AutoLayout",
  name: "MetaItem",
  direction: "horizontal",
  spacing: 4,
  align: "center",
  children: [
    { $instance: "Icon/Placeholder" },  // Will be exposed for swap
    { type: "Text", name: "Label", content: "Label" }
  ]
}
```

### Level 3: Organisms

Complex components composed of molecules.

| Organism | Molecules Used |
|----------|---------------|
| `Card` | Header, MetaRow, MediaSlot |
| `ListItem` | Avatar, TextGroup, ActionSlot |
| `FormField` | Label, Input, HelperText |
| `NavBar` | Logo, NavItems, ActionGroup |

---

## Theming Architecture

### Transparent Container Principle

**Nested containers should NOT have their own fills.**

```
WRONG:
Card (fill: bg-primary)
└── Content (fill: bg-secondary)    ← Blocks parent theme!
    └── Row (fill: bg-primary)      ← Blocks again!
        └── Text

RIGHT:
Card (fill: bg-primary)             ← Only outermost has fill
└── Content (transparent)
    └── Row (transparent)
        └── Text (color: text-primary)
```

**Why:** When a nested component has a fill, it blocks the parent's themed background regardless of mode settings. Inner components inherit visually by being transparent.

### Mode Propagation Boundaries

Setting a variable mode on a node affects variable resolution within that subtree—but **only for properties actually bound to variables**.

**NOT affected by mode changes:**
- Static fills (hardcoded hex colors)
- Fills bound to single-mode collections (Primitives)
- Fills on nested component definitions

**Audit checklist for each node:**
1. Does this node have a fill/stroke/text color?
2. Is it bound to the Tokens collection (multi-mode)?
3. Or is it static/bound to Primitives (won't respond to mode)?

### Theming Anti-Patterns

```javascript
// BAD: Nested fill blocks theming
{
  type: "AutoLayout",
  name: "Card",
  fill: "@Tokens/Colors/bg-primary | #FFFFFF",
  children: [{
    type: "AutoLayout",
    name: "Content",
    fill: "@Tokens/Colors/bg-secondary | #F3F4F6",  // BLOCKS parent!
    children: [...]
  }]
}

// GOOD: Only outermost container has fill
{
  type: "AutoLayout",
  name: "Card",
  fill: "@Tokens/Colors/bg-primary | #FFFFFF",
  children: [{
    type: "AutoLayout",
    name: "Content",
    // No fill - transparent, inherits parent background
    children: [...]
  }]
}
```

---

## Phase 3: Build Sequence

**Critical: Build bottom-up, not top-down.**

### Golden Rule: Instance Everything

**Once you create a component, ALWAYS use `$instance` to reference it.**

Never recreate the same structure inline. If you just created `MetaItem`, use `{ $instance: "MetaItem" }` everywhere you need it—don't rebuild icon + text frames.

```
WRONG: Created Rating component, then rebuilt it inline elsewhere
├── Rating (component)                    ← Created this
└── Card
    └── AutoLayout                        ← Then built this manually
        ├── Icon/Star
        ├── Text "4.8"
        └── Text "(324)"

RIGHT: Created Rating component, then instanced it
├── Rating (component)                    ← Created this
└── Card
    └── { $instance: "Rating" }           ← Then used instance
```

### Example: Any Card Component

```
WRONG (monolithic):
└── create_from_schema({ /* entire card inline */ })

RIGHT (composable):
├── Step 1: Check existing atoms
│   └── find_nodes_by_name({ nodeType: "COMPONENT" })
│
├── Step 2: Create missing atoms
│   └── execute_workflow + create_icons, or create_from_schema
│   └── NOW these exist as components!
│
├── Step 3: Create molecules
│   ├── Identify repeated patterns
│   ├── Each pattern = one molecule component
│   ├── USE $instance for atoms from Step 2
│   └── Keep molecules context-free (generic names)
│
├── Step 4: Create organism
│   └── Compose ONLY from $instance references
│   └── USE $instance for molecules from Step 3
│
└── Step 5: Add component properties
    └── Expose text, visibility, instance swaps
```

### Reuse What You Just Built

After each build step, the components you created become available:

```javascript
// Step 2: Create atom
create_icons({
  icons: [{ iconName: "lucide:star" }],
  createComponentSet: true,
  componentSetName: "Icons"
})
// NOW Icon/Star exists!

// Step 3: Create molecule - USE the atom you just created
create_from_schema({
  schema: {
    type: "AutoLayout",
    name: "Rating",
    children: [
      { $instance: "Icon/Star" },  // ← USE IT, don't recreate
      { type: "Text", name: "Value" },
      { type: "Text", name: "Count" }
    ]
  },
  convertToComponent: true
})
// NOW Rating exists!

// Step 4: Create organism - USE the molecule you just created
create_from_schema({
  schema: {
    type: "AutoLayout",
    name: "Restaurant Card",
    children: [
      { $instance: "Rating" },  // ← USE IT, don't recreate
      // ... other instances
    ]
  }
})
```

### Build Atoms Tool Selection

```
Creating atom components?
         │
         ▼
┌─────────────────────────┐
│ What type?              │
└────────────┬────────────┘
             │
   ┌─────────┼─────────┬─────────┐
   │         │         │         │
   ▼         ▼         ▼         ▼
 Icons    Simple     Complex   From
          frame      nested    existing
   │         │         │         │
   ▼         ▼         ▼         ▼
create_  create_   create_   convert_
icons    from_     from_     to_
         schema    schema +  component
                   convert
```

### Build Molecules Tool Selection

```
Creating molecule from atoms?
              │
              ▼
┌─────────────────────────────────────────┐
│ create_from_schema                      │
│ ├── Use $instance for atom references   │
│ ├── convertToComponent: true            │
│ └── Then execute_workflow →             │
│     add_component_property                │
└─────────────────────────────────────────┘
```

### Build Organisms Tool Selection

```
Creating organism from molecules?
              │
              ▼
┌─────────────────────────────────────────┐
│ create_from_schema                      │
│ ├── Use $instance for ALL sub-parts     │
│ ├── Molecules should be swappable       │
│ ├── convertToComponent: true            │
│ └── Expose key properties               │
└─────────────────────────────────────────┘
```

---

## Phase 4: Component Properties Strategy

### What to Expose

| Level | Expose | Property Type |
|-------|--------|---------------|
| Atom | Color, Size | Variables, Variants |
| Molecule | Primary text, Icon swap | TEXT, INSTANCE_SWAP |
| Organism | All molecule content, Show/hide sections | TEXT, BOOLEAN, INSTANCE_SWAP |

### Property Naming Convention

```
Component: [Organism]
├── Title         (TEXT) - Primary heading
├── Subtitle      (TEXT) - Secondary text
├── Description   (TEXT) - Body content
├── MetaLabel     (TEXT) - Supporting info
├── ShowHeader    (BOOLEAN) - Toggle section visibility
├── ShowFooter    (BOOLEAN) - Toggle section visibility
├── Icon          (INSTANCE_SWAP) - Swappable icon
└── Action        (INSTANCE_SWAP) - Swappable button/link
```

### Binding Sequence

```
1. Create component structure (create_from_schema with convertToComponent: true)
2. add_component_property (create properties on component)
3. expose_as_component_property (connect text, visibility, instance swaps)
```

Alternatively, use `$expose` and `$exposeInstance` directly in `create_from_schema` schemas to handle property exposure declaratively during creation.

---

## Phase 5: Variants Strategy

### When to Create Variants

```
Same component, different:
├── State (default, hover, active, disabled) → VARIANTS
├── Size (sm, md, lg) → VARIANTS
├── Style (filled, outlined, ghost) → VARIANTS
└── Content only → COMPONENT PROPERTIES (not variants)
```

### Variant Creation Flow

```
Need variants?
      │
      ▼
┌─────────────────────────┐
│ Are differences visual  │
│ (not just content)?     │
└────────────┬────────────┘
             │
       ┌─────┴─────┐
       │           │
       ▼           ▼
      YES          NO
       │           │
       ▼           ▼
  Create        Use component
  variants      properties
       │
       ▼
┌─────────────────────────┐
│ execute_workflow →      │
│ Use ComponentSet type    │
│ in create_from_schema   │
│ └── Naming: State=X     │
└─────────────────────────┘
```

---

## Quick Reference: Common Patterns

### Pattern: Icon + Label (MetaItem)

```javascript
// Create as reusable molecule
{
  type: "AutoLayout",
  name: "MetaItem",
  direction: "horizontal",
  spacing: 4,
  align: "center",
  children: [
    { $instance: "Icon/Placeholder", name: "Icon" },
    {
      type: "Text",
      name: "Label",
      content: "Label",
      $textStyle: "Body/Small"
    }
  ]
}

// Properties to add:
// - Label (TEXT) → bind to Label text
// - Icon (INSTANCE_SWAP) → expose Icon instance
```

### Pattern: Rating

```javascript
{
  type: "AutoLayout",
  name: "Rating",
  direction: "horizontal",
  spacing: 4,
  align: "center",
  children: [
    { $instance: "Icon/Star", $iconColor: "#F59E0B" },
    { type: "Text", name: "Value", content: "4.8", fontWeight: 600 },
    { type: "Text", name: "Count", content: "(324)", fill: "#9CA3AF" }
  ]
}

// Properties:
// - Value (TEXT)
// - Count (TEXT)
```

### Pattern: Card Base

```javascript
{
  type: "AutoLayout",
  name: "CardBase",
  direction: "vertical",
  fill: "#FFFFFF",
  cornerRadius: 16,
  // Shadow via execute_workflow after creation
  children: [
    { type: "Rectangle", name: "Media", height: 180, fill: "#E5E7EB" },
    {
      type: "AutoLayout",
      name: "Content",
      direction: "vertical",
      padding: 16,
      spacing: 12,
      width: "fill-parent",
      children: [] // Slots for content
    }
  ]
}
```

---

## Anti-Patterns to Avoid

### 1. Inline Everything (MOST COMMON MISTAKE)
```javascript
// BAD: Rating inlined in card
{ type: "AutoLayout", children: [
  { $instance: "Icon/Star" },
  { type: "Text", content: "4.8" },
  { type: "Text", content: "(324)" }
]}

// GOOD: Rating as separate component, instanced
{ $instance: "Rating", $override: { "Value": "4.8", "Count": "(324)" }}

// BAD: Just created MetaItem component, then rebuilt it inline
create_from_schema({ schema: MetaItemSchema, convertToComponent: true })
// ... later in same session ...
{ type: "AutoLayout", children: [  // WRONG! Use the component!
  { $instance: "Icon/Clock" },
  { type: "Text", content: "30 min" }
]}

// GOOD: Use the component you just created
{ $instance: "MetaItem", $override: { "Label": "30 min" }}
```

### 2. Skip Orientation
```javascript
// BAD: Create without checking
create_from_schema({ /* new card */ })

// GOOD: Check first
find_nodes_by_name({ searchTerm: "Rating", nodeType: "COMPONENT" })  // Does it exist?
get_design_system()  // What tokens exist?
// THEN create only what's missing
```

### 3. Hardcode Values
```javascript
// BAD: Hardcoded colors
{ fill: "#6B7280" }

// GOOD: Variable binding
{ fill: "@Colors/Gray/500 | #6B7280" }
```

### 4. Top-Down Building
```javascript
// BAD: Build card, then realize you need atoms
create_from_schema({ /* giant card schema */ })
// Oops, repeated patterns aren't components...

// GOOD: Bottom-up
create_icons(...)               // Atoms first
create [Molecule] component    // Then molecules
create [Molecule] component
create [Organism]              // Finally organism
```

### 5. Binding to Primitives
```javascript
// BAD: Direct primitive binding (won't respond to mode changes)
{ fill: "@Primitives/Colors/Gray/900 | #111827" }

// GOOD: Semantic token binding (responds to Light/Dark mode)
{ fill: "@Tokens/Colors/text-primary | #111827" }
```

### 6. Skipping Structural Audit
```javascript
// BAD: Apply variables without understanding hierarchy
bind_variables({ bindings: [...] })  // Hope it works!

// GOOD: Audit first, then bind
get_node_details({ nodeId })  // What does this node have?
execute_workflow({ commands: [
  { command: "get_nested_instance_tree", params: { nodeId } }
]})  // What's the hierarchy?
// List all filled nodes
// Verify each should have a fill
// THEN bind variables
```

---

## Verification Checklist

### Before Styling (Structural Audit)

Before applying variables or modes, audit the component hierarchy:

- [ ] **List every node with a fill** - Each is a potential theming failure point
- [ ] **List every node with a stroke** - Same concern
- [ ] **List every text node** - Check text color bindings
- [ ] **Identify nested containers with fills** - Should they be transparent?
- [ ] **Verify collection bindings** - Tokens (multi-mode) vs Primitives (single-mode)

### After Creation (Output Verification)

After any component creation:

- [ ] **Atomic Design Compliance** - Uses `$instance` references, not inline structure
- [ ] **No duplicated patterns** - Molecules contain atom instances, organisms contain molecule instances
- [ ] **Variable bindings correct** - Bound to Tokens, not Primitives
- [ ] **Transparent containers** - Only outermost has fill

### Visual Verification (REQUIRED)

Code inspection reveals structure; **screenshots reveal truth**.

```
After any change affecting appearance:
1. get_screenshot({ nodeId })           ← Capture Light mode
2. Set mode to Dark (if applicable)
3. get_screenshot({ nodeId })           ← Capture Dark mode
4. Compare with expected appearance
5. Discrepancies = unexamined assumptions
```

---

## Debugging Themed Components

### Binding vs Resolution

A property can be **correctly bound** yet **resolve to unexpected value**.

- **Binding** = the relationship (which variable)
- **Resolution** = the computed value (which mode's value)

When debugging, check BOTH:
1. `get_node_details` → Shows bindings
2. Visual inspection → Shows resolved values

### Hierarchical Fill Audit

When themed component displays incorrectly:

```
Traverse outermost → innermost:

At each level ask:
├── Does this node have a fill?
├── Is that fill bound to Tokens (multi-mode)?
├── Is mode set at this level or inherited?
└── STOP at first unexpected answer ← Problem is here
```

### Common Theming Issues

| Symptom | Likely Cause |
|---------|--------------|
| Component doesn't change in Dark mode | Bound to Primitives, not Tokens |
| Nested area stays Light in Dark mode | Nested container has its own fill |
| Text unreadable in one mode | Text color not bound to variable |
| Partial theme change | Some nodes bound, others hardcoded |

---

## Dimensional Consistency

### Cross-Component Alignment

When components must align (headers with rows, labels with inputs):

1. **Establish constraints at design time** - Document expected measurements
2. **Use consistent spacing tokens** - Same `@Tokens/Spacing/*` across related components
3. **Verify alignment after changes** - Misalignment breaks visual coherence

### Responsive Sizing Strategy

Decide BEFORE building:

| Dimension | Strategy | Implementation |
|-----------|----------|----------------|
| Fixed width | Exact pixel value | `width: 320` |
| Flexible width | Fill parent | `width: "fill-parent"` |
| Content-driven | Hug contents | `width: "hug-contents"` |

**Document the strategy.** Related components must use consistent sizing modes.

```javascript
// Header and Row must match
// If Header uses fixed 320px, Row must also use 320px
// If Header uses fill-parent, Row must also use fill-parent
```

---

## Checklist Before Creating

- [ ] Ran `get_design_system` - know available tokens
- [ ] Ran `find_nodes_by_name({ nodeType: "COMPONENT" })` - know existing components
- [ ] Identified all patterns in request
- [ ] **Checked if patterns exist as components (REUSE, don't recreate!)**
- [ ] Listed atoms needed (create if missing)
- [ ] Listed molecules needed (create if missing)
- [ ] Planned component properties to expose
- [ ] Decided on variants (if visual states needed)

---

## Naming Conventions (CRITICAL)

Consistent naming prevents duplication and enables reuse.

### Atoms
```
Icon/{Name}           ✓ Icon/Search, Icon/Clock, Icon/Mail
Icon/{Context}-{Name} ✗ Icon/Clock-Notification (too specific)

Avatar                ✓ Generic, size via variants
Avatar/Placeholder    ✗ Redundant suffix

Badge                 ✓ Generic
UnreadDot             ✓ Specific atom is OK if truly unique
```

### Molecules
```
{Pattern}             ✓ MetaItem, IconButton, InputBase
{Context}{Pattern}    ✗ NotificationTimestamp (too specific)

Generic naming enables reuse across contexts.
```

### Organisms
```
{Thing} Card          ✓ Profile Card, Product Card
{Thing} Item          ✓ Notification Item, List Item
{Thing} Field         ✓ Search Field, Text Field
```

### Size Variants (not separate components)
```
✓ Avatar with Size=sm/md/lg variants
✗ SmallAvatar, LargeAvatar as separate components
```

---

## Reuse Protocol

**Before creating ANY component, search first:**

```javascript
// Step 1: Search for existing
find_nodes_by_name({ searchTerm: "Avatar", nodeType: "COMPONENT" })
find_nodes_by_name({ searchTerm: "Button", nodeType: "COMPONENT" })
find_nodes_by_name({ searchTerm: "MetaItem", nodeType: "COMPONENT" })

// Step 2: If found → use $instance
{ $instance: "Avatar" }

// Step 3: If NOT found → create generically
// Name it for reuse, not for current context
```

**Common reusable patterns (check these first):**
- `Avatar` - circular image/initials
- `MetaItem` - icon + text
- `IconButton` - clickable icon
- `Badge` - count/status indicator
- `Tag` - label/chip
- `Button` - action button
- `Divider` - separator line

---

## Example Session: Atomic Design Flow

```
User: "Create a [card/form/list] component"

STEP 1: ORIENT
├── get_design_system → Know available tokens
├── find_nodes_by_name → Know existing atoms/molecules
└── Identify patterns in request:
    └── "What repeating units do I see?"

STEP 2: DECOMPOSE
├── List atoms needed (icons, badges, dividers)
├── List molecules needed (icon+text, avatar+name)
├── Check which already exist
└── Only build what's missing

STEP 3: BUILD ATOMS (if missing)
├── create_icons for icon components
├── create_from_schema + convertToComponent
└── Keep atoms generic and context-free

STEP 4: BUILD MOLECULES (if missing)
├── Compose from atom instances ($instance)
├── create_from_schema + convertToComponent
├── add_component_property for content
└── expose_as_component_property for swaps

STEP 5: BUILD ORGANISM
├── Compose entirely from molecule/atom instances
├── NO inline patterns - everything is $instance
├── add_component_property for content
└── Surface key molecule properties

RESULT:
├── Reusable atoms available for future work
├── Reusable molecules available for future work
├── Organism is purely compositional
└── Design system grows with each task
```

---

## Escape Hatch: Raw Figma Script

When no workflow command exists, use `execute_workflow` with raw script:

```javascript
execute_workflow({
  commands: [
    { command: "execute_figma_script", params: { script: `...` } }
  ]
})
```

### Common Escape Hatch Categories

| Category | Example Operations |
|----------|-------------------|
| Mode manipulation | Setting explicit variable mode on instances |
| Bulk operations | Modifying scattered nodes not in hierarchy |
| Diagnostic introspection | Reading resolved values vs bindings |
| Missing API coverage | Figma API methods without workflow command |

### Documentation Template

When using escape hatch, annotate:

```javascript
// ESCAPE HATCH: [Category]
// Intent: [What you're trying to accomplish]
// Why needed: [Why existing commands don't cover this]
execute_workflow({
  commands: [
    { command: "execute_figma_script", params: { script: `...` } }
  ]
})
```

**Pattern frequency indicates tool priority** - commonly needed scripts should become dedicated workflow commands.

---

## References

See `references/` folder for detailed guides:
- `decision-tree.md` - Tool selection flowcharts
- `iconify-sets.md` - Icon library reference

---

*Faux Skill v4.0 - Atomic Design Methodology (Faux MCP — 71 tools)*
