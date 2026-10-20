# Walkthrough: how the page is built and how it moves

One part per top-level section, top to bottom, as measured at 1440 px. Sizes are CSS pixels; colours are as computed. Every file named here is in this folder. How things move and behave (scrolling, page changes, the menu, hovers), step by step, is in `reference/motion/README.md`.

## 01 · div

- **Box:** 1440×80 px, starting 0 px from the top. Background rgba(0, 0, 0, 0), text rgb(0, 0, 0).
- **Layout:** flex row of 3, gap normal, flex-start/center.
- **Type:** Times New Roman 400 16px/normal · Inter 400 15px/40px · Inter 400 15px/24px · Inter 700 14px/40px · Arial 400 13.3333px/normal (family weight size/line-height, most text first).
- **Inside:** 13 headings, 1 paragraph, 11 buttons, 71 links, 2 pictures, 6 drawings.
- **Look:** `reference/sections/01-div.jpg` and its anatomy `reference/sections/01-div.anatomy.jpg`.
- **Markup:** `reference/sections/01-div.html`.
- **Pictures:** `reference/assets/images/003-z-logo-default-visual-refresh.svg`, `reference/assets/images/004-z-logo-white-visual-refresh.svg`.
- **Hover:** `.ivHafp:not(:active):hover:not(:disabled)` changes color; `.jWVnYy:hover:not(:disabled)` changes background, border-color, color; `.OTCIk:hover:not(:disabled)` changes background, border-color, color; `.dGfGKQ:hover` changes text-decoration, color; `.iBSJmc .pfs__sc-1dpbk03-0:hover` changes color; `.cswURT > li a:hover` changes text-decoration; `body.znav-transparent .pfs__sc-80tljk-0 ul[data-zg-section="reg-login"][data-display-my-zillow="true"] a:hover` changes text-decoration, color; `body:not(.mobile-web):not(.tablet-web):not(.znav-force-mobile-layout) #page-header-container .pfs__sc-1elvxkv-2 > li:hover .pfs__xukzw9-0` changes visibility, opacity, transition; `body:not(.mobile-web):not(.tablet-web):not(.znav-force-mobile-layout) #page-header-container .pfs__sc-19pph06-0 .pfs__sc-1dpbk03-0:hover` changes color; `.fisCfR:hover` changes text-decoration.
- **Control states:** `reference/components/01-nav-link.jpg` (nav-link a.pfs__sc-1dpbk03-0.ivHafp: rest, hover, focus).
- **Control states:** `reference/components/02-nav-link.jpg` (nav-link a.pfs__sc-1dpbk03-0.ivHafp: rest, hover, focus).
- **Control states:** `reference/components/03-button.jpg` (button button.jWVnYy.pfs__sc-16wg7wj-0:nth-of-type(1): rest, hover, focus).

## 02 · div

- **Box:** 1440×408 px, starting 80 px from the top. Background rgba(0, 0, 0, 0), text rgb(0, 0, 0).
- **Layout:** flex row of 2, gap normal, center/center.
- **Type:** Times New Roman 400 16px/normal · Inter 400 16px/24px · Object Sans 900 60px/72px (family weight size/line-height, most text first).
- **Inside:** 1 heading, 2 buttons, 1 link, 3 pictures, 3 drawings, 1 field.
- **Look:** `reference/sections/02-div.jpg` and its anatomy `reference/sections/02-div.anatomy.jpg`.
- **Markup:** `reference/sections/02-div.html`.
- **Drawings:** `reference/assets/svg/001-icon-div.svg` (icon, 24×24), `reference/assets/svg/002-icon-div.svg` (icon, 24×24).
- **Pictures:** `reference/assets/images/005-4af10a9d5d4ea7de5a33fba1eb5faca7.svg`, `reference/assets/images/006-image2-sm-2x.jpg` (750×616), `reference/assets/images/007-image2-m-2x.jpg` (1536×976), `reference/assets/images/008-image2-lg-2x.jpg` (2048×976), `reference/assets/images/009-image2-xl-2x.webp` (3840×976), `reference/assets/images/010-image2-xl-1x.webp` (1920×488).
- **Motion:**
  - script writes `transform` on `div > div > form.c11n.c11n_form > div:nth-of-type(2) > div.c11n.sbsa-eDVSkX` 4 times over 749 ms (on load): from `translate(0px, 0px)` to `translate(386px, 74px)`
  - scripts add `.wtybt`, `.sbsa-cOHBIX`, `.sbsa-eMkodn`, `.sbsa-eMkogt`, `.sbsa-cRxwBT`, `.sbsa-cRxwCg`, `.sbsa-eTCxPS`, `.sbsa-cUOXSY`, `.sbsa-cUOXPS`, `.lgkJlM`, `.iOhzkD`, `.sbsa-ifZmBV`, `.sbsa-ifZmCe` to 16 elements as the page scrolls (first at scrollY 0)
