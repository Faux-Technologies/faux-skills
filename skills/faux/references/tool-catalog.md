# Tool Catalog

All 71 Faux MCP tools organized by category.

---

## Top-Level Tools (19 tools)

These tools are directly available via MCP tool calls.

### Read Tools (5)

| Tool | Description |
|------|-------------|
| `get_design_system` | Get all variables, text styles, and design tokens. Returns `libraryCollections` and `libraryVariables` from team libraries. Use first to understand what exists. |
| `get_page_structure` | Get the canvas structure showing frames and their hierarchy. Use to understand what's on the canvas. |
| `get_components` | List all components and component sets available for reuse. Check before creating new components. |
| `get_node_details` | Inspect a specific node's properties. Use `resolveBindings: true` to see variable bindings. Use `outputFormat: "schema"` for create_from_schema-compatible output. |
| `get_screenshot` | Capture visual screenshot of a node. Auto-scales large frames (default maxWidth: 1200px). Returns JPG by default. |

### Write Tools (4)

| Tool | Description |
|------|-------------|
| `create_from_schema` | Create UI from declarative JSON schema. Supports `@Variable` bindings, `$instance`, `$icon`, `$image`, `$textStyle`, `$expose`. The most powerful tool. |
| `create_variables` | Create design tokens with multi-mode support (Light/Dark). Use `modes` array and `values` object for themed variables. |
| `create_text_styles` | Create typography styles. Define font family, size, weight, line height, letter spacing. |
| `modify_nodes` | Batch-modify properties on existing nodes. Supports `@Variable` bindings for fills/strokes. |

### Prototype Tools (4)

| Tool | Description |
|------|-------------|
| `connect_nodes` | Wire prototype connections between nodes. Accepts names or IDs. Supports navigation, overlays, back, close, external URLs. |
| `get_connections` | Read existing prototype connections from nodes. |
| `update_connections` | Update existing connections (change animation, destination, trigger). |
| `disconnect_nodes` | Remove prototype connections from nodes. |

### Refine Tools (5)

| Tool | Description |
|------|-------------|
| `find_nodes_by_name` | Locate nodes by name pattern. Supports regex matching. |
| `query_nodes` | CSS-like selector queries. Type, attribute, structural, pseudo-class selectors. |
| `bind_variables` | Wire up variable bindings to existing nodes. Use when you need to bind after creation. |
| `delete_node` | Remove nodes from the canvas. |
| `move_nodes` | Reparent or reposition nodes. |

### Meta Tools (1)

| Tool | Description |
|------|-------------|
| `execute_workflow` | Run any command sequence. Access to 47+ additional commands. |

---

## Additional Commands via execute_workflow

Use `execute_workflow` to access these commands:

```json
{"commands": [{"command": "command_name", "params": {...}}]}
```

### Read (Inspection)

| Command | Description |
|---------|-------------|
| `get_component_structure` | Component hierarchy map |
| `get_component_properties` | Component property definitions |
| `get_instance_properties` | Instance property values |
| `get_nested_instance_tree` | Deep instance hierarchy |
| `get_variables` | List variables (prefer `get_design_system`) |
| `get_variable_collections` | List variable collections |
| `get_text_segments` | Text segments with mixed styles |
| `get_selection` | Current selection state |
| `get_viewport` | Current viewport position/zoom |
| `get_flow_starting_points` | Prototype flow starting points |

### Component & Instance

| Command | Description |
|---------|-------------|
| `create_instance` | Create single instance (prefer `$instance` in schemas) |
| `create_multiple_instances` | Create multiple instances at once |
| `set_instance_properties` | Edit instance properties post-creation |
| `swap_component` | Swap an instance to a different component |
| `detach_instance` | Detach instance from component |
| `convert_to_component` | Convert frame to component |
| `add_component_property` | Add property to component |
| `edit_component_property` | Edit existing component property |
| `delete_component_property` | Remove component property |
| `expose_as_component_property` | Expose child property on component |
| `add_variant_to_component_set` | Add variant to ComponentSet |

