# Prototyping Reference

Wire prototype connections between screens for interactive flows.

---

## Basic Navigation

Use `connect_nodes` to wire connections. Accepts node names or IDs.

### Click → Navigate

```json
{
  "connections": [
    {"from": "Login Button", "to": "Dashboard"}
  ]
}
```

Defaults: trigger=click, navigation=navigate, animation=dissolve 0.3s ease-out.

### Overlay with Animation

```json
{
  "connections": [
    {"from": "Menu Button", "to": "Menu Panel", "as": "overlay", "animate": "slide-up"}
  ]
}
```

---

## Connection Options

| Property | Values | Description |
|----------|--------|-------------|
| `from` | name or ID | Source node (trigger) |
| `to` | name or ID | Destination node |
| `as` | `"navigate"`, `"overlay"`, `"swap"` | Navigation type |
| `animate` | see Animation Shorthands | Transition animation |
| `back` | `true` | Navigate back |
| `close` | `true` | Close overlay |
| `url` | URL string | Open external link |

---

## Batch Wiring

Connect multiple nodes in one call:

```json
{
  "connections": [
    {"from": "Nav/Overview", "to": "Overview Screen"},
    {"from": "Nav/Settings", "to": "Settings Screen"},
    {"from": "Nav/Team", "to": "Team Screen"},
    {"from": "Back Button", "back": true},
    {"from": "Close Icon", "close": true},
    {"from": "Logo", "url": "https://example.com"}
  ]
}
```

---

## Animation Shorthands

| Animation | Effect |
|-----------|--------|
| `dissolve` | Fade transition |
| `smart-animate` | Figma smart animate |
| `instant` | No animation |
| `slide-left` | Slide in from right |
| `slide-right` | Slide in from left |
| `slide-up` | Slide in from bottom |
| `slide-down` | Slide in from top |
| `push-left` | Push current screen left |
| `push-right` | Push current screen right |
| `push-up` | Push current screen up |
| `push-down` | Push current screen down |
| `move-out-left` | Move current screen out left |
| `move-out-right` | Move current screen out right |
| `move-out-up` | Move current screen out up |
| `move-out-down` | Move current screen out down |

---

## Reading Connections

Get existing connections from nodes:

```json
get_connections({"nodes": ["Login Button", "Nav/Overview"]})
```

Returns connections in the same ergonomic format.

---

## Updating Connections

Modify existing connections in-place by matching trigger type:

```json
update_connections({
  "updates": [
    {"node": "Login Button", "on": "click", "animate": "smart-animate"}
  ]
})
```

---

## Removing Connections

### Clear All Connections

```json
disconnect_nodes({"nodes": ["Login Button"]})
```

### Remove by Trigger

```json
disconnect_nodes({
  "nodes": [{"node": "Login Button", "on": "click"}]
})
```

### Remove by Destination

```json
disconnect_nodes({
  "nodes": [{"node": "Login Button", "to": "Dashboard"}]
})
```

---

## Flow Starting Points

List prototype flow starting points:

```json
execute_workflow({
  "commands": [{"command": "get_flow_starting_points", "params": {}}]
})
```

---

## Common Patterns

### Tab Navigation

```json
{
  "connections": [
    {"from": "Tab/Home", "to": "Home Screen"},
    {"from": "Tab/Search", "to": "Search Screen"},
    {"from": "Tab/Profile", "to": "Profile Screen"}
  ]
}
```

### Modal Flow

```json
{
  "connections": [
    {"from": "Open Modal", "to": "Modal", "as": "overlay", "animate": "slide-up"},
    {"from": "Modal/Close", "close": true}
  ]
}
```

### Back Navigation

```json
{
  "connections": [
    {"from": "Back Arrow", "back": true},
    {"from": "Cancel Button", "back": true}
  ]
}
```

### External Links

```json
{
  "connections": [
    {"from": "Privacy Policy", "url": "https://example.com/privacy"},
    {"from": "Terms", "url": "https://example.com/terms"}
  ]
}
```

---

## Best Practices

1. **Name nodes clearly** — Connection uses node names, so descriptive names help
2. **Group related connections** — Batch them in one call for efficiency
3. **Use smart-animate** for component transitions — Figma matches layers by name
4. **Test with get_connections** — Verify connections were created correctly
5. **Consistent back navigation** — Use the same pattern throughout the app
