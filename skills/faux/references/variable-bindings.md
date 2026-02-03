# Variable Bindings Reference

Create REAL Figma variable bindings using the `@CollectionName/VariableName|fallback` syntax.

---

## Basic Syntax

```json
"@CollectionName/VariableName|fallback"
```

- `@` — Prefix indicating variable binding
- `CollectionName` — The variable collection name
- `/` — Separator
- `VariableName` — The variable name (can include `/` for nested paths like `Surface/Primary`)
- `|` — Separator before fallback
- `fallback` — Value used if variable doesn't exist

### Examples

```json
"fill": "@Colors/Coral/500|#FF6B5B"
"fill": "@Tokens/Surface/Primary|#FFFFFF"
"stroke": "@Tokens/Border/Default|#E5E5E5"
"cornerRadius": "@Primitives/Radius/M|8"
```

---

## Supported Scopes

| Property | Variable Type | Figma Binding |
|----------|--------------|---------------|
| `fill` | COLOR | `fills[0].color` |
| `stroke` | COLOR | `strokes[0].color` |
| `cornerRadius` | FLOAT | `topLeftRadius`, `topRightRadius`, `bottomLeftRadius`, `bottomRightRadius` |
| `padding` | FLOAT | `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft` |
| `spacing` | FLOAT | `itemSpacing` |
| `fontSize` | FLOAT | `fontSize` |
| `lineHeight` | FLOAT | `lineHeight` |
| `letterSpacing` | FLOAT | `letterSpacing` |
| `fontFamily` | STRING | `fontFamily` |
| `fontWeight` | STRING | `fontStyle` |

---

## Typography Variable Bindings

```json
"fontSize": "@Typography/Body/fontSize|16"
"lineHeight": "@Typography/Body/lineHeight|24"
"letterSpacing": "@Typography/Body/letterSpacing|0"
"fontFamily": "@Typography/Body/fontFamily|Inter"
"fontWeight": "@Typography/Body/fontWeight|Regular"
```

- FLOAT variables for `fontSize`, `lineHeight`, `letterSpacing`
- STRING variables for `fontFamily`, `fontWeight`
- Fallback value is used for font loading and rendering; variable binding overrides when present

---

## Creating Multi-Mode Variables (Light/Dark Themes)

### Correct Syntax for create_variables

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
    },
    {
      "name": "Content/Primary",
      "type": "COLOR",
      "values": {
        "Light": {"r": 0.09, "g": 0.09, "b": 0.09, "a": 1},
        "Dark": {"r": 1, "g": 1, "b": 1, "a": 1}
      }
    }
  ]
}
```

### Key Points

1. **Use `modes` array** at the collection level to define mode names
2. **Use `values` object** (not `value`) with mode names as keys
3. **Color values** must be `{r, g, b, a}` objects with 0-1 values
4. **Mode names must match** exactly between `modes` array and `values` keys
5. **Aliases do NOT work** in `values` — use direct color objects instead

### Recommended Token Structure

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| Surface/Primary | White | Near-black |
| Surface/Secondary | Off-white | Dark gray |
| Content/Primary | Near-black | White |
| Content/Secondary | Gray | Light gray |
| Accent/Primary | Brand color | Lighter brand |
| Border/Default | Light gray | Dark gray |

---

## Using Tokens in Schemas

Reference tokens with the collection name:

```json
{
  "fill": "@Tokens/Surface/Primary|#FFFFFF",
  "children": [
    {
      "type": "Text",
      "fill": "@Tokens/Content/Primary|#171717"
    }
  ]
}
```

When you switch the frame's variable mode in Figma, all bound elements update automatically.

---

## Team Library Variables

`get_design_system` returns `libraryCollections` and `libraryVariables` from enabled team libraries.

**Auto-import in create_from_schema**: The `@CollectionName/VarPath|fallback` syntax automatically imports library variables on demand. The first path segment is matched against both collection names and library names.

Example: `@Email/Surface/Card|#1A1A1A` will:
1. Search for a library collection named "Email" (or a library named "Email")
2. Find the variable "Surface/Card" within it
3. Import it automatically
4. Bind it to the node

If the variable is not found, the fallback color is used. No manual import needed.

---

## Icon Color Variables

For icons, use either:

```json
// With fallback
{"$icon": "heart", "color": "@Tokens/Content/Primary|#171717"}

// Direct binding (no fallback)
{"$icon": "heart", "colorVariable": "Tokens/Content/Primary"}
```

The `color` property accepts all fill formats including variable bindings.

---

## Verifying Bindings

After creating UI with `@Variable` syntax, verify with:

```json
get_node_details(nodeId, resolveBindings: true)
```

Check for `boundVariables` in the fills/strokes response.

---

## Common Issues

### Variable Not Binding

- Ensure variable exists (check with `get_design_system`)
- Use correct path: `@CollectionName/VariableName`
- Always include fallback: `@Variable|#fallback`
- Check spelling and case sensitivity

### Mode Not Switching

- Frame must have an explicit variable mode set
- Use `set_variable_mode` to switch modes on a frame
- Child elements inherit the mode from their container
