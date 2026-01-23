# Figmatic Tools Improvement Roadmap

**Date:** 2026-01-22
**Purpose:** Self-contained document for implementing Figmatic tool improvements based on Figma Plugin API analysis and real-world testing.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Architecture](#current-architecture)
3. [Identified Gaps](#identified-gaps)
4. [Proposed New Tools](#proposed-new-tools)
5. [Existing Tool Enhancements](#existing-tool-enhancements)
6. [Skill Workflow Integration](#skill-workflow-integration)
7. [Implementation Details](#implementation-details)
8. [Priority Ranking](#priority-ranking)

---

## Executive Summary

After real-world testing (recreating web components in Figma) and analyzing the Figma Plugin API documentation, we identified several improvement opportunities:

**Key Findings:**
1. Tools exist but workflow doesn't enforce using them properly
2. Several powerful Figma Plugin APIs are underutilized
3. Phase 1 (Map to Design System) is the biggest manual bottleneck
4. Visual comparison/validation is entirely manual

**High-Impact Improvements:**
1. `suggest_variable_bindings` - Auto-map node values to existing tokens
2. Enhanced `get_node_details` - Full variable binding visibility
3. `get_text_segments` - Mixed-style typography extraction
4. `get_css_properties` - CSS comparison for validation

---

## Current Architecture

### Repository Structure

```
figmatic-plugin/          → Figma plugin (TypeScript, runs in Figma Desktop)
├── code.ts               → Main plugin code with Command Registry
├── manifest.json         → Plugin manifest
└── package.json

figmatic-mcp-server/      → MCP server (63+ tools for AI agents)
├── tools/
│   ├── read-tools.js     → Query tools (get_*, find_*)
│   ├── write-tools.js    → Creation tools (create_*, convert_*)
│   └── schemas.js        → Tool parameter schemas
├── index.js              → MCP server entry point
└── package.json

faux-skills/              → Claude Code skills
├── skills/
│   └── faux/
│       ├── skill.md      → Unified skill documentation
│       └── references/   → Detailed reference docs
└── cli/                  → Skill installation CLI
```

### Communication Flow

```
┌─────────────────┐     WebSocket      ┌─────────────────┐
│  Claude Code    │ ←───────────────→  │  Figma Plugin   │
│  (AI Agent)     │    localhost:8765  │  (Desktop App)  │
└────────┬────────┘                    └─────────────────┘
         │
         │ MCP Protocol
         ↓
┌─────────────────┐
│  Figmatic MCP   │
│  Server (63+    │
│  tools)         │
└─────────────────┘
```

### Current Tool Categories

| Category | Tools | Purpose |
|----------|-------|---------|
| Design System | `get_design_system`, `batch_create_variables`, `batch_create_text_styles` | Token management |
| Components | `create_from_schema`, `convert_to_component`, `add_component_property` | Component building |
| Icons | `search_icons`, `create_icon_component`, `batch_create_icons` | Icon library |
| Layout | `create_auto_layout`, `wrap_in_container`, `apply_responsive_pattern` | Layout management |
| Query | `get_node_details`, `get_component_structure`, `find_nodes_by_name` | Node inspection |
| Workflow | `execute_workflow`, `discover_commands` | Command chaining |

---

## Identified Gaps

### Gap 1: Manual Variable Matching (Phase 1 Bottleneck)

**Current Workflow:**
```
1. Extract color from web: #1C1C1C
2. Call get_design_system()
3. Manually scan through all variables
4. Find "Colors/Gray/900" has value {r: 0.11, g: 0.11, b: 0.11}
5. Calculate: 0.11 × 255 ≈ 28 → #1C1C1C ✓
6. Decide to use existing token
```

**Problem:** Step 3-5 is manual and error-prone. With 50+ tokens, this is tedious.

**Figma API Solution:** `node.inferredVariables` returns variables whose values match the node's current values.

---

### Gap 2: Incomplete Variable Binding Visibility

**Current Behavior:** `get_node_details` returns some bindings but misses:
- Typography variable bindings (fontFamily, fontSize, lineHeight, letterSpacing)
- Text range bindings (mixed-style text)
- Effect and layout grid bindings

**Figma API Solution:** `node.boundVariables` contains ALL bindings:
```javascript
node.boundVariables = {
  fills: [...],
  strokes: [...],
  effects: [...],
  layoutGrids: [...],
  characters: [...],           // Text content
  fontFamily: [...],           // Typography
  fontSize: [...],
  lineHeight: [...],
  letterSpacing: [...],
  fontWeight: [...],
  componentProperties: {...},  // Component property bindings
  textRangeFills: [...],       // Per-segment fills
}
```

---

### Gap 3: No Mixed-Style Typography Extraction

**Current Behavior:** Text extraction returns single font info, ignores mixed styles.

**Problem:** A text node with "Hello **World**" has two segments with different fontWeight.

**Figma API Solution:** `getStyledTextSegments()`:
```javascript
textNode.getStyledTextSegments([
  'fontName', 'fontSize', 'fontWeight', 'lineHeight',
  'letterSpacing', 'fills', 'boundVariables'
])
// Returns:
// [
//   { start: 0, end: 6, characters: "Hello ", fontWeight: 400, ... },
//   { start: 6, end: 11, characters: "World", fontWeight: 700, ... }
// ]
```

---

### Gap 4: No CSS Comparison for Validation

**Current Workflow:** Visual comparison is manual screenshot-to-screenshot.

**Problem:** No way to programmatically compare web CSS to Figma output.

**Figma API Solution:** `getCSSAsync()`:
```javascript
await node.getCSSAsync()
// Returns:
// {
//   "background": "linear-gradient(180deg, #191919, #242424)",
//   "border-radius": "8px",
//   "padding": "24px",
//   ...
// }
```

---

### Gap 5: Property Key Discovery is Trial-and-Error

**Current Behavior:** After creating variants, property keys drift. Must call `get_instance_properties` and guess which key controls which element.

**Figma API Solution:** `componentPropertyReferences`:
```javascript
instance.componentPropertyReferences
// Returns:
// {
//   "visible": "ShowIcon#123:456",
//   "characters": "Label#123:457",
//   "mainComponent": "Icon#123:458"
// }
// Maps node properties to component property keys directly
```

---

### Gap 6: Layout Detection for Non-Auto-Layout Frames

**Current Behavior:** Can't suggest auto-layout settings for manually arranged frames.

**Figma API Solution:** `inferredAutoLayout`:
```javascript
node.inferredAutoLayout
// Returns:
// {
//   layoutMode: "VERTICAL",
//   paddingLeft: 24,
//   paddingRight: 24,
//   paddingTop: 16,
//   paddingBottom: 16,
//   itemSpacing: 12,
//   primaryAxisAlignItems: "MIN",
//   counterAxisAlignItems: "CENTER"
// }
```

---

## Proposed New Tools

### Tool 1: `suggest_variable_bindings`

**Purpose:** Auto-map node values to existing design system tokens.

**Parameters:**
```javascript
{
  nodeId: string,           // Required: Node to analyze
  properties?: string[],    // Optional: Specific properties to check
                           // Default: ["fills", "strokes", "cornerRadius", "itemSpacing", "padding"]
  recursive?: boolean,      // Optional: Include children
                           // Default: false
}
```

**Returns:**
```javascript
{
  nodeId: "123:456",
  suggestions: {
    fills: [
      {
        variableId: "VariableID:1:100",
        variableName: "Colors/Gray/900",
        collectionName: "Primitives",
        confidence: 1.0,  // Exact match
        currentValue: { r: 0.11, g: 0.11, b: 0.11, a: 1 }
      }
    ],
    cornerRadius: [
      {
        variableId: "VariableID:1:200",
        variableName: "Radius/lg",
        collectionName: "Primitives",
        confidence: 1.0,
        currentValue: 12
      }
    ]
  },
  unmatched: ["strokes", "itemSpacing"]  // No matching variables found
}
```

**Implementation:**
```javascript
// In figmatic-plugin/code.ts - Add to Command Registry
registerCommand('suggestVariableBindings', async (params) => {
  const node = figma.getNodeById(params.nodeId);
  if (!node) throw new Error(`Node not found: ${params.nodeId}`);

  const suggestions = {};
  const properties = params.properties || ['fills', 'strokes', 'cornerRadius', 'itemSpacing'];

  for (const prop of properties) {
    if (prop in node && 'inferredVariables' in node) {
      const inferred = node.inferredVariables?.[prop];
      if (inferred && inferred.length > 0) {
        suggestions[prop] = inferred.map(v => ({
          variableId: v.id,
          variableName: v.name,
          collectionName: figma.variables.getVariableCollectionById(v.variableCollectionId)?.name,
          confidence: 1.0,
          currentValue: node[prop]
        }));
      }
    }
  }

  return { nodeId: params.nodeId, suggestions };
});
```

**MCP Tool Definition (figmatic-mcp-server/tools/read-tools.js):**
```javascript
async function suggestVariableBindings(params) {
  const result = await executeInFigma('suggestVariableBindings', {
    nodeId: params.nodeId,
    properties: params.properties,
    recursive: params.recursive
  });
  return result;
}
```

---

### Tool 2: `get_text_segments`

**Purpose:** Extract per-segment typography with variable bindings for mixed-style text.

**Parameters:**
```javascript
{
  nodeId: string,           // Required: Text node ID
  properties?: string[],    // Optional: Properties to extract
                           // Default: ["fontName", "fontSize", "fontWeight", "lineHeight",
                           //           "letterSpacing", "fills", "boundVariables"]
}
```

**Returns:**
```javascript
{
  nodeId: "123:456",
  fullText: "Hello World",
  segments: [
    {
      start: 0,
      end: 6,
      characters: "Hello ",
      fontName: { family: "Inter", style: "Regular" },
      fontSize: 16,
      fontWeight: 400,
      lineHeight: { value: 24, unit: "PIXELS" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      fills: [{ type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1 }],
      boundVariables: {
        fills: { id: "VariableID:1:100", name: "Text/Primary" }
      }
    },
    {
      start: 6,
      end: 11,
      characters: "World",
      fontName: { family: "Inter", style: "Bold" },
      fontSize: 16,
      fontWeight: 700,
      // ... rest of properties
    }
  ],
  // Summary of unique styles found
  uniqueStyles: [
    { fontName: "Inter Regular", fontSize: 16, count: 1 },
    { fontName: "Inter Bold", fontSize: 16, count: 1 }
  ]
}
```

**Implementation:**
```javascript
// In figmatic-plugin/code.ts
registerCommand('getTextSegments', async (params) => {
  const node = figma.getNodeById(params.nodeId);
  if (!node || node.type !== 'TEXT') {
    throw new Error(`Text node not found: ${params.nodeId}`);
  }

  const properties = params.properties || [
    'fontName', 'fontSize', 'fontWeight', 'lineHeight',
    'letterSpacing', 'fills', 'boundVariables'
  ];

  const segments = node.getStyledTextSegments(properties);

  return {
    nodeId: params.nodeId,
    fullText: node.characters,
    segments: segments.map(seg => ({
      start: seg.start,
      end: seg.end,
      characters: node.characters.substring(seg.start, seg.end),
      ...properties.reduce((acc, prop) => {
        acc[prop] = seg[prop];
        return acc;
      }, {})
    }))
  };
});
```

---

### Tool 3: `get_css_properties`

**Purpose:** Get CSS-like properties for comparison with web CSS.

**Parameters:**
```javascript
{
  nodeId: string,           // Required: Node ID
  includeChildren?: boolean // Optional: Include children CSS
                           // Default: false
}
```

**Returns:**
```javascript
{
  nodeId: "123:456",
  nodeName: "Card",
  css: {
    "width": "320px",
    "height": "auto",
    "background": "linear-gradient(180deg, #191919 0%, #242424 100%)",
    "border-radius": "12px",
    "padding": "24px",
    "display": "flex",
    "flex-direction": "column",
    "gap": "16px",
    "box-shadow": "0px 4px 12px rgba(0, 0, 0, 0.1)"
  }
}
```

**Implementation:**
```javascript
// In figmatic-plugin/code.ts
registerCommand('getCSSProperties', async (params) => {
  const node = figma.getNodeById(params.nodeId);
  if (!node) throw new Error(`Node not found: ${params.nodeId}`);

  if (!('getCSSAsync' in node)) {
    throw new Error(`Node type ${node.type} does not support getCSSAsync`);
  }

  const css = await node.getCSSAsync();

  return {
    nodeId: params.nodeId,
    nodeName: node.name,
    css
  };
});
```

---

### Tool 4: `get_inferred_layout`

**Purpose:** Detect auto-layout settings for non-auto-layout frames.

**Parameters:**
```javascript
{
  nodeId: string  // Required: Frame node ID
}
```

**Returns:**
```javascript
{
  nodeId: "123:456",
  currentLayoutMode: "NONE",  // Current state
  inferredLayout: {
    layoutMode: "VERTICAL",
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 16,
    paddingBottom: 16,
    itemSpacing: 12,
    primaryAxisSizingMode: "AUTO",
    counterAxisSizingMode: "FIXED",
    primaryAxisAlignItems: "MIN",
    counterAxisAlignItems: "CENTER",
    layoutWrap: "NO_WRAP"
  },
  recommendation: "Convert to auto-layout with VERTICAL direction"
}
```

**Implementation:**
```javascript
// In figmatic-plugin/code.ts
registerCommand('getInferredLayout', async (params) => {
  const node = figma.getNodeById(params.nodeId);
  if (!node) throw new Error(`Node not found: ${params.nodeId}`);

  if (!('inferredAutoLayout' in node)) {
    throw new Error(`Node type ${node.type} does not support inferredAutoLayout`);
  }

  return {
    nodeId: params.nodeId,
    currentLayoutMode: node.layoutMode || 'NONE',
    inferredLayout: node.inferredAutoLayout
  };
});
```

---

## Existing Tool Enhancements

### Enhancement 1: `get_node_details` - Full Variable Bindings

**Current:** Returns partial `boundVariables`.

**Enhanced:** Return complete `boundVariables` including typography.

**Changes to figmatic-plugin/code.ts:**
```javascript
// In getNodeDetails command, enhance the boundVariables extraction:
const getFullBoundVariables = (node) => {
  const bindings = {};
  const bindableProperties = [
    'fills', 'strokes', 'effects', 'layoutGrids',
    'opacity', 'cornerRadius', 'topLeftRadius', 'topRightRadius',
    'bottomLeftRadius', 'bottomRightRadius',
    'width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
    'itemSpacing', 'counterAxisSpacing',
    'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
    // Typography (for text nodes)
    'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
    'paragraphSpacing', 'paragraphIndent',
    // Text content
    'characters'
  ];

  for (const prop of bindableProperties) {
    if (node.boundVariables?.[prop]) {
      bindings[prop] = node.boundVariables[prop];
    }
  }

  return bindings;
};
```

---

### Enhancement 2: `get_instance_properties` - Property References

**Current:** Returns property values only.

**Enhanced:** Include `componentPropertyReferences` for nested nodes.

**Changes:**
```javascript
// Add to getInstanceProperties command:
const getPropertyReferences = (instance) => {
  const refs = {};

  const traverse = (node, path = []) => {
    if ('componentPropertyReferences' in node && node.componentPropertyReferences) {
      for (const [prop, key] of Object.entries(node.componentPropertyReferences)) {
        refs[path.join('/') || '$self'] = refs[path.join('/') || '$self'] || {};
        refs[path.join('/') || '$self'][prop] = key;
      }
    }

    if ('children' in node) {
      for (const child of node.children) {
        traverse(child, [...path, child.name]);
      }
    }
  };

  traverse(instance);
  return refs;
};

// Include in response:
return {
  instanceId: params.instanceId,
  componentProperties: instance.componentProperties,
  propertyReferences: getPropertyReferences(instance),  // NEW
  // ... rest
};
```

---

### Enhancement 3: `create_from_schema` - Auto-suggest Variables

**Current:** Uses `@Variable | fallback` syntax, fails silently if variable not found.

**Enhanced:**
1. Warn when variable not found
2. Suggest similar variables from design system
3. Option to auto-bind using `inferredVariables`

**Changes:**
```javascript
// Add warning when variable not found:
const resolveVariable = (variableName, fallback, property) => {
  const variable = findVariableByName(variableName);
  if (!variable) {
    console.warn(`Variable "${variableName}" not found for ${property}, using fallback: ${fallback}`);

    // Suggest similar variables
    const similar = findSimilarVariables(variableName);
    if (similar.length > 0) {
      console.warn(`Similar variables: ${similar.map(v => v.name).join(', ')}`);
    }

    return { resolved: false, fallback };
  }
  return { resolved: true, variable };
};
```

---

## Skill Workflow Integration

### Updated Web-to-Figma Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  WEB-TO-FIGMA WORKFLOW (ENHANCED)                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PHASE 0: EXTRACT FROM WEB                                                  │
│  ─────────────────────────                                                  │
│  1. screenshot_by_selector     → Visual reference                           │
│  2. get_element_tree           → DOM structure                              │
│  3. get_typography_map         → Fonts, sizes, weights                      │
│  4. get_color_palette          → Colors by usage                            │
│  5. get_spacing_map            → Padding, margins, gaps                     │
│  6. get_layout_analysis        → Flex/grid properties                       │
│  7. evaluate_expression        → Extract text content                       │
│                                                                             │
│  PHASE 1: MAP TO DESIGN SYSTEM (ENHANCED)                                   │
│  ─────────────────────────────────────────                                  │
│  8.  get_design_system         → Cache existing tokens                      │
│  9.  get_components            → Check existing components                  │
│  10. [NEW] Build test frame with extracted values                           │
│  11. [NEW] suggest_variable_bindings → Auto-map to tokens                   │
│  12. Decide: reuse existing OR create new                                   │
│                                                                             │
│  PHASE 2: CREATE MISSING ASSETS                                             │
│  ─────────────────────────────                                              │
│  13. batch_create_icons        → Icons FIRST                                │
│  14. batch_create_text_styles  → Typography                                 │
│  15. batch_create_variables    → New tokens if needed                       │
│                                                                             │
│  PHASE 3: BUILD COMPONENT                                                   │
│  ─────────────────────────────                                              │
│  16. create_from_schema        → Build with @Variable bindings              │
│  17. convert_to_component      → Add properties                             │
│                                                                             │
│  PHASE 4: VALIDATE (ENHANCED)                                               │
│  ─────────────────────────────                                              │
│  18. get_screenshot            → Figma output                               │
│  19. [NEW] get_css_properties  → Compare CSS values                         │
│  20. Compare with original                                                  │
│  21. Iterate on differences                                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Skill Documentation Updates

**Add to `faux/skill.md` Phase 1 section:**
```markdown
### Phase 1: Map to Design System (Enhanced)

**Step 10-11: Auto-map to existing tokens**
```javascript
// Create a test frame with extracted values
create_from_schema({
  schema: {
    type: "AutoLayout",
    fill: "#1C1C1C",           // Raw extracted value
    cornerRadius: 12,          // Raw extracted value
    // ... other extracted values
  }
})

// Auto-suggest variable bindings
suggest_variable_bindings({ nodeId: testFrameId })
// Returns: {
//   fills: [{ variableName: "Colors/Gray/900", confidence: 1.0 }],
//   cornerRadius: [{ variableName: "Radius/lg", confidence: 1.0 }]
// }

// If matches found with high confidence, bind them
batch_bind_variables({
  bindings: suggestedBindings.map(s => ({
    nodeId: testFrameId,
    property: s.property,
    variableName: s.variableName
  }))
})
```

**Decision tree:**
- Confidence 1.0 (exact match) → Use existing token
- Confidence 0.9+ (close match) → Review and decide
- No match → Create new token in Phase 2
```

**Add to validation section:**
```markdown
### Phase 4: Validate (Enhanced)

**CSS Comparison:**
```javascript
// Get Figma CSS output
get_css_properties({ nodeId: componentId })
// Returns: { "background": "#1C1C1C", "border-radius": "12px", ... }

// Compare with extracted web CSS
// - background: ✓ matches
// - border-radius: ✓ matches
// - padding: ✗ 24px vs 28px (need to fix)
```
```

---

## Implementation Details

### File Changes Summary

| File | Changes |
|------|---------|
| `figmatic-plugin/code.ts` | Add 4 new commands to Command Registry |
| `figmatic-mcp-server/tools/read-tools.js` | Add 4 new tool handlers |
| `figmatic-mcp-server/tools/schemas.js` | Add 4 new tool schemas |
| `faux-skills/skills/faux/skill.md` | Update workflow documentation |

### Command Registry Additions (code.ts)

```typescript
// Add to Command Registry section (around line 3000+)

// 1. suggestVariableBindings
registerCommand('suggestVariableBindings', async (params: {
  nodeId: string;
  properties?: string[];
  recursive?: boolean;
}) => {
  const node = figma.getNodeById(params.nodeId);
  if (!node) throw new Error(`Node not found: ${params.nodeId}`);

  const properties = params.properties || [
    'fills', 'strokes', 'cornerRadius', 'itemSpacing',
    'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'
  ];

  const suggestions: Record<string, any[]> = {};
  const unmatched: string[] = [];

  if ('inferredVariables' in node) {
    for (const prop of properties) {
      const inferred = (node as any).inferredVariables?.[prop];
      if (inferred && inferred.length > 0) {
        suggestions[prop] = inferred.map((v: Variable) => ({
          variableId: v.id,
          variableName: v.name,
          collectionName: figma.variables.getVariableCollectionById(v.variableCollectionId)?.name,
          confidence: 1.0
        }));
      } else {
        unmatched.push(prop);
      }
    }
  }

  return { nodeId: params.nodeId, suggestions, unmatched };
});

// 2. getTextSegments
registerCommand('getTextSegments', async (params: {
  nodeId: string;
  properties?: string[];
}) => {
  const node = figma.getNodeById(params.nodeId);
  if (!node || node.type !== 'TEXT') {
    throw new Error(`Text node not found: ${params.nodeId}`);
  }

  const props = params.properties || [
    'fontName', 'fontSize', 'fontWeight', 'lineHeight',
    'letterSpacing', 'fills', 'boundVariables'
  ];

  // @ts-ignore - getStyledTextSegments exists on TextNode
  const segments = node.getStyledTextSegments(props);

  return {
    nodeId: params.nodeId,
    fullText: node.characters,
    segments: segments.map((seg: any) => ({
      start: seg.start,
      end: seg.end,
      characters: node.characters.substring(seg.start, seg.end),
      fontName: seg.fontName,
      fontSize: seg.fontSize,
      fontWeight: seg.fontWeight,
      lineHeight: seg.lineHeight,
      letterSpacing: seg.letterSpacing,
      fills: seg.fills,
      boundVariables: seg.boundVariables
    }))
  };
});

// 3. getCSSProperties
registerCommand('getCSSProperties', async (params: {
  nodeId: string;
}) => {
  const node = figma.getNodeById(params.nodeId);
  if (!node) throw new Error(`Node not found: ${params.nodeId}`);

  if (!('getCSSAsync' in node)) {
    throw new Error(`Node type ${node.type} does not support getCSSAsync`);
  }

  // @ts-ignore - getCSSAsync exists on supported node types
  const css = await node.getCSSAsync();

  return {
    nodeId: params.nodeId,
    nodeName: node.name,
    css
  };
});

// 4. getInferredLayout
registerCommand('getInferredLayout', async (params: {
  nodeId: string;
}) => {
  const node = figma.getNodeById(params.nodeId);
  if (!node) throw new Error(`Node not found: ${params.nodeId}`);

  if (!('inferredAutoLayout' in node)) {
    return {
      nodeId: params.nodeId,
      supported: false,
      message: `Node type ${node.type} does not support inferredAutoLayout`
    };
  }

  return {
    nodeId: params.nodeId,
    currentLayoutMode: (node as FrameNode).layoutMode || 'NONE',
    inferredLayout: (node as any).inferredAutoLayout
  };
});
```

### MCP Tool Definitions (read-tools.js)

```javascript
// Add to read-tools.js

async function suggest_variable_bindings(params) {
  const { nodeId, properties, recursive } = params;

  const result = await executeInFigma('suggestVariableBindings', {
    nodeId,
    properties,
    recursive
  });

  return formatResponse('suggest_variable_bindings', result);
}

async function get_text_segments(params) {
  const { nodeId, properties } = params;

  const result = await executeInFigma('getTextSegments', {
    nodeId,
    properties
  });

  return formatResponse('get_text_segments', result);
}

async function get_css_properties(params) {
  const { nodeId } = params;

  const result = await executeInFigma('getCSSProperties', { nodeId });

  return formatResponse('get_css_properties', result);
}

async function get_inferred_layout(params) {
  const { nodeId } = params;

  const result = await executeInFigma('getInferredLayout', { nodeId });

  return formatResponse('get_inferred_layout', result);
}

// Export
module.exports = {
  // ... existing exports
  suggest_variable_bindings,
  get_text_segments,
  get_css_properties,
  get_inferred_layout
};
```

### Tool Schemas (schemas.js)

```javascript
// Add to schemas.js

const suggestVariableBindingsSchema = {
  name: 'suggest_variable_bindings',
  description: 'Auto-suggest design system variables that match node property values using Figma\'s inferredVariables API. Returns matching variables with confidence scores for fills, strokes, cornerRadius, spacing, and padding.',
  parameters: {
    type: 'object',
    properties: {
      nodeId: {
        type: 'string',
        description: 'Node ID to analyze'
      },
      properties: {
        type: 'array',
        items: { type: 'string' },
        description: 'Properties to check. Default: fills, strokes, cornerRadius, itemSpacing, padding*'
      },
      recursive: {
        type: 'boolean',
        default: false,
        description: 'Include children in analysis'
      },
      _intent_micro: { type: 'string' },
      _intent_meso: { type: 'string' },
      _intent_macro: { type: 'string' }
    },
    required: ['nodeId', '_intent_micro', '_intent_meso', '_intent_macro']
  }
};

const getTextSegmentsSchema = {
  name: 'get_text_segments',
  description: 'Extract per-segment typography from text nodes, including mixed styles and variable bindings. Uses Figma\'s getStyledTextSegments API.',
  parameters: {
    type: 'object',
    properties: {
      nodeId: {
        type: 'string',
        description: 'Text node ID'
      },
      properties: {
        type: 'array',
        items: { type: 'string' },
        description: 'Properties to extract. Default: fontName, fontSize, fontWeight, lineHeight, letterSpacing, fills, boundVariables'
      },
      _intent_micro: { type: 'string' },
      _intent_meso: { type: 'string' },
      _intent_macro: { type: 'string' }
    },
    required: ['nodeId', '_intent_micro', '_intent_meso', '_intent_macro']
  }
};

const getCSSPropertiesSchema = {
  name: 'get_css_properties',
  description: 'Get CSS-like properties for a node. Useful for comparing Figma output with web CSS. Uses Figma\'s getCSSAsync API.',
  parameters: {
    type: 'object',
    properties: {
      nodeId: {
        type: 'string',
        description: 'Node ID'
      },
      _intent_micro: { type: 'string' },
      _intent_meso: { type: 'string' },
      _intent_macro: { type: 'string' }
    },
    required: ['nodeId', '_intent_micro', '_intent_meso', '_intent_macro']
  }
};

const getInferredLayoutSchema = {
  name: 'get_inferred_layout',
  description: 'Detect auto-layout settings for non-auto-layout frames. Returns suggested layoutMode, padding, spacing, and alignment. Uses Figma\'s inferredAutoLayout API.',
  parameters: {
    type: 'object',
    properties: {
      nodeId: {
        type: 'string',
        description: 'Frame node ID'
      },
      _intent_micro: { type: 'string' },
      _intent_meso: { type: 'string' },
      _intent_macro: { type: 'string' }
    },
    required: ['nodeId', '_intent_micro', '_intent_meso', '_intent_macro']
  }
};
```

---

## Priority Ranking

### High Priority (Implement First)

| Tool | Impact | Effort | Rationale |
|------|--------|--------|-----------|
| `suggest_variable_bindings` | High | Medium | Biggest workflow bottleneck (Phase 1 manual matching) |
| Enhanced `get_node_details` | High | Low | Just add more properties to existing tool |

### Medium Priority

| Tool | Impact | Effort | Rationale |
|------|--------|--------|-----------|
| `get_text_segments` | Medium | Medium | Needed for mixed-style text recreation |
| `get_css_properties` | Medium | Low | Simple API, useful for validation |
| Enhanced `get_instance_properties` | Medium | Low | Reduces property key guessing |

### Low Priority

| Tool | Impact | Effort | Rationale |
|------|--------|--------|-----------|
| `get_inferred_layout` | Low | Low | Nice-to-have for legacy frame conversion |

---

## Testing Checklist

After implementing each tool:

- [ ] `suggest_variable_bindings`
  - [ ] Returns matching variables for fills
  - [ ] Returns matching variables for cornerRadius
  - [ ] Returns matching variables for spacing
  - [ ] Returns empty for unmatched properties
  - [ ] Works with recursive flag

- [ ] `get_text_segments`
  - [ ] Extracts single-style text correctly
  - [ ] Extracts mixed-style text with correct segments
  - [ ] Includes boundVariables per segment
  - [ ] Handles missing fonts gracefully

- [ ] `get_css_properties`
  - [ ] Returns valid CSS for frames
  - [ ] Returns valid CSS for text nodes
  - [ ] Handles gradients correctly
  - [ ] Handles shadows correctly

- [ ] `get_inferred_layout`
  - [ ] Returns layout suggestion for non-auto-layout frame
  - [ ] Returns current layout for auto-layout frame
  - [ ] Handles unsupported node types

- [ ] Enhanced `get_node_details`
  - [ ] Returns typography boundVariables
  - [ ] Returns all property bindings

- [ ] Enhanced `get_instance_properties`
  - [ ] Returns componentPropertyReferences
  - [ ] Maps nested node properties to keys

---

## Appendix: Figma Plugin API Reference

### inferredVariables

```typescript
interface SceneNode {
  inferredVariables: {
    [field: string]: Variable[];
  } | null;
}
```

Returns variables whose values match the node's current property values. Only available when the node has properties that could be bound to variables.

### getStyledTextSegments

```typescript
interface TextNode {
  getStyledTextSegments<K extends keyof StyledTextSegment>(
    fields: K[]
  ): Array<Pick<StyledTextSegment, K> & { start: number; end: number }>;
}

interface StyledTextSegment {
  fontName: FontName;
  fontSize: number;
  fontWeight: number;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
  fills: Paint[];
  boundVariables: {
    [field: string]: VariableAlias;
  };
  // ... more properties
}
```

### getCSSAsync

```typescript
interface SceneNode {
  getCSSAsync(): Promise<{ [key: string]: string }>;
}
```

Returns CSS properties as a key-value object. Keys are CSS property names, values are CSS values as strings.

### inferredAutoLayout

```typescript
interface FrameNode {
  inferredAutoLayout: InferredAutoLayoutResult | null;
}

interface InferredAutoLayoutResult {
  layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL' | 'GRID';
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  itemSpacing: number;
  counterAxisSpacing: number | null;
  primaryAxisSizingMode: 'FIXED' | 'AUTO';
  counterAxisSizingMode: 'FIXED' | 'AUTO';
  primaryAxisAlignItems: 'MIN' | 'MAX' | 'CENTER' | 'SPACE_BETWEEN';
  counterAxisAlignItems: 'MIN' | 'MAX' | 'CENTER' | 'BASELINE';
  layoutWrap: 'NO_WRAP' | 'WRAP';
  // ... more properties
}
```

### boundVariables

```typescript
interface SceneNode {
  boundVariables: {
    [field: string]: VariableAlias | VariableAlias[];
  };
}

// Bindable fields include:
// - fills, strokes, effects, layoutGrids
// - opacity, cornerRadius, width, height
// - itemSpacing, counterAxisSpacing
// - paddingLeft, paddingRight, paddingTop, paddingBottom
// - fontFamily, fontSize, fontWeight, lineHeight, letterSpacing (TextNode)
// - characters (TextNode)
// - componentProperties (InstanceNode)
```

---

## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-22 | Claude | Initial document based on API analysis and testing |
