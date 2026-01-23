# Iconify Icon Sets Reference

Iconify provides access to 100+ icon sets with 275,000+ icons.

## Recommended Sets

### Lucide
- **Prefix:** `lucide`
- **Icons:** 1,400+
- **Style:** Clean, minimal, consistent 24px grid
- **Stroke:** 2px (adjustable)
- **License:** ISC

**Best for:** Modern apps, dashboards, SaaS products

**Sample icons:**
```
lucide:home, lucide:search, lucide:user, lucide:settings
lucide:chevron-left, lucide:chevron-right, lucide:arrow-up
lucide:check, lucide:x, lucide:plus, lucide:minus
lucide:bell, lucide:mail, lucide:heart, lucide:star
```

### Heroicons
- **Prefix:** `heroicons`
- **Icons:** 300+ (outline + solid)
- **Style:** Tailwind CSS official icons
- **Variants:** Outline (default), Solid
- **License:** MIT

**Best for:** Tailwind projects

**Variants:**
```
heroicons:bell         → Outline version
heroicons:bell-solid   → Solid/filled version
```

**Sample icons:**
```
heroicons:home, heroicons:magnifying-glass, heroicons:user
heroicons:cog-6-tooth, heroicons:bell, heroicons:envelope
heroicons:check, heroicons:x-mark, heroicons:plus
```

### Phosphor
- **Prefix:** `phosphor`
- **Icons:** 1,200+ (6 weights each)
- **Style:** Flexible, neutral
- **Weights:** thin, light, regular, bold, fill, duotone
- **License:** MIT

**Best for:** Projects needing multiple weights

**Weights:**
```
phosphor:heart          → Regular
phosphor:heart-thin     → Thin stroke
phosphor:heart-light    → Light stroke
phosphor:heart-bold     → Bold stroke
phosphor:heart-fill     → Filled
phosphor:heart-duotone  → Two-tone
```

### Tabler
- **Prefix:** `tabler`
- **Icons:** 4,200+
- **Style:** Consistent stroke, 24px grid
- **Stroke:** 2px
- **License:** MIT

**Best for:** Large icon needs, comprehensive set

**Sample icons:**
```
tabler:home, tabler:search, tabler:user, tabler:settings
tabler:arrow-left, tabler:arrow-right, tabler:chevron-down
tabler:check, tabler:x, tabler:plus, tabler:minus
```

### Material Symbols
- **Prefix:** `material-symbols`
- **Icons:** 3,000+
- **Style:** Google Material Design 3
- **Variants:** Outlined, Rounded, Sharp
- **License:** Apache 2.0

**Best for:** Material Design projects

**Variants:**
```
material-symbols:home              → Default (outlined)
material-symbols:home-rounded      → Rounded corners
material-symbols:home-sharp        → Sharp corners
```

### Feather
- **Prefix:** `feather`
- **Icons:** 280+
- **Style:** Simple, beautiful, 24px
- **Stroke:** 2px
- **License:** MIT

**Best for:** Minimalist designs

**Sample icons:**
```
feather:home, feather:search, feather:user, feather:settings
feather:arrow-left, feather:chevron-down, feather:check
```

### Remix Icons
- **Prefix:** `ri`
- **Icons:** 2,800+
- **Style:** Neutral, versatile
- **Variants:** Line, Fill
- **License:** Apache 2.0

**Variants:**
```
ri:home-line      → Outline version
ri:home-fill      → Filled version
```

## Icon Set Comparison

| Set | Icons | Style | Best For |
|-----|-------|-------|----------|
| Lucide | 1,400+ | Clean, minimal | Modern apps |
| Heroicons | 300+ | Tailwind style | Tailwind projects |
| Phosphor | 7,200+ | Flexible weights | Weight variety |
| Tabler | 4,200+ | Consistent | Large icon needs |
| Material | 3,000+ | Material Design | Google style |
| Feather | 280+ | Simple | Minimalism |
| Remix | 2,800+ | Neutral | Versatile needs |

## Style Consistency

### Same-Set Rule
**Always use icons from ONE set** in your project.

❌ **Bad:**
```javascript
icons: [
  { iconName: "lucide:home" },      // Lucide
  { iconName: "heroicons:bell" },   // Heroicons - different style!
  { iconName: "tabler:user" }       // Tabler - yet another style!
]
```