### Variable & Style

| Command | Description |
|---------|-------------|
| `create_variable_collection` | Create new variable collection |
| `update_variable` | Update variable values |
| `delete_variable` | Delete a variable |
| `delete_variable_collection` | Delete a collection |
| `set_variable_mode` | Switch variable mode on a frame |
| `apply_gradient_fill` | Apply gradient with variable support |

### Layout & Node

| Command | Description |
|---------|-------------|
| `resize_node` | Resize a node |
| `clone_node` | Duplicate a node |
| `flatten_node` | Flatten node to vector |
| `group_nodes` | Group nodes together |
| `ungroup_nodes` | Ungroup nodes |
| `wrap_in_container` | Wrap nodes in auto-layout frame |
| `align_nodes` | Align nodes relative to each other |
| `reorder_children` | Reorder children in a parent |
| `add_children` | Add existing nodes as children |
| `set_constraints` | Set constraints on a node |

### Image

| Command | Description |
|---------|-------------|
| `import_image_from_url` | Import image from URL |
| `apply_images` | Apply image fills to existing nodes |
| `create_image_component` | Create component from image URL |
| `create_image_components` | Batch create image components |

### Icon (Server-side Iconify API)

| Command | Description |
|---------|-------------|
| `search_icons` | Search 275k+ icons across 200+ sets |
| `create_icon_component` | Create single icon component |
| `create_icons` | Batch create icon components with optional ComponentSet |

**Color in icon tools**: Use `colorVariable` (e.g., `"Tokens/Content/Primary"`) or `color` with `@Variable|fallback` syntax.

### Viewport & UI

| Command | Description |
|---------|-------------|
| `scroll_to_nodes` | Scroll viewport to nodes |
| `set_viewport_center` | Set viewport center/zoom |
| `set_selection` | Set current selection |
| `show_status` | Show status message in Figma |
| `clear_status` | Clear status message |

### Meta

| Command | Description |
|---------|-------------|
| `execute_figma_script` | Run arbitrary Figma Plugin API code |
| `signal_work_start` | Signal the start of a work session |
| `signal_work_end` | Signal the end of a work session |

---

## Tool Selection Guide

### I want to...

| Goal | Tool |
|------|------|
| Understand what exists | `get_design_system`, `get_page_structure`, `get_components` |
| Create design tokens | `create_variables` |
| Create typography | `create_text_styles` |
| Create UI | `create_from_schema` |
| Create components | `create_from_schema` with `convertToComponent: true` |
| Create component variants | `create_from_schema` with `type: "ComponentSet"` |
| Use existing components | `$instance` in `create_from_schema` |
| Add images | `$image` in `create_from_schema` |
| Add icons | `$icon` in `create_from_schema` |
| Modify existing nodes | `modify_nodes` |
| Find nodes | `find_nodes_by_name`, `query_nodes` |
| Wire prototypes | `connect_nodes` |
| Verify my work | `get_screenshot`, `get_node_details` |
| Access more commands | `execute_workflow` |

---

## Common Workflows

### Create a Design System

1. `create_variables` — Colors, spacing, radius primitives
2. `create_variables` — Semantic tokens with Light/Dark modes
3. `create_text_styles` — Typography scale

### Create Components

1. `get_design_system` — Check existing variables
2. `create_from_schema` with `convertToComponent: true` — Create component
3. Use `$expose` for editable properties
4. `get_screenshot` — Verify

### Build Screens

1. `get_components` — See available components
2. `create_from_schema` — Create screen with `$instance`, `$image`, `@Variable`
3. `connect_nodes` — Wire prototype connections
4. `get_screenshot` — Verify

### Refine Existing UI

1. `find_nodes_by_name` or `query_nodes` — Find nodes
2. `modify_nodes` — Update properties
3. `bind_variables` — Add variable bindings
4. `get_node_details` — Verify changes
