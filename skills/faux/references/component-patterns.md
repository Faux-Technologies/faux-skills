# Component Patterns Reference

Creating reusable components with variants, exposed properties, and proper composition.

---

## Basic Component Creation

To create a component, use `convertToComponent: true` as a top-level parameter (not inside the schema):

```json
{
  "schema": {
    "type": "AutoLayout",
    "direction": "horizontal",
    "spacing": 8,
    "padding": 12,
    "cornerRadius": 8,
    "fill": "@Colors/Accent|#3B82F6",
    "children": [
      {"type": "Text", "name": "Label", "content": "Button", "fill": "#FFFFFF"}
    ]
  },
  "convertToComponent": true
}
```

---

## Exposing Component Properties ($expose)

Expose layer properties as component properties. Requires `convertToComponent: true`.

### Supported Properties

| nodeProperty | Creates | Use Case |
|--------------|---------|----------|
| `visible` | BOOLEAN | Toggle layer visibility |
| `characters` | TEXT | Editable text (Text nodes only) |
| `mainComponent` | INSTANCE_SWAP | Swap nested instance (Instance nodes only) |

### Simple Form

Default value inferred from current node state:

```json
{"type": "Text", "content": "Title", "$expose": {"characters": "title"}}
{"$icon": "heart", "visible": true, "$expose": {"visible": "showIcon"}}
```

### With Explicit Default

Specify the default value:

```json
{"type": "Text", "content": "Title", "$expose": {"characters": {"name": "title", "default": "Heading"}}}
{"$icon": "heart", "visible": false, "$expose": {"visible": {"name": "showIcon", "default": false}}}
```

### Multiple Properties on Same Node

```json
{
  "type": "Text",
  "name": "Label",
  "content": "Button",
  "$expose": {
    "visible": "showLabel",
    "characters": "labelText"
  }
}
```

### Optional Elements Pattern

For toggleable elements (icons, badges), set BOTH:

```json
{
  "$icon": "star",
  "visible": false,
  "$expose": {"visible": {"name": "showStar", "default": false}}
}
```

1. `"visible": false` — Hidden by default in the component
2. `"$expose": {"visible": {...}}` — Toggleable in instances

---

## Exposing Nested Instances ($exposeInstance)

Expose ALL properties from a nested component instance to the parent:

```json
{
  "schema": {
    "type": "AutoLayout",
    "children": [
      {"$instance": "Icons", "$variant": {"Type": "Plus"}, "$exposeInstance": true, "name": "Icon"},
      {"type": "Text", "name": "Label", "content": "Button", "$expose": {"characters": "label"}}
    ]
  },
  "convertToComponent": true
}
```

When `$exposeInstance: true`:
- The nested Icons instance's **Type** variant property appears on the parent Button
- Users can switch between icon variants directly from Button's properties panel
- **All-or-nothing**: ALL properties from the nested instance are exposed

### $expose vs $exposeInstance

| Feature | `$expose` | `$exposeInstance` |
|---------|-----------|-------------------|
| Mechanism | Creates new properties linked via `componentPropertyReferences` | Sets `isExposedInstance = true` |
| Granularity | Per-property (visible, characters, mainComponent) | All-or-nothing |
| Use case | Toggle visibility, edit text, swap instances | Expose variant pickers |
| Works on | Any node type | `$instance` nodes only |

---

## ComponentSet (Variant Components)

Create variant component sets using **matrix mode**.

### Basic Structure

```json
{
  "type": "ComponentSet",
  "name": "Button",
  "matrix": {
    "DimensionName": {
      "Value1": {ROOT_OVERRIDES},
      "Value2": {ROOT_OVERRIDES}
    }
  },
  "template": {NODE_SCHEMA}
}
```

### Complete Example

