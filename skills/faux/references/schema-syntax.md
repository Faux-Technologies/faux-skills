# create_from_schema Reference

Declarative Figma UI creation. Learn the primitives once, use them everywhere.

---

## Primitives

### Fill Primitive

Applies to: any node's `fill`, any node's `stroke`, icon `color`

```json
"#FF6B5B"                          // hex color
{"r": 1, "g": 0.4, "b": 0.35}     // RGBA object (0-1 range)
"@Collection/Variable|#fallback"   // variable binding with fallback
null                               // remove fill
"none"                             // no fill (alias for null)
"transparent"                      // no fill (alias for null)
```

Gradients:
```json
{"type": "linear", "angle": 135, "stops": [{"color": "#FF6B5B", "position": 0}, {"color": "#4ECDC4", "position": 1}]}
{"type": "radial", "stops": [{"color": "#FFF", "position": 0}, {"color": "#000", "position": 1}]}
```

Gradient types: `linear`, `radial`, `angular`, `diamond`

### Size Primitive

Applies to: `width`, `height`

```json
300                  // fixed pixels
"hug-contents"       // fit to children
"fill-parent"        // fill available space (parent must have constraint)
```

### Spacing Primitive

Applies to: `padding`, `spacing`, `cornerRadius`

```json
16                                                    // uniform
{"horizontal": 20, "vertical": 16}                   // axis-based
{"top": 10, "right": 20, "bottom": 10, "left": 20}  // per-side
{"topLeft": 16, "topRight": 16, "bottomLeft": 0, "bottomRight": 0}  // per-corner (for cornerRadius)
```

### Variable Binding Primitive

Pattern: `@CollectionName/VariableName|fallback`

```json
"@Colors/Primary|#3B82F6"
"@Tokens/Surface/Primary|#FFFFFF"
"@Primitives/Radius/L|16"
```

Applies to: `fill`, `stroke`, `cornerRadius`, `padding`, `spacing`, `fontSize`, `lineHeight`, `letterSpacing`, `fontFamily`, `fontWeight`, icon `color`

---

## Node Types

### Common Properties

Apply to all node types:

```json
{
  "name": "Node Name",
  "width": SIZE,
  "height": SIZE,
  "fill": FILL,
  "stroke": FILL,
  "strokeWidth": 1,
  "cornerRadius": SPACING,
  "opacity": 0.5,
  "rotation": 45,
  "minWidth": 100,
  "maxWidth": 500,
  "minHeight": 50,
  "maxHeight": 300,
  "visible": true
}
```

### AutoLayout (default type)

The default type when `type` is omitted.

```json
{
  "type": "AutoLayout",
  "direction": "horizontal|vertical",
  "spacing": SPACING | "auto",
  "padding": SPACING,
  "justify": "start|center|end|space-between",
  "align": "start|center|end|stretch",
  "children": []
}
```

`spacing: "auto"` maps to `justify: "space-between"`.

### Frame

Non-auto-layout container.

```json
{"type": "Frame", "width": 200, "height": 200, "fill": FILL, "children": []}
```

### Text

```json
{
  "type": "Text",
  "content": "Hello",
  "fontSize": 16,
  "fontWeight": "Regular|Medium|SemiBold|Bold",
  "fontFamily": "Inter",
  "fill": FILL,
  "textAlign": "left|center|right|justified",
  "textAlignVertical": "TOP|CENTER|BOTTOM",
  "letterSpacing": 0.5,
  "lineHeight": 24,
  "paragraphSpacing": 16,
  "textCase": "ORIGINAL|UPPER|LOWER|TITLE",
  "textDecoration": "NONE|UNDERLINE|STRIKETHROUGH",
  "textAutoResize": "WIDTH_AND_HEIGHT|HEIGHT|NONE|TRUNCATE",
  "truncate": true,
  "hyperlink": {"type": "URL", "value": "https://example.com"},
  "$textStyle": "Heading/H1"
}
```

`$textStyle` applies a named text style. Explicit properties override the style.

### Rectangle

```json
{"type": "Rectangle", "width": 100, "height": 100, "fill": FILL, "cornerRadius": SPACING}
```

Per-corner radius:
```json
{"cornerRadius": {"topLeft": 16, "topRight": 0, "bottomLeft": 0, "bottomRight": 16}}
```

### Ellipse

```json
{"type": "Ellipse", "width": 100, "height": 100, "fill": FILL}
```

