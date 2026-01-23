# Faux-MCP Decision Tree

A guide for deciding which Figma MCP tools to use and when.

---

## Phase 1: Orientation

**Goal:** Understand what you're working with before creating anything.

```
┌─────────────────────────────────────────────────────────┐
│                    START HERE                           │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  get_design_system                                      │
│  ├── Variables (colors, spacing, radius)                │
│  ├── Text styles                                        │
│  ├── Paint styles                                       │
│  └── Effect styles                                      │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  get_page_structure                                     │
│  ├── What's already on the page?                        │
│  ├── Where is clear space?                              │
│  └── Calculate position for new elements                │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  get_components (optional)                              │
│  └── What reusable components exist?                    │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 2: Asset Preparation

**Goal:** Create or verify building blocks before construction.

### Typography Decision

```
Need text in your design?
          │
          ▼
    ┌─────────────┐
    │ Font exists?│
    └──────┬──────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
   YES          NO
     │           │
     ▼           ▼
check_font    Use fallback
_available    (Inter, SF Pro)
     │
     ▼
┌──────────────────┐
│ Text style       │
│ already exists?  │
└────────┬─────────┘
         │
   ┌─────┴─────┐
   │           │
   ▼           ▼
  YES          NO
   │           │
   ▼           ▼
 Use it    batch_create_text_styles
           (or create_text_style for single)
```

### Icons Decision

```
Need icons?
     │
     ▼
search_icons
├── prefix: lucide, heroicons, phosphor, material-symbols
├── query: "star", "arrow", etc.
└── limit: keep low (3-5)
     │
     ▼
┌─────────────────┐
│ How many icons? │
└────────┬────────┘
         │
   ┌─────┴─────┐
   │           │
   ▼           ▼
  1-2         3+
   │           │
   ▼           ▼
create_     batch_create_icons
icon_       (parallel fetching)
component
```

### Variables Decision

```
Need design tokens?
         │
         ▼
┌────────────────────┐
│ Tokens exist in    │
│ design system?     │
└─────────┬──────────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
   YES          NO
    │           │
    ▼           ▼
  Use         batch_create_variables
  existing    ├── collectionName: "Primitives" or "Tokens"
              ├── modes: ["Light", "Dark"] for themes
              └── variables: [{name, type, value}]
```

---

## Phase 3: Construction

**Goal:** Build the actual UI structure.

### Which Creation Tool?

```
┌─────────────────────────────────────────────────────────┐
│              WHAT ARE YOU BUILDING?                     │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬─────────────┐
        │             │             │             │
        ▼             ▼             ▼             ▼
   Simple         Nested        Sequential    Existing
   single         hierarchy     operations    nodes
   element                                    modification
        │             │             │             │
        ▼             ▼             ▼             ▼
   create_*       create_       execute_      batch_
   tools          from_schema   workflow      modify_nodes
```

### Detailed Tool Selection

```
┌─────────────────────────────────────────────────────────┐
│ create_from_schema                                      │
│ USE WHEN:                                               │
│ ├── Complex nested structure (cards, lists, forms)      │
│ ├── Multiple children with different types              │
│ ├── Need variable bindings inline (@Variable|fallback)  │
│ ├── Want to apply text styles ($textStyle)              │
│ └── Creating component instances ($instance, $override) │
│                                                         │
│ RETURNS: Single node with full hierarchy                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ execute_workflow                                        │
│ USE WHEN:                                               │
│ ├── Sequential operations with dependencies             │
│ ├── Need to reference previous results ($frame.id)      │
│ ├── One-off modifications to existing nodes             │
│ ├── Operations not in create_from_schema                │
│ └── Complex multi-step logic                            │
│                                                         │
│ RETURNS: Results from each step, accessible by $name    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ create_auto_layout + add_children                       │
│ USE WHEN:                                               │
│ ├── Building incrementally                              │
│ ├── Children added conditionally                        │
│ └── Simple flat structures                              │
│                                                         │
│ WORKFLOW:                                               │
│ 1. create_auto_layout → parentId                        │
│ 2. add_children with parentId                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ wrap_in_container                                       │
│ USE WHEN:                                               │
│ ├── Bottom-up construction                              │
│ ├── Grouping existing nodes                             │
│ └── Adding auto-layout to manual frames                 │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 4: Component Configuration

**Goal:** Make components reusable and configurable.

```
Created a frame/structure?
          │
          ▼
┌─────────────────────┐
│ Should it be        │
│ a component?        │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
    YES          NO
     │           │
     ▼           ▼
convert_to_    Done
component
(or use convertToComponent:true in create_from_schema)
     │
     ▼
┌─────────────────────┐
│ Add properties?     │
└──────────┬──────────┘
           │
           ▼
add_component_property
├── TEXT: editable text content
├── BOOLEAN: show/hide elements
└── INSTANCE_SWAP: swappable nested instances
           │
           ▼
bind_text_to_property (for TEXT)
bind_property_reference (for BOOLEAN visibility)
```

