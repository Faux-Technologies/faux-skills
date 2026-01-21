---
name: figma-component-builder
description: |
  Build Figma components with properties, variants, and design system integration.
  Use when user mentions:
  - "create component", "build component", "make component"
  - "component properties", "text property", "boolean property"
  - "variants", "component set", "component states"
  - "instance swap", "expose instances", "nested components"
  - "auto-layout", "responsive component"
  Requires Figmatic MCP connection to Figma Desktop.

# Claude Code
allowed-tools:
  - mcp__figmatic__get_design_system
  - mcp__figmatic__create_from_schema
  - mcp__figmatic__convert_to_component
  - mcp__figmatic__add_component_property
  - mcp__figmatic__edit_component_property
  - mcp__figmatic__delete_component_property
  - mcp__figmatic__bind_text_to_property
  - mcp__figmatic__bind_property_reference
  - mcp__figmatic__bind_variable
  - mcp__figmatic__batch_bind_variables
  - mcp__figmatic__create_component_variants
  - mcp__figmatic__add_variant_to_component_set
  - mcp__figmatic__create_component_set_with_properties
  - mcp__figmatic__set_nested_instance_exposure
  - mcp__figmatic__expose_nested_instance_by_path
  - mcp__figmatic__get_component_properties
  - mcp__figmatic__get_component_structure
  - mcp__figmatic__get_nested_instance_tree
  - mcp__figmatic__modify_node
  - mcp__figmatic__add_children
  - mcp__figmatic__apply_responsive_pattern
  - mcp__figmatic__validate_responsive_layout
  - mcp__figmatic__get_screenshot
  - mcp__figmatic__show_status
  - mcp__figmatic__clear_status
  - mcp__figmatic__wrap_in_container
  - mcp__figmatic__copy_bindings
  - mcp__figmatic__copy_all_properties
  - mcp__figmatic__create_auto_layout
  - mcp__figmatic__execute_workflow
  - mcp__figmatic__discover_commands

# Codex
metadata:
  short-description: Build Figma components with properties and variants
  category: figma
  version: 1.0.0
---

# Figma Component Builder

Build components with properties, variants, and design system integration.

## Evidence-Based Workflow Pattern

From analysis of 5,606 tool calls, this workflow pattern emerged:

