# ERNS Real Estate — Active Color System

This document defines the visual identity and color balancing rules for the ERNS Real Estate platform.

---

## 🎨 Active Color Roles & Palette

The platform uses **3 Brand Colors** alongside **White (#FFFFFF)** and **Off-White (#F6FAFD)** for clean, high-end real-estate UI contrast:

| Color Role | Color Name | HEX Code | UI Application |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | **Deep Navy** | `#0A1931` | Primary buttons, main headings, brand logo, active navigation states, primary icons, key UI actions. |
| **Secondary Brand** | **Muted Blue** | `#4A7FA7` | Secondary buttons, supporting text, subtle borders, tags, secondary icons, accents. |
| **Warm Section Accent** | **Light Ice Blue** | `#B3CFE5` | Highlight sections, hero backgrounds, decorative areas, alternating accent bands. |
| **Clean Neutral Surface** | **White** | `#FFFFFF` | Property cards, content cards, search panels, forms, inputs, modals, navigation surfaces. |
| **Neutral Canvas / Off-White** | **Off-White / Soft Canvas** | `#F6FAFD` | Page background canvas, recommend section background, soft neutral alternating bands behind white cards. |

---

## 📐 Visual Layering Pattern

```
Light Ice Blue / Off-White Canvas Background (#B3CFE5 / #F6FAFD)
 └── White Property & Content Cards (#FFFFFF)
      ├── Deep Navy Headings & Buttons (#0A1931)
      └── Muted Blue Subtitles, Icons & Borders (#4A7FA7)
```

---

## 🚫 Rules & Guidelines

1. **White (#FFFFFF)** is the approved clean neutral surface color for cards, inputs, and raised surfaces.
2. **Off-White / Soft Canvas (#F6FAFD)** is the approved soft canvas background for pages and neutral sections (such as the Recommendations section), giving subtle depth behind pure white cards without harsh contrast.
3. **Light Ice Blue (#B3CFE5)** is used for subtle highlight sections and accent contrast.
4. **CSS Tokens**:
   - `--color-primary`: `#0A1931`
   - `--color-accent`: `#4A7FA7`
   - `--color-bg-warm`: `#B3CFE5`
   - `--color-surface`: `#FFFFFF`
   - `--color-off-white`: `#F6FAFD`

