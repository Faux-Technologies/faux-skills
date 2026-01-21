# Component Properties Reference

## Property Types

### TEXT Property
Exposes editable text content.

**Use cases:**
- Button labels
- Card titles
- Form field placeholders
- Any user-customizable text

**Setup:**
```javascript
// 1. Add property to component
add_component_property({
  componentId: componentId,
  propertyName: "Title",
  propertyType: "TEXT",
  defaultValue: "Card Title"
})

// 2. Bind to text node
bind_text_to_property({
  textNodeId: textNodeId,
  propertyKey: "Title#123:456"  // Key from step 1
})
```

**On instances:**
```javascript
set_instance_properties({
  instanceId: instanceId,
  properties: {
    "Title#123:456": "My Custom Title"
  }
})
```

### BOOLEAN Property
Controls visibility or other boolean states.

**Use cases:**
- Show/hide icon
- Show/hide description
- Toggle dividers
- Optional decorative elements

**Setup:**
```javascript
// 1. Add property
add_component_property({
  componentId: componentId,
  propertyName: "ShowDescription",
  propertyType: "BOOLEAN",
  defaultValue: true
})

// 2. Bind to visibility
bind_property_reference({
  nodeId: descriptionNodeId,
  nodeProperty: "visible",
  componentPropertyKey: "ShowDescription#123:456"
})
```

**On instances:**
```javascript
set_instance_properties({
  instanceId: instanceId,
  properties: {
    "ShowDescription#123:456": false  // Hides the description
  }
})
```

### INSTANCE_SWAP Property
Allows swapping nested component instances.

**Use cases:**
- Swappable icons
- Avatar/image placeholders
- Badge/label components
- Nested interactive elements

**Setup:**
```javascript
// 1. Add property
add_component_property({
  componentId: componentId,
  propertyName: "Icon",
  propertyType: "INSTANCE_SWAP",
  defaultValue: defaultIconComponentId  // Can be null
})

// 2. Bind to nested instance
bind_property_reference({
  nodeId: nestedIconInstanceId,
  nodeProperty: "mainComponent",
  componentPropertyKey: "Icon#123:456"
})
```

**On instances:**
```javascript
set_instance_properties({
  instanceId: instanceId,
  properties: {
    "Icon#123:456": differentIconComponentId
  }
})
```

## Property Key Format

Property keys have format: `PropertyName#NodeID`

Example: `Label#123:456`

- `Label` - The property name you defined
- `123:456` - Unique identifier Figma assigns

**Always use `get_instance_properties` to get the exact key:**
```javascript
const props = await get_instance_properties({ instanceId })
// Returns: { "Label#123:456": "Current Value", ... }
```

## Binding Targets

### For TEXT properties
Bind to: `characters` (text content)
```javascript
bind_text_to_property({
  textNodeId: nodeId,
  propertyKey: key
})
```

### For BOOLEAN properties
Bind to: `visible` (node visibility)
```javascript
bind_property_reference({
  nodeId: nodeId,
  nodeProperty: "visible",
  componentPropertyKey: key
})
```