```
┌─────────────────────────────────────────────────────────────────┐
│  COMPONENT BUILDING WORKFLOW (from tool-calls.jsonl)           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. get_design_system         → Cache tokens for bindings       │
│           ↓                                                     │
│  2. create_from_schema        → Build component structure       │
│           ↓                                                     │
│  3. convert_to_component      → Convert frame to component      │
│           ↓                                                     │
│  4. add_component_property    → Add TEXT/BOOLEAN/INSTANCE_SWAP  │
│           ↓                                                     │
│  5. bind_text_to_property     → Connect text nodes to props     │
│           ↓                                                     │
│  6. bind_property_reference   → Connect visibility/swap props   │
│           ↓                                                     │
│  7. create_component_variants → Create variant states           │
│           ↓                                                     │
│  8. bind_variable ×N          → Bind tokens to variants         │
│           ↓                                                     │
│  9. get_screenshot            → Validate visually               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** 472 `create_from_schema`, 186 `convert_to_component`, 211 `add_component_property`, 150 `bind_text_to_property` calls

## Tool Workflow

### Phase 1: Cache Design System

```javascript
get_design_system({ forceRefresh: true })
```

Cache variable names for bindings (e.g., `@Surface/Primary`, `@Text/Primary`).

### Phase 2: Create Structure

```javascript
create_from_schema({
  schema: {
    type: "AutoLayout",
    name: "Button",
    direction: "horizontal",
    padding: { horizontal: 16, vertical: 10 },
    spacing: 8,
    cornerRadius: "@Radius/md | 8",
    fill: "@Interactive/Primary | #3B82F6",
    align: "center",
    children: [
      {
        type: "Text",
        name: "Label",
        content: "Button",
        $textStyle: "Label/Medium",
        fill: "@Text/OnPrimary | #FFFFFF"
      }
    ]
  }
})
```

### Phase 3: Convert to Component

**Simple conversion:**
```javascript
convert_to_component({
  nodeId: frameId,
  componentName: "Button"
})
```

**With properties (recommended):**
```javascript
convert_to_component({
  nodeId: frameId,
  componentName: "Button",
  componentProperties: [
    {
      name: "Label",
      type: "TEXT",
      defaultValue: "Button",
      bindToNode: "Label"  // Simple name - deep searches all descendants
    },
    {
      name: "ShowIcon",
      type: "BOOLEAN",
      defaultValue: true,
      bindToNode: "Icon"  // Binds to visibility
    },
    {
      name: "DeepText",
      type: "TEXT",
      defaultValue: "Nested",
      bindToNode: ["Content", "Body", "Text"]  // Explicit path for ambiguous names
    }
  ],
  autoExposeInstances: true  // Expose nested instances for swapping
})
```

**bindToNode formats:**
- `"NodeName"` - Simple string, deep searches all descendants
- `["Path", "To", "Node"]` - Explicit path for ambiguous names
- `"123:456"` - Direct node ID
- `"$self"` - Bind to component itself

If simple name has multiple matches, tool returns helpful error with all options.

### Phase 4: Add Properties (if needed after conversion)

**TEXT property:**
```javascript
const result = await add_component_property({
  componentId: componentId,
  propertyName: "Title",
  propertyType: "TEXT",
  defaultValue: "Card Title"
})
// Returns: { propertyKey: "Title#123:456" }
// If "Title" already exists, returns: { alreadyExists: true, propertyKey: "Title#existing" }
```

**Duplicate prevention:** By default, `add_component_property` checks for existing properties and returns the existing one instead of creating "Title2". Use `allowDuplicate: true` to override.

**BOOLEAN property:**
```javascript
add_component_property({
  componentId: componentId,
  propertyName: "ShowBadge",
  propertyType: "BOOLEAN",
  defaultValue: false
})
```

**INSTANCE_SWAP property:**
```javascript
add_component_property({
  componentId: componentId,
  propertyName: "Icon",
  propertyType: "INSTANCE_SWAP",
  defaultValue: iconComponentId
})
```

### Phase 5: Bind Properties

**Bind text to property:**
```javascript
bind_text_to_property({
  textNodeId: "123:457",
  propertyKey: "Title#123:456"  // From add_component_property
})
```

**Bind visibility to boolean:**
```javascript
bind_property_reference({
  nodeId: "123:458",
  nodeProperty: "visible",
  componentPropertyKey: "ShowBadge#123:456"
})
```

**Bind instance swap:**
```javascript
bind_property_reference({
  nodeId: "123:459",
  nodeProperty: "mainComponent",
  componentPropertyKey: "Icon#123:456"
})
```

### Phase 6: Create Variants

**From existing component:**
```javascript
create_component_variants({
  componentId: baseComponentId,
  variants: [
    { name: "State=Default" },
    {
      name: "State=Hover",
      modifications: {
        nodes: [{ path: ["Background"], opacity: 0.9 }]
      }
    },
    {
      name: "State=Pressed",
      modifications: {
        nodes: [{ path: ["Background"], opacity: 0.8 }]
      }
    },
    {
      name: "State=Disabled",
      modifications: {
        nodes: [{ path: ["Background"], opacity: 0.5 }],
        textNodes: [{ path: ["Label"], fillVariableName: "Text/Disabled" }]
      }
    }
  ]
})
```

**Add variant to existing set:**
```javascript
add_variant_to_component_set({
  componentSetId: "221:18176",
  sourceVariantId: "221:18053",
  variantName: "State=Loading",
  modifications: {
    textNodes: [{ path: ["Label"], characters: "Loading..." }]
  }
})
```

### Phase 7: Bind Variables to Variants

```javascript
bind_variable({
  nodeId: variantNodeId,
  property: "fills",
  variableName: "Surface/Primary"
})

