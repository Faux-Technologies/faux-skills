# Troubleshooting Reference

Common issues and how to fix them.

---

## Common Failures Quick Reference

| Symptom | Cause | Fix |
|---------|-------|-----|
| Frame stuck at 100px | Missing sizing | Add explicit width AND height |
| fill-parent not working | Parent has no constraint | Ensure parent has fixed or fill |
| Text overflowing | Missing textAutoResize | Add `textAutoResize: "HEIGHT"` |
| Instance invisible | Fill cleared | Restore fill with `modify_nodes` |
| Variable not binding | Wrong path | Check name exists in `get_design_system` |
| Screenshot crashes plugin | Export too large | Lower `maxWidth` (default 1200, safe limit ~1300 for tall frames) |
| Component not found | Component doesn't exist | Create component first, use exact name from `get_components` |

---

## Variable Binding Issues

### Variable Not Binding

**Symptoms**: Color shows fallback, not bound to variable.

**Diagnosis**:
1. Run `get_design_system` to list all variables
2. Check the exact collection and variable name
3. Verify with `get_node_details(nodeId, resolveBindings: true)`

**Common causes**:
- Wrong collection name: `@Colors/Primary` vs `@Tokens/Primary`
- Missing fallback: `@Colors/Primary` (wrong) vs `@Colors/Primary|#3B82F6` (correct)
- Typo in variable name
- Case sensitivity mismatch

**Fix**: Use exact path from `get_design_system`:
```json
"fill": "@CollectionName/VariableName|#fallback"
```

### Multi-Mode Variable Not Created

**Symptoms**: Variable only has one mode.

**Common causes**:
- Used `value` instead of `values` object
- Mode names don't match between `modes` array and `values` keys

**Correct syntax**:
```json
{
  "collectionName": "Tokens",
  "modes": ["Light", "Dark"],
  "variables": [{
    "name": "Surface/Primary",
    "type": "COLOR",
    "values": {
      "Light": {"r": 1, "g": 1, "b": 1, "a": 1},
      "Dark": {"r": 0.1, "g": 0.1, "b": 0.1, "a": 1}
    }
  }]
}
```

---

## Sizing Issues

### fill-parent Not Working

**Symptoms**: Element doesn't expand to fill available space.

**Cause**: Parent doesn't have a constraint, or the propagation chain is broken.

**The Dam Metaphor**: Think of constraints as water flow:
- `fill-parent` = open channel (constraint flows through)
- `hug-contents` = dam (constraint STOPS here)
- Fixed value = reservoir (provides constraint)

**Trace the chain**:
```
Root (375px fixed) ✓
  └── Container (fill-parent) ✓ parent has constraint
        └── Item (fill-parent) ✓ parent has constraint
```

vs:

```
Root (375px fixed) ✓
  └── Container (hug-contents) ✗ DAM - constraint stops here
        └── Item (fill-parent) ✗ FAILS - no constraint to fill
```

**Fix**: Ensure every ancestor up to a fixed-size root has either a fixed size or `fill-parent`. One `hug-contents` in the chain breaks propagation.

### Propagation Chain Debugging

1. Start at the element that should respond
2. Trace upward to the screen/root
3. At each level, check: is it `fill-parent` for the target dimension?
4. The first node that uses `hug-contents` is the breaking point
5. Change that node to `fill-parent` or fixed

### Frame Stuck at Small Size

**Symptoms**: Frame is 100px or unexpectedly small.

**Causes**:
- Missing explicit width/height
- `hug-contents` with no children or empty children

**Fix**: Add explicit dimensions:
```json
{
  "type": "AutoLayout",
  "width": 375,
  "height": "hug-contents"
}
```

---

## Text Issues

### Text Overflowing Container

**Symptoms**: Text extends beyond its container.

**Cause**: Text requires TWO conditions to respond to width. Neither alone is sufficient.

| Condition | Without It |
|-----------|------------|
| Width constraint only | Text knows width but doesn't know to wrap → overflows |
| textAutoResize only | Text knows to wrap but has no width limit → expands indefinitely |
| **Both together** | Text wraps/truncates correctly |

**Fix** (BOTH are required):
```json
{
  "type": "Text",
  "width": "fill-parent",      // Condition 1: width constraint
  "textAutoResize": "HEIGHT",  // Condition 2: resize behavior
  "content": "Long text that should wrap..."
}
```

**Important**: Both conditions must be set at component creation time. Setting them per-instance is an anti-pattern.

### Text Style Not Applying

**Symptoms**: Text doesn't have expected styling.

**Causes**:
- Text style doesn't exist
- Wrong style name (case sensitive)
- Style name doesn't include path

**Diagnosis**: Run `get_design_system` to see available text styles.

**Fix**: Use exact style name including path:
```json
"$textStyle": "Heading/H2"  // not just "H2"
```

---

## Component Issues

### Instance Not Found

**Symptoms**: `$instance` creates nothing or errors.

**Causes**:
- Component doesn't exist yet
- Wrong component name

**Diagnosis**: Run `get_components` to list available components.

**Fix**:
1. Create the component first with `convertToComponent: true`
2. Use exact component name from `get_components`

### Instance Invisible

**Symptoms**: Instance created but can't see it.

**Causes**:
- Fill was cleared
- Opacity is 0
- Node is hidden (`visible: false`)

**Fix**:
```json
// Use modify_nodes to restore
modify_nodes({
  "nodes": [{"id": "nodeId", "fill": "#FFFFFF"}]
})
```

---

## Image Issues

### Image Not Loading

**Symptoms**: Empty rectangle or error.

**Causes**:
- URL not accessible
- Missing width/height
- CORS issues with URL

**Fix**:
```json
{
  "$image": "https://images.unsplash.com/photo-xxx?w=300&h=200&fit=crop",
  "width": 300,
  "height": 200,
  "scaleMode": "FILL"
}
```

**Requirements**:
- URL must be publicly accessible
- Width and height are REQUIRED
- Use `scaleMode` for proper fitting

---

## Screenshot Issues

### Screenshot Crashes Plugin

**Symptoms**: Plugin becomes unresponsive.

**Cause**: Export is too large.

**Fix**: Lower `maxWidth`:
```json
get_screenshot({
  "nodeId": "nodeId",
  "maxWidth": 800,  // lower than default 1200
  "format": "JPG"   // smaller than PNG
})
```

**Defaults**:
- maxWidth: 1200px
- format: JPG
- For tall frames (like full landing pages), keep maxWidth low

---

## Prototype Issues

### Connection Not Working

**Symptoms**: Click doesn't navigate.

**Causes**:
- Source or destination node doesn't exist
- Wrong node name/ID

**Diagnosis**: Use `get_connections` to inspect existing connections.

**Fix**: Verify node names with `find_nodes_by_name`, then connect:
```json
connect_nodes({
  "connections": [
    {"from": "Button Name", "to": "Screen Name"}
  ]
})
```

---

## Two-Pass Creation Pattern

When things aren't perfect after initial creation, plan for a second pass:

**Pass 1 (Structure)**: Create hierarchy with defaults, place instances
**Pass 2 (Differentiation)**: Swap instances, adjust sizing, restore fills

Not everything is perfect after pass 1. Use `modify_nodes` for refinements.

---

## Debug Tools

| Tool | Use |
|------|-----|
| `get_design_system` | Check existing variables, styles, tokens |
| `get_node_details` | Inspect specific node, use `resolveBindings: true` |
| `get_screenshot` | Visual verification |
| `get_components` | List available components |
| `find_nodes_by_name` | Locate nodes by name pattern |
| `query_nodes` | CSS-like queries for finding nodes |
