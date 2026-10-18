# zillow.com: design rules

A dark interface on a near-black neutral background where a dark indigo accent marks the next step. Type is Object Sans, corners are 12px, and depth comes from soft neutral shadows.

## Principles

### Soft, neutral depth

Lift raised elements with the measured shadow (rgba(0, 0, 0, 0.15) 0px 4px 15px 0px).

_Why:_ Shadows appear on about 9% of elements; they mark what floats above the page and are never tinted.

### Big type, quiet body

Pair 60px headings in Object Sans with 16px body text in Inter.

_Why:_ A 3.8× jump between headline and body creates strong hierarchy with few elements.

### A steady rhythm

Space everything on the 8px grid: 2, 8, 16, 24, 32, 48px.

_Why:_ 72% of measured spacing values fall on this grid, which is what makes the layout feel ordered.

### Consistent corners

Use 12px corners as the default radius.

_Why:_ It is the most common measured radius; one radius family is what makes separate components feel like one product.

## Never

- **Never tint shadows with colour.** Every measured shadow is neutral; a coloured glow would read as a different product.
- **Never introduce a second accent colour.** Only one saturated colour (#0041d9) carries weight in the measured palette.
- **Never animate longer than 200ms.** Every measured transition finishes within 200ms; slower motion would feel heavy here.
- **Never set button labels in all capitals.** No measured button uses uppercase text.
- **Never use spacing off the 8px grid.** 72% of measured spacing sits on it.

## Colour

- Dark theme: near-black neutral background (#00000000).
- Body text #ffffff on the background reads at 21.0:1; secondary text uses #535364.
- Accent #0041d9 (dark indigo) with #ffffff text on top of it.

## Typography

- Object Sans for headings, Inter for body.
- Scale: display 60px, h1 36px, h2 24px, h3 20px, body 16px, small 14px, caption 12px.
- Weights in use: 400, 700, 900.

## Shape and depth

- Radii: 12px (63%), 20px (21%), pill (15%).
- Borders: 1px in #0041d9.
- Shadows: rgba(0, 0, 0, 0.15) 0px 4px 15px 0px | rgb(126, 127, 142) 0px 0px 0px 1px inset.