// Batch bind
batch_bind_variables({
  bindings: [
    { nodeId: "id1", property: "fills", variableName: "Surface/Primary" },
    { nodeId: "id2", property: "fills", variableName: "Surface/Secondary" },
    { nodeId: "id3", property: "cornerRadius", variableName: "Radius/md" }
  ]
})
```

### Phase 8: Validate

```javascript
get_component_properties({ componentId })
get_screenshot({ nodeId: componentId })
```

## Property Types

| Type | Use For | Bind To |
|------|---------|---------|
| TEXT | Editable labels | `bind_text_to_property` → characters |
| BOOLEAN | Show/hide elements | `bind_property_reference` → visible |
| INSTANCE_SWAP | Swap icons/nested | `bind_property_reference` → mainComponent |

## Variants vs Instance Swaps

Use this decision tree to choose the right architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│  VARIANTS vs INSTANCE SWAPS                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Use VARIANTS when:                                             │
│  • Mutually exclusive structural states                         │
│  • Different layouts or content structures                      │
│  • States that change the component's shape                     │
│  • Example: Card/Collapsed vs Card/Expanded                     │
│                                                                 │
│  Use INSTANCE SWAPS when:                                       │
│  • Interchangeable subcomponents                                │
│  • Icons, right-side controls, badges                           │
│  • Any "plug-in" element that doesn't change structure          │
│  • Example: Icon/Home ↔ Icon/Settings                           │
│                                                                 │
│  ⚠️  AVOID: Using visibility toggles for multiple elements      │
│      (causes collision where hiding one affects others)         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Pattern: Row with Right-Control Swap**
```
Row (VERTICAL auto-layout)
├── Row Content (HORIZONTAL)
│   ├── Left (icon + label)
│   └── Right Control (INSTANCE_SWAP) → Right/None, Right/Chevron, Right/Toggle
└── Divider (optional)
```

## Property Key Drift Warning

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️  PROPERTY KEYS DRIFT AFTER VARIANT CREATION                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Property keys (e.g., "Label#123:456") can CHANGE after:        │
│  • Creating variants                                            │
│  • Combining into ComponentSet                                  │
│  • Modifying component structure                                │
│                                                                 │
│  RULE: Always call get_instance_properties BEFORE setting       │
│        overrides to discover the actual current keys.           │
│                                                                 │
│  Pattern:                                                       │
│  1. create_component / create_component_variants                │
│  2. get_instance_properties → discover actual keys              │
│  3. set_instance_properties → use discovered keys               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Critical Order for ComponentSets

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️  PROPERTY BINDING ORDER (CRITICAL)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Create variant components (WITHOUT properties)              │
│           ↓                                                     │
│  2. Combine into ComponentSet (create_component_variants)       │
│           ↓                                                     │
│  3. Add properties to the COMPONENTSET (not variants)           │
│           ↓                                                     │
│  4. Bind nested nodes to ComponentSet properties                │
│                                                                 │
│  ❌ Properties added to variants BEFORE combining won't work    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Exposing Nested Instances

**Auto-expose during conversion:**
```javascript
convert_to_component({
  nodeId: frameId,
  autoExposeInstances: true
})
```

**Manual exposure:**
```javascript
expose_nested_instance_by_path({
  parentInstanceId: componentId,
  childPath: ["Icon Container", "Icon"],
  isExposed: true
})
```

**Check exposed instances:**
```javascript
get_nested_instance_tree({
  instanceId: componentId,
  depth: -1
})
```

## Sizing Defaults (Flexbox Fractal Pattern)

```
┌─────────────────────────────────────────────────────────────────┐
│  FLEXBOX FRACTAL PATTERN                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  VERTICAL container → children get:                             │
│    layoutSizingHorizontal = FILL (stretch width)                │
│    layoutSizingVertical = HUG (shrink height)                   │
│                                                                 │
│  HORIZONTAL container → children get:                           │
│    layoutSizingHorizontal = HUG (shrink width)                  │
│    layoutSizingVertical = FILL (stretch height)                 │
│                                                                 │
│  EXCEPTIONS (use FIXED sizing):                                 │
│    • Icons, avatars, badges (fixed dimensions)                  │
│    • Images with aspect ratio constraints                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**In create_from_schema:**
```javascript
{
  type: "AutoLayout",
  direction: "vertical",
  children: [
    {
      type: "Text",
      name: "Title",
      width: "fill-parent",  // ← Fills parent width
      content: "Card Title"
    }
  ]
}
```

**Apply pattern to existing component:**
```javascript
apply_responsive_pattern({
  nodeId: componentId,
  recursive: true,
  exceptions: [
    { nodeId: iconId, sizing: "FIXED" },
    { nodeId: avatarId, sizing: "FIXED" }
  ]
})
```

**Validate layout:**
```javascript
validate_responsive_layout({
  nodeId: componentId,
  checkOverflow: true,
  checkSizingModes: true
})
```

## Text Wrapping