- **Film:** `reference/motion/films/01-scripted-div.jpg` (Scripted div: 1 moving part (transform); it is `div.dUHUfY:nth-of-type(1) > div.yLqXB > div.QzZPU > div.iOhzkD:nth-of-type(2) > div.lgkJlM` in the markup; frames captioned with ms).
- **Hover:** `.bgDMJi:not(:active):hover:not(:disabled)` changes color; `.sbsa-esypMX:hover` changes something.
- **Control states:** `reference/components/04-input.jpg` (input input.c11n.c11n_combobox__input: rest, hover, focus).
- **Control states:** `reference/components/05-button.jpg` (button button.c11n.c11n_icon-button:nth-of-type(2): rest, hover, focus).

## 03 · div

- **Box:** 1440×1461 px, starting 488 px from the top. Background rgba(0, 0, 0, 0), text rgb(0, 0, 0).
- **Layout:** flex row of 2, gap normal, space-evenly/center.
- **Type:** Inter 400 16px/24px · Inter 400 14px/24px · Object Sans 900 20px/24px · Inter 700 12px/16px · Inter 700 16px/24px (family weight size/line-height, most text first).
- **Inside:** 5 headings, 7 paragraphs, 4 buttons, 2 links, 12 pictures.
- **Look:** `reference/sections/03-div.jpg` and its anatomy `reference/sections/03-div.anatomy.jpg`.
- **Markup:** `reference/sections/03-div.html`.
- **Pictures:** `reference/assets/images/011-1d9d5bce566c85fa242cb21ad3292cb8.webp` (513×416), `reference/assets/images/012-f102736268b1de55ce81ea6e5219e15d.webp` (513×416), `reference/assets/images/013-0b326d5cfd5d9622edb6b1e7c5b6f8d2.webp` (355×275), `reference/assets/images/014-c45ff4889526375d32314844d0b67d8a.webp` (320×320), `reference/assets/images/015-e9737a930518048728251f1671effc95.webp` (320×320), `reference/assets/images/016-5d69598eba004b778f74b62a86a30695.webp` (320×320).
- **Motion:**
  - scripts add `.bzMtgl`, `.bmqbVI` to 6 elements as the page scrolls (first at scrollY 0)
- **Film:** `reference/motion/films/02-reveal-div.jpg` (Reveal: +bzMtgl; it is `div.Grid-c11n-8-111-2__sc-18zzowe-0.fcUiNz > div:nth-of-type(1) > div.cXGGCH.bmqbVI > div.kClhBz:nth-of-type(2) > button.bzMtgl` in the markup; frames captioned with ms).
- **Hover:** `.bgDMJi:not(:active):hover:not(:disabled)` changes color; `.bzMtgl:hover:not(:disabled)` changes background, border-color, color; `.NBfwD:hover:not(:disabled)` changes background, border-color, color; `.irrKCu .StyledPropertyCardBody-c11n-8-111-2__sc-1danayh-0:hover` changes background.
- **Control states:** `reference/components/06-card.jpg` (card div.cXGGCH.bmqbVI: rest, hover, focus).
- **Control states:** `reference/components/07-card.jpg` (card div.cXGGCH.bmqbVI: rest, hover, focus).

## 04 · div

