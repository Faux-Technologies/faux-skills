# Design Aesthetics Reference

Create distinctive, production-quality Figma designs that avoid generic "AI slop" aesthetics.

---

## Design Thinking

Before creating anything, understand the context and commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick a clear direction: brutally minimal, maximalist, retro-futuristic, organic/natural, luxury/refined, playful, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian
- **Constraints**: Platform (mobile/desktop), brand guidelines, accessibility
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is **intentionality**, not intensity.

---

## Visual Design Guidelines

### Typography

**DO:**
- Choose distinctive, characterful fonts that elevate the design
- Pair a striking display font with a refined body font
- Create clear hierarchy through size, weight, and spacing
- Use variable font features when available

**DON'T:**
- Default to Inter, Roboto, Arial, or system fonts
- Use the same font weight everywhere
- Ignore line-height and letter-spacing
- Make every heading the same size

### Color & Theme

**DO:**
- Commit to a cohesive color palette using design tokens
- Use dominant colors with sharp accents
- Create proper light/dark mode with inverted semantics
- Let backgrounds and surfaces breathe

**DON'T:**
- Use purple gradients on white backgrounds (clichéd AI aesthetic)
- Distribute colors evenly without hierarchy
- Ignore contrast for accessibility
- Use colors without semantic meaning

### Spatial Composition

**DO:**
- Create unexpected layouts with asymmetry and tension
- Use generous negative space OR controlled density
- Break grids intentionally for emphasis
- Create visual rhythm through repetition and variation

**DON'T:**
- Center everything without purpose
- Use uniform spacing throughout
- Make every section look identical
- Ignore the relationship between elements

### Visual Details

**DO:**
- Create atmosphere through gradients, shadows, and subtle textures
- Use shadows that feel natural to the lighting direction
- Add subtle motion cues through component states
- Pay attention to micro-details (border radius, padding, alignment)

**DON'T:**
- Default to flat, lifeless surfaces
- Use harsh drop shadows uniformly
- Ignore hover and active states
- Leave corners and edges unrefined

---

## Figma-Specific Excellence

### Component Design

When building components with `create_from_schema`:

1. **Intentional sizing**: Every dimension should be deliberate, not arbitrary
2. **Meaningful tokens**: Use variable bindings that reflect the design system's philosophy
3. **Proper states**: Build in hover, active, disabled states from the start
4. **Exposed properties**: Make the right things configurable, hide implementation details

### Screen Composition

When assembling screens:

1. **Visual hierarchy**: Guide the eye through the interface
2. **Content rhythm**: Vary section heights and densities
3. **Breathing room**: Use spacing tokens consistently but not monotonously
4. **Edge treatment**: Pay attention to how content meets the screen edges

### Icon & Image Treatment

1. **Icon consistency**: Use a single icon set throughout
2. **Image composition**: Consider aspect ratios, focal points, and cropping
3. **Visual weight**: Balance icons and images with surrounding elements
4. **Token binding**: Bind icon colors to content tokens for theming

---

## Anti-Patterns (NEVER Do These)

| Anti-Pattern | Why It Fails | Instead |
|--------------|--------------|---------|
| Inter/Roboto everywhere | Generic, forgettable | Choose distinctive fonts |
| Purple gradient on white | Clichéd AI aesthetic | Develop unique color identity |
| Uniform 16px spacing | Monotonous, no rhythm | Vary spacing intentionally |
| Every card looks identical | Boring, no hierarchy | Differentiate by importance |
| Centered everything | No visual tension | Use asymmetry purposefully |
| Flat, colorless surfaces | Lifeless, no depth | Add subtle gradients/shadows |
| Random corner radius values | Inconsistent, unrefined | Use radius tokens consistently |

---

## Execution Principles

1. **Match complexity to vision**: Maximalist designs need elaborate detail. Minimalist designs need restraint and precision.

2. **Sweat the details**: The difference between good and great is in the micro-refinements — padding, alignment, color values, shadow blur.

3. **Be decisive**: Avoid safe, middle-ground choices. Strong opinions, loosely held.

4. **Verify visually**: Use `get_screenshot` frequently. If it doesn't look exceptional, iterate.

5. **Don't converge on defaults**: Each design should feel unique. Vary themes, fonts, and aesthetics across different projects.

---

## Remember

Claude is capable of extraordinary creative work in Figma. Don't hold back. Show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

The goal is not just structurally correct designs — it's designs that are **visually striking, memorable, and meticulously refined**.