```
┌─────────────────────────────────────────────────────────────────┐
│  TEXT AUTO-RESIZE MODES                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WIDTH_AND_HEIGHT (default)                                     │
│    Text expands to fit content, no wrapping                     │
│                                                                 │
│  HEIGHT (for wrapping)                                          │
│    Fixed width, height grows with wrapped text                  │
│    ✅ Set automatically when width: "fill-parent"               │
│                                                                 │
│  NONE                                                           │
│    Fixed width and height, text clips                           │
│                                                                 │
│  TRUNCATE                                                       │
│    Fixed size with ellipsis truncation                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Enable text wrapping in schema:**
```javascript
{
  type: "Text",
  name: "Description",
  width: "fill-parent",           // ← Auto-sets textAutoResize=HEIGHT
  content: "Long text that will wrap..."
}
```

**Explicit control:**
```javascript
{
  type: "Text",
  name: "Description",
  width: 300,
  textAutoResize: "HEIGHT",       // ← Explicit wrapping mode
  content: "Long text that will wrap..."
}
```

**Truncation with max lines:**
```javascript
{
  type: "Text",
  name: "Preview",
  width: "fill-parent",
  truncate: 2,                    // ← Max 2 lines with ellipsis
  content: "Long text that will truncate..."
}
```

## Tool Chain Summary

```
create_from_schema (structure)
  → convert_to_component (make reusable)
  → add_component_property (add props)
  → bind_text_to_property (bind nested text)
  → set_nested_instance_exposure (expose nested instances)
  → apply_responsive_pattern (fix sizing)
  → validate_responsive_layout (check for issues)
  → get_instance_properties (discover actual keys)
  → get_screenshot (validate)
```

## Best Practices

1. **Design system first** - `get_design_system` before building
2. **Use create_from_schema** - Declarative is cleaner than imperative
3. **Properties AFTER combining** - Add to ComponentSet, not variants
4. **Use property keys exactly** - Include `#ID` suffix from add_component_property
5. **Always discover keys** - `get_instance_properties` before setting overrides
6. **Auto-expose icons** - Use `autoExposeInstances: true`
7. **Validate with screenshots** - `get_screenshot` after each major step
8. **Bind to variables** - Always use design tokens
9. **Instance swaps over visibility** - Avoid visibility toggle collisions

---

## Core Principles

```
┌─────────────────────────────────────────────────────────────────┐
│  DESIGN TOKEN FIRST (CRITICAL)                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ❌ NEVER hardcode values:                                      │
│  fill: "#3B82F6"                                                │
│  cornerRadius: 8                                                │
│  itemSpacing: 16                                                │
│                                                                 │
│  ✅ ALWAYS use variable binding with fallback:                  │
│  fill: "@Interactive/Primary | #3B82F6"                         │
│  cornerRadius: "@Radius/md | 8"                                 │
│  spacing: "@Spacing/4 | 16"                                     │
│                                                                 │
│  The fallback after | is used when variable doesn't exist       │
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
│  Why:                                                           │
│  • Catches layout issues immediately                            │
│  • Verifies variable bindings resolved correctly                │
│  • Confirms visual appearance matches intent                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────┐
│  TOOLS ONLY, NEVER SCRIPTS                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  If a tool doesn't exist for an operation:                      │
│  1. Check if existing tools can be composed                     │
│  2. Request a new tool be created                               │
│  3. execute_figma_script is LAST RESORT only                    │
│                                                                 │
│  Why: Tools are discoverable, versioned, documented.            │
│  Scripts are opaque and unmaintainable.                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Atomic ComponentSet Creation (Recommended)

Instead of the manual multi-step process, use `create_component_set_with_properties`:

```javascript
create_component_set_with_properties({
  name: "Button",
  variants: [
    { name: "State=Default" },
    { name: "State=Hover" },
    { name: "State=Pressed" }
  ],
  properties: [
    {
      name: "Label",
      type: "TEXT",
      defaultValue: "Button",
      bindings: [{ nodeName: "Label", nodeProperty: "characters" }]
    },
    {
      name: "ShowIcon",
      type: "BOOLEAN",
      defaultValue: true,
      bindings: [{ nodeName: "Icon", nodeProperty: "visible" }]
    }
  ]
})
```

This handles the correct order automatically:
1. Create variant components
2. Combine into ComponentSet
3. Add properties to ComponentSet
4. Bind nested nodes

---

## Bottom-Up Construction with wrap_in_container

```
┌─────────────────────────────────────────────────────────────────┐
│  BOTTOM-UP CONSTRUCTION PATTERN                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Build innermost elements first, then wrap progressively:       │
│                                                                 │
│  1. Create Icon Placeholder (56×56 rectangle)                   │
│  2. Wrap in Icon Container (96×96 fixed)                        │
│     → wrappedNodesLayout: "AUTO" or omit                        │
│  3. Wrap Icon Container in Icon Section                         │
│     → wrappedNodesLayout: { horizontal: "FIXED", vertical: "FIXED" }  │
│     (preserves 96×96 size)                                      │
│                                                                 │
│  DECISION TREE for wrappedNodesLayout:                          │
│  • "AUTO" → For primitives and adaptable frames                 │
│  • { FIXED, FIXED } → For containers with explicit dimensions   │
│  • { HUG, HUG } → For auto-layout frames without dimensions     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```javascript
// Wrap existing nodes in a new container
wrap_in_container({
  nodeIds: [iconContainerId],
  containerSpec: {
    name: "Icon Section",
    layoutMode: "VERTICAL",
    primaryAxisAlignItems: "CENTER",
    counterAxisAlignItems: "CENTER",
    padding: 16
  },
  // CRITICAL: Preserve fixed dimensions of wrapped node
  wrappedNodesLayout: {
    layoutSizingHorizontal: "FIXED",
    layoutSizingVertical: "FIXED"
  }
})
```

