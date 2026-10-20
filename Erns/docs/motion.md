# Motion and Interactions

Quick and quiet: transitions run 200ms, 150ms.

- Default to 200ms transitions (79% of measured ones).
- Ease with ease.
- Animate background-color, border-color, color, box-shadow; avoid animating layout.
- Turn every loop and decorative animation off under prefers-reduced-motion, as the site does.

## Interactions

- **Hover** changes text colour (39% of hover rules), background colour (32% of hover rules), border (11% of hover rules), underline (7% of hover rules), background (1% of hover rules), shadow (1% of hover rules). Things rarely move on hover; they change colour.

## Measurements

- Durations: 200ms (79%), 150ms (21%)
- Easings: `ease`, `ease-out`, `steps(1)`, `linear`
- Animated properties: background-color, border-color, color, box-shadow, opacity, filter, transform, left

The site turns its motion off under `prefers-reduced-motion: reduce`. Do the same: every looping or decorative animation stops, and state changes happen instantly.
