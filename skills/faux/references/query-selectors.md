# CSS Selectors Reference

Use `query_nodes` for structural queries with CSS-like selector syntax.

---

## Basic Syntax

```
query_nodes("selector", fields: "minimal")
```

Returns nodes matching the selector.

---

## Type Selectors

Match nodes by type:

| Selector | Matches |
|----------|---------|
| `Frame` | All frames |
| `Text` | All text nodes |
| `Instance` | All component instances |
| `Rectangle` | All rectangles |
| `Ellipse` | All ellipses |
| `Component` | All components |
| `ComponentSet` | All component sets |
| `Group` | All groups |
| `Vector` | All vectors |
| `*` | All nodes |

---

## Attribute Selectors

Match by node properties:

| Selector | Matches |
|----------|---------|
| `[name="Header"]` | Exact name match |
| `[name*="icon"]` | Name contains "icon" |
| `[name^="Nav"]` | Name starts with "Nav" |
| `[name$="Button"]` | Name ends with "Button" |
| `[visible=true]` | Visible nodes |
| `[visible=false]` | Hidden nodes |
| `[opacity>0.5]` | Opacity greater than 0.5 |
| `[fontSize>=24]` | Font size 24 or larger |

---

## Structural Selectors

| Selector | Matches |
|----------|---------|
| `A > B` | B is direct child of A |
| `A B` | B is descendant of A |
| `A + B` | B is adjacent sibling after A |
| `A ~ B` | B is general sibling after A |

Examples:
```
Frame > Text           // Direct text children of frames
Frame Text             // Any text inside frames (any depth)
Text + Rectangle       // Rectangle immediately after text
```

---

## Pseudo-Class Selectors

| Selector | Matches |
|----------|---------|
| `:first-child` | First child of parent |
| `:last-child` | Last child of parent |
| `:nth-child(2)` | 2nd child |
| `:nth-child(2n)` | Even children |
| `:nth-child(2n+1)` | Odd children |
| `:visible` | Visible nodes |
| `:hidden` | Hidden nodes |
| `:autolayout` | Frames with auto-layout |
| `:empty` | Nodes with no children |
| `:locked` | Locked nodes |

---

## Negation and Has

| Selector | Matches |
|----------|---------|
| `:not(Instance)` | Not an instance |
| `:not([visible=false])` | Not hidden |
| `:has(> Text)` | Has direct Text child |
| `:has(Instance)` | Has Instance descendant |

---

## Instance Selectors

Match instances by component:

```
Instance[component="Button"]           // Instances of "Button" component
Instance[componentSet="Icons"]         // Instances from "Icons" component set
```

---

## Combining Selectors

| Selector | Matches |
|----------|---------|
| `Frame, Group` | Frames OR groups |
| `Frame[name*="Card"]` | Frames with "Card" in name |
| `Text:first-child` | Text that is first child |
| `Frame:autolayout > *:first-child` | First child of auto-layout frames |

---

## Output Fields

Control what properties are returned:

| Field Value | Returns |
|-------------|---------|
| `"minimal"` (default) | id, name, type |
| `"position"` | + x, y, width, height |
| `"text"` | id, name, characters, fontSize, fontFamily, fontWeight |
| `"full"` | All properties |
| `["id", "name", "characters"]` | Specific fields |

---

## Examples

### Find all text in frames

```
query_nodes("Frame > Text")
```

### Find visible button instances

```
query_nodes("Instance[component=Button]:visible")
```

### Find first text in card frames

```
query_nodes("Frame[name*=Card] Text:first-child")
```

### Find first child of auto-layout frames

```
query_nodes("Frame:autolayout > *:first-child")
```

### Find all hidden nodes with positions

```
query_nodes("*:hidden", fields: "position")
```

### Find large text with content

```
query_nodes("Text[fontSize>=24]", fields: "text")
```

### Find nodes by partial name

```
query_nodes("[name*=Header]")           // Contains "Header"
query_nodes("[name^=Nav]")              // Starts with "Nav"
query_nodes("[name$=Icon]")             // Ends with "Icon"
```

### Find empty containers

```
query_nodes("Frame:empty")
query_nodes("Group:empty")
```

---

## vs find_nodes_by_name

| Use Case | Tool |
|----------|------|
| Simple name search | `find_nodes_by_name` |
| Structural queries | `query_nodes` |
| Type-based filtering | `query_nodes` |
| Property-based filtering | `query_nodes` |
| Regex name matching | `find_nodes_by_name` |

**Rule of thumb**: Use `find_nodes_by_name` for simple "find by name" cases. Use `query_nodes` for everything else.

---

## Performance Tips

1. **Be specific** — More specific selectors are faster
2. **Limit scope** — Use `rootId` parameter to search within a subtree
3. **Use type selectors** — `Text[name*=Label]` faster than `*[name*=Label]`
4. **Avoid deep descendant queries** — `Frame > Text` faster than `Frame Text`
