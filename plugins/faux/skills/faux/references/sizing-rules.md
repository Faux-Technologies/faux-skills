# Sizing Rules Reference

Proper sizing is critical for Figma layouts. Understand these rules to avoid common failures.

---

## The Core Question

For every container, for each dimension, ask:

> "What determines this size?"

| Answer | Sizing Mode | Declaration |
|--------|-------------|-------------|
| Its children | Hug | `"hug-contents"` |
| Its parent | Fill | `"fill-parent"` |
| A design constraint | Fixed | number (pixels) |

**If you cannot answer this question, the design intent is unclear.**

---

## The Dam Metaphor

Think of constraint propagation as water flow:

- `fill-parent` = **open channel** (constraint flows through)
- `hug-contents` = **dam** (constraint stops here)
- Fixed value = **reservoir** (provides constraint, doesn't pass through)

To get a constraint from the outside to an inner element, there must be an **unbroken channel** of `fill-parent` nodes.

---

## Constraint Propagation Chain (Critical)

**For `fill-parent` to work, EVERY intermediate container must pass the constraint through.**

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

## Text Sizing (Dual Requirement)

**Text responsiveness requires TWO conditions simultaneously. Neither alone is sufficient.**

| Condition | Without It |
|-----------|------------|
| Width constraint only | Text knows width limit but overflows |
| textAutoResize only | Text knows to wrap but expands indefinitely |
| **Both together** | Text wraps/truncates correctly |

### Configuration Matrix

| Intended Behavior | Width | textAutoResize |
|-------------------|-------|----------------|
| Fixed, single line | `hug-contents` or fixed | (default) |
| Wrap within available space | `fill-parent` or fixed | `HEIGHT` |
| Truncate with ellipsis | `fill-parent` or fixed | + `truncate: [lines]` |

### textAutoResize Options
- `"WIDTH_AND_HEIGHT"` — Text box fits content exactly (default)
- `"HEIGHT"` — Width fixed/fill, height adjusts to content
- `"NONE"` — Fixed size, may clip
- `"TRUNCATE"` — Fixed size, truncates with ellipsis

### Correct Pattern for Responsive Text
```json
{
  "type": "Text",
  "width": "fill-parent",
  "textAutoResize": "HEIGHT",
  "content": "Long text that wraps..."
}
```

**Both properties must be set at component creation time.** Setting them after placement is an anti-pattern.

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

## Component Sizing Strategy

When creating components, design the internal structure to anticipate responsive contexts.

### The Sizing Contract

A component has an implicit "sizing contract" with its future contexts:

| Contract Type | Boundary | Internal Structure |
|---------------|----------|-------------------|
| Fully self-contained | `hug × hug` | All elements hug or fixed |
| Width-responsive | `fixed × hug` | Width chain uses fill, height hugs |
| Height-responsive | `hug × fixed` | Height chain uses fill, width hugs |
| Fully responsive | `fixed × fixed` | Both chains use fill |

**The contract must be consistent**: internal structure must match boundary expectations.

### Design-Time Questions

For every element inside a component, ask:

> "Could this element's width/height ever need to be determined by a context outside this component?"

- If **yes**: That element AND every container between it and the boundary must use `fill-parent`
- If **no**: The element can use `hug-contents` or fixed

### Width-Responsive Component Pattern

For components that should adapt to container width:

```
Component Boundary (fixed width default, will fill when instanced)
├── Width: 300 (default, overridden to fill-parent when placed)
├── Height: hug-contents
│
└── Container A (width: fill-parent)
    └── Container B (width: fill-parent)
        └── Text (width: fill-parent, textAutoResize: HEIGHT)
```

**Key**: Every node in the chain uses `fill-parent` for width.

### Common Failure: Broken Chain

**Symptom**: Parent provides width constraint, but internal element doesn't respond.

**Cause**: An intermediate container uses `hug-contents`, breaking propagation.

**Fix**: Audit the chain. Every node must use `fill-parent` for the constrained dimension.

---

## Common Failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| Frame stuck at 100px | Missing sizing | Add explicit width AND height |
| fill-parent not working | Parent has no constraint | Ensure parent has fixed or fill |
| Content overflowing | Child larger than parent | Add maxWidth to child or resize |
| Text clipping | Fixed size without truncation | Use `textAutoResize: "HEIGHT"` or add `truncate: true` |
| Text overflows despite fill-parent | Missing textAutoResize | Add BOTH width constraint AND `textAutoResize: "HEIGHT"` |
| Unpredictable sizing | Circular reference | Boundary must provide fixed value for fill dimensions |

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
