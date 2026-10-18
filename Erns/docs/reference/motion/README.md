# How it moves, step by step

Every animation and behaviour found on the page, as recipes: what starts it, which element, which property from what to what, for how long, on which curve, in what order. Times are from the moment the trigger happens. Build them one at a time and check each against its film (frames captioned with their time, or with the scroll position).

Measured at 1440 px on www.zillow.com. Values in `code` are exactly as the browser reported them.

## When the page scrolls

### 1. Classes and attributes the scroll switches

- `div.dUHUfY:nth-of-type(1) > div.yLqXB > div.QzZPU > div.iOhzkD:nth-of-type(2) > div.lgkJlM` classes `+lgkJlM -wtybt`, 36 ms after the scroll.
- `div.jQUlFV:nth-of-type(1) > div.dUHUfY:nth-of-type(1) > div.yLqXB > div.QzZPU > div.iOhzkD:nth-of-type(2)` classes `+iOhzkD`, 36 ms after the scroll.
- `form.c11n.c11n_form > div.c11n.c11n_combobox__trigger > div.c11n.c11n_combobox__input-group > div.c11n.c11n_adorned-input__root > input.c11n.c11n_combobox__input` classes `-sbsa-cOHBIX -sbsa-eMkodn -sbsa-eMkogt`, 36 ms after the scroll.
- `div.c11n.c11n_combobox__trigger > div.c11n.c11n_combobox__input-group > div.c11n.c11n_adorned-input__root > span.c11n.c11n_adorned-input__adornment > button.c11n.c11n_icon-button:nth-of-type(1)` classes `+sbsa-ifZmBV +sbsa-ifZmCe -sbsa-cRxwBT -sbsa-cRxwCg -sbsa-eTCxPS -sbsa-cUOXSY -sbsa-cUOXPS`, 36 ms after the scroll.
- `div.c11n.c11n_combobox__trigger > div.c11n.c11n_combobox__input-group > div.c11n.c11n_adorned-input__root > span.c11n.c11n_adorned-input__adornment > button.c11n.c11n_icon-button:nth-of-type(2)` classes `+sbsa-ifZmBV +sbsa-ifZmCe -sbsa-cRxwBT -sbsa-cRxwCg -sbsa-eTCxPS -sbsa-cUOXSY -sbsa-cUOXPS`, 36 ms after the scroll.

## Moving scenes (filmed)

### 2. Scripted div: 1 moving part (transform)

- **Film:** `reference/motion/films/01-scripted-div.jpg` (captions are ms).
- **Element:** `div.dUHUfY:nth-of-type(1) > div.yLqXB > div.QzZPU > div.iOhzkD:nth-of-type(2) > div.lgkJlM` in section `02-div`.

## Hovering (what scripts do; CSS hover rules are in styles.css)

### 3. Hovering `button.styledtextbutton-c11n-8-111-2__sc-1nwmfqo-0.gsxcju`

- 533 ms: `div:nth-of-type(3) > span:nth-of-type(2)` `font-family` `(unset)` → `"Aurora Cn BT"` (91 steps)
- **Film:** `reference/motion/hovers/01-button-styledtextbutton-.jpg`.

## The page's own code

The scripts the page ran are in `reference/scripts/` (20 files), so you can read exactly how each effect is made. Don't paste them in whole: rebuild each effect in the project's own code, following the recipe and the source together.

Not tried: navigation: cdpSession.send: Protocol error (Page.captureScreenshot): Not attached to an active page.