### For INSTANCE_SWAP properties
Bind to: `mainComponent` (instance's source component)
```javascript
bind_property_reference({
  nodeId: nestedInstanceId,
  nodeProperty: "mainComponent",
  componentPropertyKey: key
})
```

## Binding to Nodes (bindToNode)

`bindToNode` supports multiple formats for flexibility:

### Simple Name (Deep Search)
Just provide the node name - the tool searches all descendants:

```javascript
convert_to_component({
  nodeId: frameId,
  componentProperties: [
    {
      name: "Title",
      type: "TEXT",
      defaultValue: "Card Title",
      bindToNode: "Title"  // Finds "Title" anywhere in the tree
    }
  ]
})
```

If the name is ambiguous (multiple matches), the tool returns helpful errors:
- Lists all matching nodes with their full paths
- Suggests using explicit path array to resolve

### Path Array (Explicit Navigation)
For deeply nested or ambiguous nodes, use path arrays:

```javascript
convert_to_component({
  nodeId: frameId,
  componentProperties: [
    {
      name: "ButtonLabel",
      type: "TEXT",
      defaultValue: "Click",
      bindToNode: ["Header", "Actions", "Button", "Label"]
      //           ^-- Path through nested layers
    }
  ]
})
```

## Property Naming Conventions

| Pattern | Example | Use Case |
|---------|---------|----------|
| Descriptive | `ButtonLabel` | Clear purpose |
| Show/Hide | `ShowIcon` | Boolean visibility |
| Has | `HasDivider` | Boolean presence |
| Element name | `Icon` | Instance swap |
| Slot | `LeadingSlot` | Generic swap area |

## Preferred Values

For TEXT properties, you can suggest common values:

```javascript
edit_component_property({
  componentId: componentId,
  propertyName: "Status",
  newDefinition: {
    defaultValue: "Active",
    preferredValues: [
      { type: "TEXT", value: "Active" },
      { type: "TEXT", value: "Inactive" },
      { type: "TEXT", value: "Pending" },
      { type: "TEXT", value: "Error" }
    ]
  }
})
```

Users see these as quick-select options in Figma.

## Common Patterns

### Card Component
```javascript
properties: [
  { name: "Title", type: "TEXT", defaultValue: "Card Title" },
  { name: "Description", type: "TEXT", defaultValue: "Card description" },
  { name: "ShowDescription", type: "BOOLEAN", defaultValue: true },
  { name: "ShowImage", type: "BOOLEAN", defaultValue: true },
  { name: "ActionLabel", type: "TEXT", defaultValue: "Learn More" }
]
```

### Button Component
```javascript
properties: [
  { name: "Label", type: "TEXT", defaultValue: "Button" },
  { name: "ShowLeadingIcon", type: "BOOLEAN", defaultValue: false },
  { name: "ShowTrailingIcon", type: "BOOLEAN", defaultValue: false },
  { name: "LeadingIcon", type: "INSTANCE_SWAP", defaultValue: null },
  { name: "TrailingIcon", type: "INSTANCE_SWAP", defaultValue: null }
]
```

### List Item Component
```javascript
properties: [
  { name: "Title", type: "TEXT", defaultValue: "List Item" },
  { name: "Subtitle", type: "TEXT", defaultValue: "Description" },
  { name: "ShowSubtitle", type: "BOOLEAN", defaultValue: true },
  { name: "LeadingElement", type: "INSTANCE_SWAP", defaultValue: avatarId },
  { name: "TrailingElement", type: "INSTANCE_SWAP", defaultValue: chevronId },
  { name: "ShowDivider", type: "BOOLEAN", defaultValue: true }
]
```

### Input Field Component
```javascript
properties: [
  { name: "Placeholder", type: "TEXT", defaultValue: "Enter text..." },
  { name: "Label", type: "TEXT", defaultValue: "Label" },
  { name: "ShowLabel", type: "BOOLEAN", defaultValue: true },
  { name: "ShowHelperText", type: "BOOLEAN", defaultValue: false },
  { name: "HelperText", type: "TEXT", defaultValue: "Helper text" },
  { name: "LeadingIcon", type: "INSTANCE_SWAP", defaultValue: null },
  { name: "TrailingIcon", type: "INSTANCE_SWAP", defaultValue: null }
]
```

## Exposed Instances

For INSTANCE_SWAP to work, the nested instance must be **exposed**:

```javascript
// During conversion
convert_to_component({
  nodeId: frameId,
  autoExposeInstances: true  // Exposes all nested instances
})

// Or manually
expose_nested_instance_by_path({
  parentInstanceId: componentId,
  childPath: ["Icon Container", "Icon"],
  isExposed: true
})
```

Check exposed instances:
```javascript
get_nested_instance_tree({ instanceId: componentId })
// Shows: { exposedInstanceId: "I123:456;789:012", isExposed: true }
```

## Troubleshooting

### Property not appearing on instance
- Check binding was successful
- Verify node exists at the path
- Ensure property was added to ComponentSet (not variant)

### Instance swap not working
- Verify nested instance is exposed
- Check the instance is actually an INSTANCE node type
- Ensure property type is INSTANCE_SWAP

### Text not updating
- Verify text node binding
- Check property key format matches exactly
- Ensure you're updating the correct instance

### Duplicate Properties
`add_component_property` prevents duplicates by default:
- If a property with the same name exists, returns `alreadyExists: true` with existing property info
- Use `allowDuplicate: true` to create anyway (will get suffix like "Name2")
- This prevents accidental creation of "Title", "Title2", "Title3" etc.

### Deleting Properties
`delete_component_property` accepts either format:
- Base name: `"Title"` → auto-resolves to full key
- Full key: `"Title#123:456"` → exact match

If base name has multiple matches (rare), tool shows all options and asks for full key.
