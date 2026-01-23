# Token Architecture Patterns

## Two-Collection Architecture

The recommended architecture for Figma design systems uses two variable collections:

```
Primitives (Single Mode)          Tokens (Light + Dark Modes)
┌─────────────────────────┐       ┌─────────────────────────┐
│ Colors/White            │◄──────│ Surface/Primary         │
│ Colors/Black            │       │   Light: → Colors/White │
│ Colors/Gray/50-900      │       │   Dark:  → Colors/Gray/900│
│ Colors/Blue/50-900      │       │                         │
│ Colors/Red/50-900       │◄──────│ Text/Primary            │
│ ...                     │       │   Light: → Colors/Gray/900│
├─────────────────────────┤       │   Dark:  → Colors/White │
│ Spacing/0-24            │       │                         │
│ (4, 8, 12, 16, 20...)   │       │ Border/Default          │
├─────────────────────────┤       │   Light: → Colors/Gray/200│
│ Radius/none-full        │       │   Dark:  → Colors/Gray/700│
│ (0, 4, 8, 12, 16...)    │       └─────────────────────────┘
└─────────────────────────┘
```

## Why Two Collections?

### 1. Separation of Concerns
- **Primitives**: Raw values with no semantic meaning
- **Tokens**: Semantic aliases that reference primitives

### 2. Mode Support
- Primitives don't need modes (a color is a color)
- Tokens need modes (what "primary" means changes per theme)

### 3. Maintainability
- Change a primitive → all tokens using it update
- Change a token's alias → only that semantic meaning changes

### 4. Scalability
- Add new modes without touching primitives
- Add new tokens without duplicating values

## Color Token Categories

### Surface Tokens
Used for backgrounds:
- `Surface/Primary` - Main background
- `Surface/Secondary` - Subtle background
- `Surface/Tertiary` - Even more subtle
- `Surface/Inverse` - Inverted (dark on light theme)
- `Surface/Elevated` - Raised surfaces (cards, modals)
- `Surface/Overlay` - Semi-transparent overlays

### Text Tokens
Used for typography:
- `Text/Primary` - Main text color
- `Text/Secondary` - De-emphasized text
- `Text/Tertiary` - Even more de-emphasized
- `Text/Inverse` - Text on inverted backgrounds
- `Text/Disabled` - Disabled state
- `Text/OnBrand` - Text on brand-colored backgrounds

### Border Tokens
Used for strokes and dividers:
- `Border/Default` - Standard borders
- `Border/Subtle` - Less prominent borders
- `Border/Strong` - More prominent borders
- `Border/Focus` - Focus rings
- `Border/Disabled` - Disabled state

### Interactive Tokens
Used for buttons, links, controls:
- `Interactive/Primary` - Primary actions
- `Interactive/Secondary` - Secondary actions
- `Interactive/Hover` - Hover state
- `Interactive/Pressed` - Pressed state
- `Interactive/Disabled` - Disabled state

### Status Tokens
Used for feedback:
- `Status/Success` - Success states
- `Status/Warning` - Warning states
- `Status/Error` - Error states
- `Status/Info` - Informational states

## Spacing Scale

Use a consistent spacing scale based on 4px:

| Token | Value | Use Case |
|-------|-------|----------|
| `Spacing/0` | 0px | No spacing |
| `Spacing/1` | 4px | Tight spacing (icons, inline elements) |
| `Spacing/2` | 8px | Default small spacing |
| `Spacing/3` | 12px | Medium-small spacing |
| `Spacing/4` | 16px | Default spacing |
| `Spacing/5` | 20px | Medium spacing |
| `Spacing/6` | 24px | Section spacing |
| `Spacing/8` | 32px | Large spacing |
| `Spacing/10` | 40px | Extra large spacing |
| `Spacing/12` | 48px | Section dividers |
| `Spacing/16` | 64px | Page sections |
| `Spacing/20` | 80px | Major sections |
| `Spacing/24` | 96px | Hero spacing |

## Radius Scale

| Token | Value | Use Case |
|-------|-------|----------|
| `Radius/none` | 0px | Sharp corners |
| `Radius/sm` | 4px | Subtle rounding |
| `Radius/md` | 8px | Default rounding |
| `Radius/lg` | 12px | Prominent rounding |
| `Radius/xl` | 16px | Large rounding |
| `Radius/2xl` | 24px | Very large rounding |
| `Radius/full` | 9999px | Pill/circular shapes |

## Mode Switching

Tokens automatically switch values based on the active mode:

```
Light Mode Active:
┌─────────────────────────┐
│ Surface/Primary         │
│ Value: Colors/White     │ ──► #FFFFFF
└─────────────────────────┘

Dark Mode Active:
┌─────────────────────────┐
│ Surface/Primary         │
│ Value: Colors/Gray/900  │ ──► #1C1C1C
└─────────────────────────┘
```

Components bound to `Surface/Primary` automatically update when the mode changes.

## Best Practices

1. **Never skip the primitives layer** - Always alias through primitives, never hardcode in tokens
2. **Keep primitives neutral** - Names should describe the value, not the usage
3. **Keep tokens semantic** - Names should describe the purpose, not the value
4. **Plan for growth** - Leave room in scales for intermediate values
5. **Document exceptions** - Some colors (brand colors) may not follow the scale
