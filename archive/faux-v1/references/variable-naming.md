# Variable Naming Conventions

## General Rules

1. **Use `/` for hierarchy** - Creates folders in Figma's variable panel
2. **Use PascalCase for categories** - `Colors`, `Spacing`, `Surface`
3. **Use lowercase for values** - `sm`, `md`, `lg`, `none`, `full`
4. **Use numbers for scales** - `100`, `200`, `500`, `900`
5. **Max 3 levels deep** - `Category/Subcategory/Value`

## Primitives Naming

### Colors
```
Colors/{Hue}/{Shade}

Examples:
Colors/White
Colors/Black
Colors/Gray/50
Colors/Gray/100
Colors/Gray/200
Colors/Gray/300
Colors/Gray/400
Colors/Gray/500
Colors/Gray/600
Colors/Gray/700
Colors/Gray/800
Colors/Gray/900
Colors/Blue/50
Colors/Blue/500
Colors/Blue/900
Colors/Red/500
Colors/Green/500
```

### Spacing
```
Spacing/{Scale}

Examples:
Spacing/0      → 0px
Spacing/1      → 4px
Spacing/2      → 8px
Spacing/3      → 12px
Spacing/4      → 16px
Spacing/5      → 20px
Spacing/6      → 24px
Spacing/8      → 32px
Spacing/10     → 40px
Spacing/12     → 48px
Spacing/16     → 64px
Spacing/20     → 80px
Spacing/24     → 96px
```

### Radius
```
Radius/{Size}

Examples:
Radius/none    → 0px
Radius/sm      → 4px
Radius/md      → 8px
Radius/lg      → 12px
Radius/xl      → 16px
Radius/2xl     → 24px
Radius/full    → 9999px
```

### Opacity
```
Opacity/{Percent}

Examples:
Opacity/0      → 0
Opacity/5      → 0.05
Opacity/10     → 0.10
Opacity/20     → 0.20
Opacity/50     → 0.50
Opacity/80     → 0.80
Opacity/100    → 1.0
```

## Tokens Naming

### Surface (Backgrounds)
```
Surface/{Role}

Examples:
Surface/Primary        → Main background
Surface/Secondary      → Subtle background
Surface/Tertiary       → Even more subtle
Surface/Inverse        → Inverted background
Surface/Elevated       → Raised surfaces
Surface/Overlay        → Semi-transparent overlays
Surface/Brand          → Brand-colored background
```

### Text
```
Text/{Role}

Examples:
Text/Primary          → Main text
Text/Secondary        → De-emphasized text
Text/Tertiary         → Least emphasis
Text/Inverse          → Text on dark backgrounds
Text/Disabled         → Disabled state
Text/OnBrand          → Text on brand backgrounds
Text/Link             → Link color
Text/LinkHover        → Link hover color
```

### Border
```
Border/{Role}

Examples:
Border/Default        → Standard borders
Border/Subtle         → Less prominent
Border/Strong         → More prominent
Border/Focus          → Focus rings
Border/Disabled       → Disabled state
Border/Error          → Error state
```

### Interactive (Buttons, Controls)
```
Interactive/{Role}

Examples:
Interactive/Primary           → Primary button bg
Interactive/PrimaryHover      → Primary hover
Interactive/PrimaryPressed    → Primary pressed
Interactive/Secondary         → Secondary button bg
Interactive/SecondaryHover    → Secondary hover
Interactive/Disabled          → Disabled state
```

### Icon
```
Icon/{Role}

Examples:
Icon/Primary          → Main icon color
Icon/Secondary        → De-emphasized icons
Icon/Inverse          → Icons on dark backgrounds
Icon/Disabled         → Disabled icons
Icon/Brand            → Brand-colored icons
```

### Status
```
Status/{Type}

Examples:
Status/Success        → Success green
Status/SuccessBg      → Success background
Status/Warning        → Warning yellow
Status/WarningBg      → Warning background
Status/Error          → Error red
Status/ErrorBg        → Error background
Status/Info           → Info blue
Status/InfoBg         → Info background
```

## Anti-Patterns

### Don't Use Color Names in Tokens
```
❌ Token/Blue         → Describes the value, not the purpose
✅ Interactive/Primary → Describes the purpose
```

### Don't Skip Hierarchy
```
❌ PrimaryBackground   → Hard to organize
✅ Surface/Primary     → Creates folder structure
```

### Don't Use Inconsistent Casing
```
❌ colors/gray/500     → Inconsistent
❌ COLORS/GRAY/500     → Hard to read
✅ Colors/Gray/500     → PascalCase categories
```

### Don't Go Too Deep
```
❌ Colors/Neutral/Gray/Light/50    → Too many levels
✅ Colors/Gray/50                   → Max 3 levels
```

## Figma Variable Scopes

When creating variables, set appropriate scopes:

### COLOR Variables
- `ALL_FILLS` - Can be used for any fill
- `FRAME_FILL` - Only frame backgrounds
- `SHAPE_FILL` - Only shape fills
- `TEXT_FILL` - Only text color
- `STROKE_COLOR` - Only strokes
- `EFFECT_COLOR` - Only effect colors (shadows)

### FLOAT Variables
- `CORNER_RADIUS` - Border radius
- `WIDTH_HEIGHT` - Dimensions
- `GAP` - Auto-layout spacing
- `STROKE_FLOAT` - Stroke weight
- `EFFECT_FLOAT` - Effect values (blur, spread)
- `OPACITY` - Opacity values

### STRING Variables
- `TEXT_CONTENT` - Text strings
- `FONT_FAMILY` - Font family names
- `FONT_STYLE` - Font style names

## Example Complete System

```
Primitives Collection
├── Colors/
│   ├── White
│   ├── Black
│   ├── Gray/50-900
│   ├── Blue/50-900
│   ├── Red/50-900
│   ├── Green/50-900
│   └── Yellow/50-900
├── Spacing/
│   └── 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24
├── Radius/
│   └── none, sm, md, lg, xl, 2xl, full
└── Opacity/
    └── 0, 5, 10, 20, 50, 80, 100

Tokens Collection (Light + Dark modes)
├── Surface/
│   ├── Primary
│   ├── Secondary
│   ├── Tertiary
│   ├── Inverse
│   └── Elevated
├── Text/
│   ├── Primary
│   ├── Secondary
│   ├── Tertiary
│   ├── Inverse
│   └── Disabled
├── Border/
│   ├── Default
│   ├── Subtle
│   ├── Strong
│   └── Focus
├── Interactive/
│   ├── Primary
│   ├── PrimaryHover
│   ├── Secondary
│   └── Disabled
├── Icon/
│   ├── Primary
│   ├── Secondary
│   └── Disabled
└── Status/
    ├── Success
    ├── Warning
    ├── Error
    └── Info
```
