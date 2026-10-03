# ERNS Real Estate — Balanced Brand & Neutral Color System

This document defines the visual identity and color balancing rules for the ERNS Real Estate platform.

---

## 🎨 Approved Color Roles & Palette

The platform uses **3 Brand Colors** alongside **White (#FFFFFF)** for clean, spacious, high-end real-estate UI contrast:

| Color Role | Color Name | HEX Code | UI Application |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | **Deep Green** | `#30360E` | Primary buttons, main headings, brand logo, active navigation states, primary icons, key UI actions. |
| **Secondary Brand** | **Olive** | `#787F56` | Secondary buttons, supporting text, subtle borders, tags, secondary icons, accents. |
| **Warm Section Accent** | **Clay Beige** | `#E2D4B9` | Alternating section backgrounds, hero backgrounds, warm decorative areas, section contrast. |
| **Clean Neutral Surface** | **White** | `#FFFFFF` | Property cards, content cards, search panels, forms, inputs, modals, navigation surfaces, clean UI breathing space. |

---

## 📐 Visual Layering Pattern

To ensure clear visual hierarchy and visual separation:

```
Clay Beige Section / Background (#E2D4B9)
 └── White Property & Content Cards (#FFFFFF)
      ├── Deep Green Headings & Buttons (#30360E)
      └── Olive Subtitles, Icons & Borders (#787F56)
```

---

## 🚫 Rules & Guidelines

1. **White (#FFFFFF)** is a fully approved neutral surface color. Do NOT fill every card or surface with Clay Beige.
2. **Clay Beige (#E2D4B9)** is used for alternating section backgrounds and warm contrast areas, not everywhere.
3. **No Unapproved Colors**: Do NOT introduce blue, red, orange, purple, bright green, or random grays.
4. **CSS Tokens**:
   - `--color-primary`: `#30360E`
   - `--color-accent`: `#787F56`
   - `--color-bg-warm`: `#E2D4B9`
   - `--color-surface`: `#FFFFFF`