**Common mistake:** Using `"AUTO"` on a container with fixed dimensions will cause it to shrink/expand to hug its children, losing the fixed size.

---

## Template-Based Creation

Copy bindings and properties from a template node:

```javascript
// Copy only bindings (variables, text, instance swap)
copy_bindings({
  sourceNodeId: templateId,
  targetNodeId: newNodeId,
  bindingTypes: ["variables", "text", "instanceSwap"]
})

// Copy ALL properties (bindings + direct properties like opacity, layout)
copy_all_properties({
  sourceNodeId: templateId,
  targetNodeId: newNodeId,
  includeTypes: ["bindings", "direct"]
})
```

---

## Wrapping Auto-Layout (Tag Clouds, Chip Lists)

```javascript
create_auto_layout({
  name: "Tag Cloud",
  layoutMode: "HORIZONTAL",
  layoutWrap: "WRAP",              // Enable wrapping (HORIZONTAL only)
  itemSpacing: 8,                  // Horizontal gap between items
  counterAxisSpacing: 8,           // Vertical gap between rows
  counterAxisAlignContent: "AUTO"  // or "SPACE_BETWEEN" for distributed rows
})
```

**In add_children or create_from_schema:**
```javascript
{
  type: "AutoLayout",
  name: "Tags",
  direction: "horizontal",
  layoutWrap: "WRAP",
  spacing: 8,
  counterAxisSpacing: 8,
  children: [
    { type: "Text", name: "Tag1", content: "Design" },
    { type: "Text", name: "Tag2", content: "Systems" },
    { type: "Text", name: "Tag3", content: "Tokens" }
  ]
}
```

---

## Overlapping Elements (Avatar Stacks)

```javascript
create_auto_layout({
  name: "Avatar Stack",
  layoutMode: "HORIZONTAL",
  itemSpacing: -12,           // Negative spacing for overlap
  itemReverseZIndex: true     // First avatar drawn on TOP (front)
})
```

---

## Advanced: Command Registry Workflows

For complex multi-step operations, use `execute_workflow` with the Command Registry:

```javascript
// Discover available commands first
discover_commands({ category: "creation" })
// Categories: creation, query, modification, hierarchy, layout, visual, text, utility, meta
```

```javascript
// Example: Create a button with workflow
execute_workflow({
  commands: [
    { command: "createFrame", params: { name: "Button" }, as: "frame" },
    { command: "setAutoLayout", params: {
      nodeId: "$frame.id",  // Variable interpolation
      layoutMode: "HORIZONTAL",
      padding: 16,
      itemSpacing: 8
    }},
    { command: "setFill", params: { nodeId: "$frame.id", color: "#007AFF" } },
    { command: "setCornerRadius", params: { nodeId: "$frame.id", radius: 8 } },
    { command: "createText", params: { characters: "Click me", fontSize: 14 }, as: "label" },
    { command: "appendChild", params: { parentId: "$frame.id", childId: "$label.id" } }
  ]
})
```

**Variable interpolation syntax:**
- `$name.property` → Reference named results (e.g., `$frame.id`)
- `$0.result`, `$1.result` → Reference by step index
- `$component.children[0].id` → Nested paths supported

**65+ commands available:** createFrame, createRectangle, createText, createComponent, setAutoLayout, setFill, setStroke, appendChild, bindVariable, createInstance, and many more.

---

## References

- For component property patterns, see [references/component-properties.md](references/component-properties.md)
- For variant patterns, see [references/variant-patterns.md](references/variant-patterns.md)