✅ **Good:**
```javascript
icons: [
  { iconName: "lucide:home" },
  { iconName: "lucide:bell" },
  { iconName: "lucide:user" }
]
```

### Why Consistency Matters
- Uniform stroke weight
- Consistent visual density
- Harmonious corners and curves
- Professional appearance

## Searching Icons

### Basic Search
```javascript
search_icons({
  query: "arrow",
  prefix: "lucide",
  limit: 10
})
```

### Search Tips
1. **Always specify prefix** - Limits to one set, faster results
2. **Use simple terms** - "arrow" not "right pointing arrow"
3. **Try synonyms** - "trash" vs "delete" vs "remove"
4. **Check variants** - Some sets have outline/solid versions

### Common Search Terms

| Concept | Try These Terms |
|---------|-----------------|
| Delete | trash, delete, remove, x |
| Settings | settings, cog, gear, preferences |
| User | user, person, account, profile |
| Search | search, magnifying-glass, find |
| Add | plus, add, create, new |
| Close | x, close, times, cross |
| Check | check, checkmark, tick, done |
| Edit | edit, pencil, pen, write |
| Share | share, export, send |
| Download | download, arrow-down, save |

## Size Guidelines

### Standard Sizes
| Size | Use Case |
|------|----------|
| 12px | Inline badges, very compact |
| 16px | Small buttons, compact UI |
| 20px | Medium buttons, form inputs |
| 24px | Standard (default) |
| 32px | Large buttons, emphasis |
| 48px | Hero sections, features |
| 64px | Illustrations, large features |

### Stroke Width by Size
Icons auto-adjust stroke width for optical balance:

| Size Range | Stroke Width |
|------------|--------------|
| 12-16px | 1px |
| 17-20px | 1.25px |
| 21-28px | 1.5px |
| 29-40px | 2px |
| 41px+ | 2.5px |

Override with `strokeWidth` parameter if needed.

## Color Binding

### Using Variables (Recommended)
```javascript
create_icon_component({
  iconName: "lucide:heart",
  colorVariable: "Icon/Primary"
})
```

### Using Hex (Fallback)
```javascript
create_icon_component({
  iconName: "lucide:heart",
  color: "#3B82F6"
})
```

### Stroke vs Fill Icons
Figmatic auto-detects icon type:
- **Stroke icons** (Lucide, Feather) → Color applied to stroke
- **Fill icons** (Heroicons solid) → Color applied to fill
- **Duotone icons** → Primary color to main, secondary to accent

## Popular Icon Mappings

### Navigation
| Concept | Lucide | Heroicons | Phosphor |
|---------|--------|-----------|----------|
| Home | home | home | house |
| Menu | menu | bars-3 | list |
| Close | x | x-mark | x |
| Back | arrow-left | arrow-left | arrow-left |
| Forward | arrow-right | arrow-right | arrow-right |

### Actions
| Concept | Lucide | Heroicons | Phosphor |
|---------|--------|-----------|----------|
| Search | search | magnifying-glass | magnifying-glass |
| Add | plus | plus | plus |
| Edit | edit | pencil | pencil |
| Delete | trash-2 | trash | trash |
| Save | save | document | floppy-disk |

### Status
| Concept | Lucide | Heroicons | Phosphor |
|---------|--------|-----------|----------|
| Success | check | check | check |
| Error | x-circle | x-circle | x-circle |
| Warning | alert-triangle | exclamation-triangle | warning |
| Info | info | information-circle | info |

### User
| Concept | Lucide | Heroicons | Phosphor |
|---------|--------|-----------|----------|
| User | user | user | user |
| Users | users | user-group | users |
| Settings | settings | cog-6-tooth | gear |
| Logout | log-out | arrow-right-on-rectangle | sign-out |

## License Summary

All recommended sets are open source:

| Set | License | Commercial Use |
|-----|---------|----------------|
| Lucide | ISC | ✅ Yes |
| Heroicons | MIT | ✅ Yes |
| Phosphor | MIT | ✅ Yes |
| Tabler | MIT | ✅ Yes |
| Material | Apache 2.0 | ✅ Yes |
| Feather | MIT | ✅ Yes |
| Remix | Apache 2.0 | ✅ Yes |

No attribution required for any of these sets (though appreciated).
