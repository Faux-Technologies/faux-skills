# Variant Patterns Reference

## Understanding ComponentSets

A ComponentSet is a container that holds multiple variant Components.

```
ComponentSet "Button"
├── Component "Size=Small, State=Default"
├── Component "Size=Small, State=Hover"
├── Component "Size=Small, State=Pressed"
├── Component "Size=Medium, State=Default"
├── Component "Size=Medium, State=Hover"
├── Component "Size=Medium, State=Pressed"
├── Component "Size=Large, State=Default"
├── Component "Size=Large, State=Hover"
└── Component "Size=Large, State=Pressed"
```

## Variant Naming Convention

Format: `PropertyName=Value, PropertyName=Value`

Examples:
- `Size=Small`
- `State=Default`
- `Size=Medium, State=Hover`
- `Type=Primary, Size=Large, State=Pressed`

**Rules:**
- Property names use PascalCase
- Values use PascalCase or lowercase
- Multiple properties separated by `, ` (comma + space)
- Order matters for organization (put most important first)

## Common Variant Dimensions

### State
Interactive states:
- `State=Default` - Normal resting state
- `State=Hover` - Mouse over
- `State=Pressed` - Mouse down / active
- `State=Focused` - Keyboard focus
- `State=Disabled` - Non-interactive
- `State=Loading` - Async operation in progress

### Size
Sizing variants:
- `Size=XSmall` (or `Size=xs`)
- `Size=Small` (or `Size=sm`)
- `Size=Medium` (or `Size=md`)
- `Size=Large` (or `Size=lg`)
- `Size=XLarge` (or `Size=xl`)

### Type/Style
Visual variants:
- `Type=Primary` - Main CTA
- `Type=Secondary` - Secondary action
- `Type=Tertiary` - De-emphasized
- `Type=Ghost` - Minimal/text-only
- `Type=Destructive` - Dangerous action

### Hierarchy
For text/content:
- `Hierarchy=Primary`
- `Hierarchy=Secondary`
- `Hierarchy=Tertiary`

### Orientation
For layouts:
- `Orientation=Horizontal`
- `Orientation=Vertical`

## Creating Variants

### Method 1: From Existing Component

```javascript
create_component_variants({
  componentId: "123:456",
  variants: [
    { name: "State=Default" },
    {
      name: "State=Hover",
      modifications: {
        nodes: [
          { path: ["Background"], opacity: 0.9 }
        ]
      }
    },
    {
      name: "State=Pressed",
      modifications: {
        nodes: [
          { path: ["Background"], opacity: 0.8 }
        ]
      }
    }
  ]
})
```

### Method 2: Add to Existing ComponentSet

```javascript
add_variant_to_component_set({
  componentSetId: "221:18176",
  sourceVariantId: "221:18053",
  variantName: "State=Disabled",
  modifications: {
    nodes: [
      { path: ["Background"], opacity: 0.4 }
    ],
    textNodes: [
      { path: ["Label"], fillVariableName: "Text/Disabled" }
    ]
  }
})
```

### Method 3: Create Complete Set at Once

```javascript
create_component_set_with_properties({
  name: "Button",
  variants: [
    {
      name: "Size=Small",
      schema: {
        type: "AutoLayout",
        padding: { horizontal: 12, vertical: 6 },
        children: [
          { type: "Text", name: "Label", content: "Button", fontSize: 12 }
        ]
      }
    },
    {
      name: "Size=Medium",
      schema: {
        type: "AutoLayout",
        padding: { horizontal: 16, vertical: 10 },
        children: [
          { type: "Text", name: "Label", content: "Button", fontSize: 14 }
        ]
      }
    }
  ],
  properties: [
    {
      name: "Label",
      type: "TEXT",
      defaultValue: "Button",
      bindings: [{ nodeName: "Label", nodeProperty: "characters" }]
    }
  ]
})
```

## Modification Types

### Node Modifications

```javascript
modifications: {
  nodes: [
    {
      path: ["LayerName"],           // Path to target node
      opacity: 0.5,                   // Set opacity (0-1)
      visible: false,                 // Hide/show node
      swapComponentId: "789:012"      // Swap nested instance
    }
  ]
}
```

### Text Node Modifications

```javascript
modifications: {
  textNodes: [
    {
      path: ["Container", "Label"],   // Path to text node
      characters: "New Text",          // Change content
      fontName: {                      // Change font
        family: "Inter",
        style: "Bold"
      },
      fillVariableName: "Text/Disabled"  // Bind fill to variable
    }
  ]
}
```

## Variant Property Patterns

### Button Variants

```
Button ComponentSet
├── Variant Properties:
│   ├── Type: Primary, Secondary, Ghost, Destructive
│   ├── Size: Small, Medium, Large
│   └── State: Default, Hover, Pressed, Disabled
└── Component Properties:
    ├── Label (TEXT)
    ├── ShowLeadingIcon (BOOLEAN)
    ├── ShowTrailingIcon (BOOLEAN)
    ├── LeadingIcon (INSTANCE_SWAP)
    └── TrailingIcon (INSTANCE_SWAP)
```

### Input Variants

```
Input ComponentSet
├── Variant Properties:
│   ├── State: Default, Focused, Filled, Error, Disabled
│   └── Size: Small, Medium, Large
└── Component Properties:
    ├── Placeholder (TEXT)
    ├── Label (TEXT)
    ├── ShowLabel (BOOLEAN)
    ├── HelperText (TEXT)
    ├── ShowHelperText (BOOLEAN)
    └── LeadingIcon (INSTANCE_SWAP)
```

### Card Variants

```
Card ComponentSet
├── Variant Properties:
│   ├── Type: Default, Elevated, Outlined
│   └── Size: Compact, Default, Large
└── Component Properties:
    ├── Title (TEXT)
    ├── Description (TEXT)
    ├── ShowDescription (BOOLEAN)
    ├── ShowImage (BOOLEAN)
    └── ActionLabel (TEXT)
```

## Best Practices

### 1. Limit Variant Dimensions
- 2-3 dimensions maximum
- More than 3 creates exponential complexity
- Use component properties for content variations

### 2. Consistent Naming
- Use same property names across components
- `State`, `Size`, `Type` are standard
- Avoid synonyms (don't mix `Style` and `Type`)

### 3. Default First
- Name default variant `State=Default` or `Type=Primary`
- Makes it clear what the base state is

### 4. Avoid Variant Explosion
Instead of:
```
✗ Button (State=Default, HasIcon=true)
✗ Button (State=Default, HasIcon=false)
✗ Button (State=Hover, HasIcon=true)
✗ Button (State=Hover, HasIcon=false)
```

Use:
```
✓ Button (State=Default) + ShowIcon boolean property
✓ Button (State=Hover) + ShowIcon boolean property
```

### 5. Properties vs Variants

**Use Variants for:**
- Different visual treatments (colors, shadows)
- Different sizes (padding, font size)
- Interactive states (hover, pressed)

**Use Properties for:**
- Content (text labels)
- Show/hide elements
- Swappable nested components

### 6. Test All Combinations
After creating variants:
```javascript
get_component_variants({ componentSetId })
```

Verify all expected variants exist and are properly configured.

## Swapping Variants on Instances

```javascript
// Get current instance info
get_instance_properties({ instanceId })

// Swap to different variant
swap_instance_component({
  instanceId: "456:789",
  newComponentId: "Size=Large"  // Just the variant name
})
```

Or with full variant selection:
```javascript
set_instance_properties({
  instanceId: "456:789",
  properties: {
    "Size": "Large",      // Variant property
    "State": "Hover"      // Variant property
  }
})
```
