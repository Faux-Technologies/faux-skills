# Sizing Rules Reference

Proper sizing is critical for Figma layouts. Understand these rules to avoid common failures.

---

## Size Primitive

| Behavior | Declaration |
|----------|-------------|
| Fit to children | `"hug-contents"` |
| Fill parent | `"fill-parent"` |
| Fixed size | number (pixels) |

---

## The fill-parent Chain

**Critical Rule**: For `fill-parent` to work, the parent must have a constraint (fixed or fill).

### How Sizing Propagates

Each node resolves its own size independently. A constraint on a parent node does NOT automatically propagate to children.

```
Screen (fixed 375px)
  └── Container (fill-parent) ✓ works - parent has constraint
        └── Content (fill-parent) ✓ works - parent has constraint
              └── Item (fill-parent) ✓ works - parent has constraint
```

If ANY link in the chain breaks:

```
Screen (fixed 375px)
  └── Container (hug-contents)
        └── Content (fill-parent) ✗ FAILS - parent has no constraint
```

### Before Setting Sizing

Ask: "What determines this node's width/height?"

Trace the sizing chain from innermost content outward to the screen edge. Every link must be intentionally configured.

---

## Common Patterns

### Full-Width Card

```json
{
  "type": "AutoLayout",
  "width": "fill-parent",      // Parent must have constraint
  "height": "hug-contents",    // Fits content height
  "direction": "vertical",
  "padding": 16,
  "children": [...]
}
```

### Fixed-Width Container

```json
{
  "type": "AutoLayout",
  "width": 375,                // Fixed constraint
  "height": "hug-contents",
  "children": [
    {
      "type": "AutoLayout",
      "width": "fill-parent",  // Works - parent has fixed width
      "children": [...]
    }
  ]
}
```

### Split Layout (50/50)

```json
{
  "type": "AutoLayout",
  "width": "fill-parent",
  "direction": "horizontal",
  "spacing": 16,
  "children": [
    {"type": "AutoLayout", "width": "fill-parent", "children": [...]},
    {"type": "AutoLayout", "width": "fill-parent", "children": [...]}
  ]
}
```

Both children get equal space because they both fill.

---

## Min/Max Constraints

Control sizing boundaries:

```json
{
  "type": "AutoLayout",
  "width": "fill-parent",
  "minWidth": 200,
  "maxWidth": 600,
  "height": "hug-contents",
  "minHeight": 100
}
```

**Important**: `minWidth`/`maxWidth` on a parent does NOT constrain children. Each child must have its own constraints.

---

## Text Sizing

Text has special sizing behavior:

```json
{
  "type": "Text",
  "content": "Hello World",
  "textAutoResize": "WIDTH_AND_HEIGHT"  // default - text box fits content
}
```

Options:
- `"WIDTH_AND_HEIGHT"` — Text box fits content exactly
- `"HEIGHT"` — Width fixed, height adjusts to content
- `"NONE"` — Fixed size, may clip
- `"TRUNCATE"` — Fixed size, truncates with ellipsis

For text that should fill horizontally:
```json
{
  "type": "Text",
  "width": "fill-parent",
  "textAutoResize": "HEIGHT",
  "content": "Long text that wraps..."
}
```

---

## Layout Patterns

### Vertical Stack (Full Width)

```json
{
  "type": "AutoLayout",
  "direction": "vertical",
  "width": 375,              // Fixed root
  "height": "hug-contents",
  "spacing": 16,
  "children": [
    {"type": "AutoLayout", "width": "fill-parent", "height": 200},
    {"type": "AutoLayout", "width": "fill-parent", "height": "hug-contents"},
    {"type": "AutoLayout", "width": "fill-parent", "height": 100}
  ]
}
```

### Horizontal Row with Fixed + Flexible

```json
{
  "type": "AutoLayout",
  "direction": "horizontal",
  "width": "fill-parent",
  "spacing": 12,
  "children": [
    {"$icon": "user", "size": 40},                           // Fixed 40px
    {"type": "AutoLayout", "width": "fill-parent"},          // Takes remaining space
    {"type": "Text", "content": "Edit", "width": 60}         // Fixed 60px
  ]
}
```

### Space Between

```json
{
  "type": "AutoLayout",
  "direction": "horizontal",
  "width": "fill-parent",
  "justify": "space-between",
  "children": [
    {"type": "Text", "content": "Left"},
    {"type": "Text", "content": "Right"}
  ]
}
```

---

## Common Failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| Frame stuck at 100px | Missing sizing | Add explicit width AND height |
| fill-parent not working | Parent has no constraint | Ensure parent has fixed or fill |
| Content overflowing | Child larger than parent | Add maxWidth to child or resize |
| Text clipping | Fixed size without truncation | Use `textAutoResize: "HEIGHT"` or add `truncate: true` |

---

## Debug Checklist

When layout isn't working:

1. **Trace the chain**: From the problematic node up to the root, does each parent have a constraint?
2. **Check the root**: Does the top-level frame have fixed dimensions?
3. **Verify direction**: Is `fill-parent` on the correct axis for the parent's direction?
4. **Look for breaks**: Is any node using `hug-contents` that should have a constraint?

---

## Screen Dimensions Reference

Common mobile dimensions:
- iPhone 14 Pro: 393 x 852
- iPhone 14 Pro Max: 430 x 932
- Standard mobile: 375 x 812

Desktop:
- Laptop: 1440 x 900
- Desktop: 1920 x 1080