### Variants Decision

```
Need component variants?
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│ How many variants?                                      │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
      2-4           5+           Adding to
      variants      variants     existing set
        │             │             │
        ▼             ▼             ▼
   create_        create_       add_variant_
   component_     component_    to_component_set
   variants       set_with_
                  properties
```

---

## Phase 5: Styling & Binding

**Goal:** Apply visual polish and connect to design system.

```
┌─────────────────────────────────────────────────────────┐
│                   STYLING TOOLS                         │
└─────────────────────────────────────────────────────────┘

Variable Bindings (connect to design tokens):
├── Single: bind_variable (DEPRECATED)
└── Multiple: batch_bind_variables ← PREFERRED
    └── bindings: [{nodeId, property, variableName}]

Image Fills:
├── Single: apply_image_fill (DEPRECATED)
└── Multiple: batch_apply_images ← PREFERRED

Gradient Fills:
└── apply_gradient_fill
    ├── colors: ["#FF0000", "#0000FF"]
    └── colorVariables: for theme support

Effects (shadows, blur):
└── execute_workflow with modifyNode
    └── effects: [{type: "DROP_SHADOW", ...}]
```

---

## Phase 6: Presentation

**Goal:** Show results to user.

```
Task complete?
      │
      ▼
┌─────────────────────┐
│ clear_status        │ ← Remove "Working on..." message
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ scroll_to_node      │ ← Focus viewport on result
│ (or scroll_to_nodes │
│  for multiple)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ get_screenshot      │ ← Capture image to show user
└─────────────────────┘
```

---

## Batch vs Single Tool Heuristics

| Operation | Single | Batch (preferred for 2+) |
|-----------|--------|--------------------------|
| Create variables | create_variable | **batch_create_variables** |
| Create text styles | create_text_style | **batch_create_text_styles** |
| Create icons | create_icon_component | **batch_create_icons** |
| Bind variables | bind_variable | **batch_bind_variables** |
| Apply images | apply_image_fill | **batch_apply_images** |
| Modify nodes | modify_node | **batch_modify_nodes** |
| Set instance props | set_instance_properties | **batch_set_instance_properties** |
| Move nodes | move_node | **batch_move_nodes** |

**Rule:** Always prefer batch tools - they work for single items too and reduce API calls.

---

## Quick Reference: Tool Categories

### Discovery & Query
- `get_design_system` - Variables, styles, tokens
- `get_page_structure` - Page contents
- `get_components` - Available components
- `get_component_structure` - Node hierarchy
- `get_node_details` - Single node properties
- `find_nodes_by_name` - Search by name pattern
- `search_icons` - Find Iconify icons
- `discover_commands` - Available workflow commands

### Creation
- `create_from_schema` - Declarative UI creation
- `create_auto_layout` - Auto-layout frame
- `create_text_node` - Text element
- `create_component` - Empty component
- `create_instance` - Component instance
- `batch_create_icons` - Icon components
- `batch_create_text_styles` - Typography styles
- `batch_create_variables` - Design tokens

### Modification
- `batch_modify_nodes` - Update node properties
- `batch_bind_variables` - Connect to tokens
- `add_children` - Add nodes to parent
- `wrap_in_container` - Group nodes
- `execute_workflow` - Multi-step operations

### Components
- `convert_to_component` - Frame → Component
- `add_component_property` - Add TEXT/BOOLEAN/INSTANCE_SWAP
- `bind_text_to_property` - Connect text to property
- `bind_property_reference` - Connect visibility/opacity
- `create_component_variants` - Create variant set

### Viewport & Status
- `show_status` - Display progress message
- `clear_status` - Remove progress message
- `scroll_to_node` - Focus on node
- `set_viewport_center` - Pan/zoom viewport
- `get_screenshot` - Capture node image

---

## Example: Restaurant Card Decision Flow

```
1. ORIENTATION
   └── get_design_system → Found: Inter font, some spacing tokens
   └── get_page_structure → Empty page, place at (100, 100)

2. ASSETS
   └── check_font_available("Inter") → Available
   └── search_icons("star", prefix: "lucide") → lucide:star found
   └── batch_create_text_styles → Created 3 styles
   └── batch_create_icons → Created star, clock, map-pin

3. CONSTRUCTION
   └── create_from_schema → Chose because:
       ├── Nested structure (card > content > rows > items)
       ├── Mixed content (frames, text, instances)
       ├── Needed $textStyle and $instance
       └── convertToComponent: true

4. CONFIGURATION
   └── execute_workflow(modifyNode) → Add shadow
   └── add_component_property × 3 → Name, Cuisine, Delivery Time
   └── bind_text_to_property × 3 → Connect to text nodes

5. PRESENTATION
   └── scroll_to_node → Focus viewport
   └── get_screenshot → Show result
   └── clear_status → Clean up
```

---

*Generated from faux-mcp v2.1.1 tool usage patterns*