Arcs, pies, and donuts via `arcData`:
```json
{"type": "Ellipse", "width": 80, "height": 80, "fill": "#FF5733", "arcData": {"startingAngle": 0, "endingAngle": 180}}
{"type": "Ellipse", "width": 80, "height": 80, "fill": "#9933FF", "arcData": {"startingAngle": 0, "endingAngle": 270, "innerRadius": 0.6}}
```

### Line

```json
{"type": "Line", "width": 200, "stroke": FILL, "strokeWidth": 2}
{"type": "Line", "width": 200, "stroke": "#333", "strokeWidth": 2, "rotation": 45}
```

### Polygon

```json
{"type": "Polygon", "width": 80, "height": 80, "fill": FILL, "pointCount": 6}
```

`pointCount` defaults to 3 (triangle). Set to 5 for pentagon, 6 for hexagon, etc.

### Star

```json
{"type": "Star", "width": 80, "height": 80, "fill": FILL, "pointCount": 5, "innerRadius": 0.382}
```

### Vector

Custom vector shapes from SVG path data.

```json
{"type": "Vector", "width": 80, "height": 80, "fill": FILL, "svgPath": "M 0 80 L 40 0 L 80 80 Z"}
```

Stroke properties:
```json
{
  "type": "Vector",
  "width": 80,
  "height": 80,
  "stroke": "#FF5733",
  "strokeWidth": 3,
  "strokeCap": "NONE|ROUND|SQUARE|ARROW_LINES|ARROW_EQUILATERAL",
  "strokeJoin": "MITER|BEVEL|ROUND",
  "svgPath": "M 0 40 C 0 0 80 0 80 40"
}
```

---

## Inline Primitives

### $icon
```json
{"$icon": "heart", "size": 24, "color": FILL}
{"$icon": "mdi:check", "size": 20, "colorVariable": "Colors/Success"}
```

Searches Iconify API and renders as vector. `color` accepts all fill formats including variable bindings.

### $image
```json
{"$image": "https://url.com/img.jpg", "width": 300, "height": 200, "cornerRadius": SPACING, "scaleMode": "FILL|FIT|CROP|TILE"}
```
**Width and height are REQUIRED.**

### $svg
```json
{"$svg": "<svg viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='#F00'/></svg>", "width": 64, "height": 64}
```

### $instance
```json
{"$instance": "ComponentName", "$override": {"TextNodeName": "New text"}, "$variant": {"Property": "Value"}}
```

---

## Component Creation

### Convert to Component

Top-level parameter (not inside schema):
```json
{"schema": {...}, "convertToComponent": true}
```

### $expose Primitive

Expose layer properties as component properties. Requires `convertToComponent: true`.

Two forms: **simple** and **with explicit default**.

```json
// Simple - default inferred from node state
{"$expose": {"visible": "showIcon"}}
{"$expose": {"characters": "label"}}
{"$expose": {"mainComponent": "icon"}}

// With explicit default
{"$expose": {"visible": {"name": "showIcon", "default": false}}}
{"$expose": {"characters": {"name": "label", "default": "Click me"}}}
```

| Property | Creates | Applies to |
|----------|---------|------------|
| `visible` | BOOLEAN | Any node |
| `characters` | TEXT | Text nodes |
| `mainComponent` | INSTANCE_SWAP | $instance nodes |

### $exposeInstance

Expose ALL properties from a nested component instance:
```json
{"$instance": "Icons", "$variant": {"Type": "Plus"}, "$exposeInstance": true, "name": "Icon"}
```

All-or-nothing: ALL properties from the nested instance are exposed.

---

## Stroke Properties

Individual border weights:
```json
{
  "stroke": "#E5E5E5",
  "strokeTopWeight": 0,
  "strokeRightWeight": 1,
  "strokeBottomWeight": 1,
  "strokeLeftWeight": 0
}
```

---

## Rules

1. **Size explicitly** — Always declare width/height as number, `"hug-contents"`, or `"fill-parent"`
2. **fill-parent chain** — Parent must have constraint for fill-parent to work
3. **Images need dimensions** — Always provide width and height for `$image`
4. **Name nodes for targeting** — `$nodes` and `$expose` reference nodes by `name`
5. **convertToComponent is top-level** — Not inside schema object
6. **Variable fallbacks** — Always provide: `@Var|#fallback`
7. **AutoLayout is default** — Omitting `type` creates an AutoLayout node