- **Box:** 1440×272 px, starting 1949 px from the top. Background rgba(0, 0, 0, 0), text rgb(0, 0, 0).
- **Layout:** grid, 4 columns (308.25px 308.25px 308.25px 308.25px), gap normal.
- **Type:** Inter 400 14px/24px · Inter 400 16px/24px · Inter 700 16px/24px (family weight size/line-height, most text first).
- **Inside:** 2 headings, 214 paragraphs, 4 buttons, 213 links, 4 drawings.
- **Look:** `reference/sections/04-div.jpg` and its anatomy `reference/sections/04-div.anatomy.jpg`.
- **Markup:** `reference/sections/04-div.html`.
- **Drawings:** `reference/assets/svg/003-icon-div.svg` (icon, 16×16, ×4).
- **Hover:** `.bgDMJi:not(:active):hover:not(:disabled)` changes color; `.gSXCju:not(:active):hover:not(:disabled)` changes text-decoration.

## 05 · div

- **Box:** 1440×693 px, starting 2221 px from the top. Background rgba(0, 0, 0, 0), text rgb(0, 0, 0).
- **Layout:** flex row of 2, gap normal, normal/normal.
- **Type:** Times New Roman 400 16px/normal · Inter 400 10px/16px · Inter 400 14px/24px · Inter 400 12px/normal · Inter 400 14px/16px (family weight size/line-height, most text first).
- **Inside:** 3 paragraphs, 40 links, 3 pictures, 4 drawings.
- **Look:** `reference/sections/05-div.jpg` and its anatomy `reference/sections/05-div.anatomy.jpg`.
- **Markup:** `reference/sections/05-div.html`.
- **Drawings:** `reference/assets/svg/004-icon-div.svg` (icon, 32×32), `reference/assets/svg/005-icon-div.svg` (icon, 32×32), `reference/assets/svg/006-icon-div.svg` (icon, 32×32), `reference/assets/svg/007-icon-div.svg` (icon, 32×32).
- **Pictures:** `reference/assets/images/003-z-logo-default-visual-refresh.svg`, `reference/assets/images/017-app-store-badge.svg`, `reference/assets/images/018-google-play-badge.svg`.
- **Hover:** `.ivHafp:not(:active):hover:not(:disabled)` changes color; `.ivHafp:not(:active):hover:not(:disabled)` changes color; `.lcrsxX:not(:active):hover:not(:disabled)` changes text-decoration; `.iDsNNg:not(:active):hover:not(:disabled)` changes text-decoration; `.dLUIkV:hover` changes color.

## 06 · div

- **Box:** 1440×2835 px, starting 79 px from the top. Background rgb(255, 255, 255), text rgb(0, 0, 0).
- **Layout:** stacked blocks.
- **Type:** Inter 400 10px/16px (family weight size/line-height, most text first).
- **Inside:** 1 paragraph, 5 links, 5 drawings, 3 fields.
- **Look:** `reference/sections/06-div.jpg` and its anatomy `reference/sections/06-div.anatomy.jpg`.
- **Markup:** `reference/sections/06-div.html`.
- **Drawings:** `reference/assets/svg/008-icon-div.svg` (icon, 24×24), `reference/assets/svg/009-icon-div.svg` (icon, 24×24), `reference/assets/svg/010-icon-div.svg` (icon, 24×24), `reference/assets/svg/011-icon-div.svg` (icon, 24×24), `reference/assets/svg/012-icon-div.svg` (icon, 24×24).
- **Motion:**
  - scripts add `.dg-blue`, `.dg-bottom` to 1 element as the page scrolls (first at scrollY 0)
- **Hover:** `.btpmaa:hover` changes color; `.btpmaa:hover > span` changes color; `.btpmaa:hover > :first-child` changes background, border.

## 07 · px-captcha-modal

- **Box:** 1440×900 px, starting 0 px from the top. Background rgba(0, 0, 0, 0), text rgb(0, 0, 0).
- **Layout:** stacked blocks.
- **Look:** `reference/sections/07-px-captcha-modal.jpg` and its anatomy `reference/sections/07-px-captcha-modal.anatomy.jpg`.
- **Markup:** `reference/sections/07-px-captcha-modal.html`.