```json
{
  "type": "ComponentSet",
  "name": "Button",
  "matrix": {
    "Style": {
      "Primary": {"fill": "@Colors/Accent|#3B82F6"},
      "Secondary": {"fill": "@Colors/Surface|#F3F4F6", "stroke": "@Colors/Border|#D1D5DB"}
    },
    "Size": {
      "Small": {
        "padding": {"horizontal": 12, "vertical": 6},
        "cornerRadius": 6,
        "$nodes": {"Label": {"fontSize": 14}}
      },
      "Large": {
        "padding": {"horizontal": 20, "vertical": 10},
        "cornerRadius": 10,
        "$nodes": {"Label": {"fontSize": 18}}
      }
    }
  },
  "template": {
    "type": "AutoLayout",
    "direction": "horizontal",
    "cornerRadius": 8,
    "align": "center",
    "children": [
      {"type": "Text", "name": "Label", "content": "Button", "fontSize": 16, "fill": "@Colors/Text|#171717"}
    ]
  }
}
```

This generates 4 variants (Style × Size):
- Style=Primary, Size=Small
- Style=Primary, Size=Large
- Style=Secondary, Size=Small
- Style=Secondary, Size=Large

### How Matrix Mode Works

1. **Define dimensions** (Style, Size, State, etc.) in the `matrix` object
2. **Each dimension has values** with associated property overrides
3. **Cartesian product** generates all combinations automatically
4. **Template merged with overrides** creates each variant

---

## Matrix Overrides

### Root-Level Overrides

Apply to the template root (outermost AutoLayout/Frame):

- Visual: `fill`, `stroke`, `cornerRadius`, `opacity`
- Layout: `padding`, `spacing`, `width`, `height`
- Variable bindings: `@Variable|fallback` syntax

```json
"Primary": {"fill": "@Colors/Accent|#3B82F6"}
"Secondary": {"fill": null, "stroke": "@Colors/Border|#E5E5E5"}
```

### $nodes for Child Overrides

Target named children within template:

```json
"Size": {
  "Small": {
    "padding": {"horizontal": 12, "vertical": 6},
    "$nodes": {
      "Label": {"fontSize": 14},
      "Icon": {"size": 16}
    }
  }
}
```

Nodes must have a `name` in the template to be targeted.

---

## $expose in ComponentSets

Expose properties from the template. Properties are added to the ComponentSet and linked across all variants:

```json
{
  "type": "ComponentSet",
  "name": "Button",
  "matrix": {...},
  "template": {
    "type": "AutoLayout",
    "children": [
      {"$instance": "Icons", "$variant": {"Type": "Plus"}, "$exposeInstance": true, "name": "Icon"},
      {"$icon": "star", "name": "LeftIcon", "$expose": {"visible": "showLeftIcon"}},
      {"type": "Text", "name": "Label", "content": "Button", "$expose": {"characters": "label"}}
    ]
  }
}
```

---

## Icon Button Example

```json
{
  "type": "ComponentSet",
  "name": "IconButton",
  "matrix": {
    "Variant": {
      "Default": {"fill": "@Colors/Surface|#F3F4F6"},
      "Hover": {"fill": "@Colors/SurfaceHover|#E5E7EB"},
      "Active": {"fill": "@Colors/Primary|#3B82F6"}
    },
    "Size": {
      "Small": {"width": 32, "height": 32, "$nodes": {"Icon": {"size": 16}}},
      "Medium": {"width": 40, "height": 40, "$nodes": {"Icon": {"size": 20}}}
    }
  },
  "template": {
    "type": "AutoLayout",
    "direction": "horizontal",
    "align": "center",
    "justify": "center",
    "cornerRadius": 8,
    "children": [
      {"$icon": "plus", "name": "Icon", "size": 20, "colorVariable": "Colors/Icon"}
    ]
  }
}
```

---

## Tips for ComponentSets

1. **Use 2-3 dimensions max** — More creates many variants (3×3×3 = 27 variants)
2. **Keep template simple** — Complex templates multiply complexity
3. **Use variable bindings** — Makes themes work automatically
4. **Name dimensions clearly** — They become Figma's variant property names
5. **Use `$nodes` for child overrides** — Target children by name
6. **Name your template children** — Required for `$nodes` and `$expose` to work
7. **Use `$exposeInstance`** for nested icon/button instances whose variant should be changeable from the parent

---

## Using Components ($instance)

Once created, reference components with `$instance`:

```json
{
  "$instance": "Button",
  "$variant": {"Style": "Primary", "Size": "Large"},
  "$override": {"Label": "Submit"}
}
```

- `$instance` — Name of Component or ComponentSet
- `$variant` — Variant property selection (for ComponentSets)
- `$override` — Changes text content of named child nodes
