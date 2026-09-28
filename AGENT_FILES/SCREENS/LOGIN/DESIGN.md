---
name: Nocturne Violet
colors:
  surface: '#141219'
  surface-dim: '#141219'
  surface-bright: '#3a383f'
  surface-container-lowest: '#0f0d14'
  surface-container-low: '#1c1b21'
  surface-container: '#201f25'
  surface-container-high: '#2b2930'
  surface-container-highest: '#36343b'
  on-surface: '#e6e1ea'
  on-surface-variant: '#cac4d4'
  inverse-surface: '#e6e1ea'
  inverse-on-surface: '#312f37'
  outline: '#948e9d'
  outline-variant: '#494552'
  surface-tint: '#cebdff'
  primary: '#cebdff'
  on-primary: '#381385'
  primary-container: '#a78bfa'
  on-primary-container: '#3c1989'
  inverse-primary: '#674bb5'
  secondary: '#ddb8ff'
  on-secondary: '#490081'
  secondary-container: '#62259b'
  on-secondary-container: '#d1a1ff'
  tertiary: '#d0bcff'
  on-tertiary: '#3c0091'
  tertiary-container: '#ab88ff'
  on-tertiary-container: '#40009b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e8ddff'
  primary-fixed-dim: '#cebdff'
  on-primary-fixed: '#21005e'
  on-primary-fixed-variant: '#4f319c'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb8ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#62259b'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#141219'
  on-background: '#e6e1ea'
  surface-variant: '#36343b'
typography:
  display:
    fontFamily: Geist
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies a dark, moody, and ultra-refined developer portfolio aesthetic. It bridges celestial minimalism with tactile glassmorphism, evoking quiet confidence, technical mastery, and focused intimacy. The visual atmosphere is characterized by nocturnal ink tones, atmospheric violet radial gradients, soft-edged glassy floating controls, and clean typographic rhythms.

The target audience consists of design engineers, tech founders, collaborators, and aesthetic-driven developers who value thoughtful micro-interactions, subtle luminescence, and razor-sharp craftsmanship over loud ornamentation. The emotional response is contemplative, elegant, and technologically forward.

## Colors

The palette is rooted in deep obsidian-purple foundations with layered luminous violet highlights. 

- **Background Foundation**: Deep void `#09080e` creates the base canvas, transitioning into `#120e1d` and `#1a1429` for stepped depth and organic wavy terrain backdrops.
- **Atmospheric Glows & Accents**: Primary violet `#a78bfa` delivers pristine focal highlights and active states. Secondary bright violet `#c084fc` illuminates subtle borders and glowing gradients. Tertiary deep electric violet `#8b5cf6` drives interactive halos, focus outlines, and atmospheric backlights.
- **Glass & Surface Containers**: Translucent containers range from `rgba(26, 20, 41, 0.45)` to `rgba(255, 255, 255, 0.05)`, edged with whisper-thin frosted borders (`rgba(167, 139, 250, 0.12)` to `rgba(255, 255, 255, 0.1)`).
- **Text & Content**: Pure white `#ffffff` handles primary headlines and icons; muted lilac `#d4cce6` and faded slate-purple `#8e85a6` provide nuanced secondary and metadata hierarchies.

## Typography

The typography leverages **Geist** for crisp, geometric headers and UI elements alongside **Inter** for neutral, legible body text. Negative tracking across larger scales tightens visual impact, ensuring display titles appear confident and deliberate. Body text prioritizes breathing room and vertical rhythm against dark ambient surfaces.

## Layout & Spacing

Layouts follow a centered, focused column model within an adaptive fluid grid. The content container max-width remains tight (680px for profile and link sections; 960px for feed cards, project showcases, and bookmark lists), ensuring high visual focus with ample atmospheric breathing room on either flank.

- **Breakpoints**: 
  - Mobile: `< 640px` (single-column stack, compressed padding, edge safe areas).
  - Tablet: `640px – 1024px` (balanced fluid guttering, sticky bottom pill docks).
  - Desktop: `> 1024px` (centered viewport compositions, ambient peripheral glow fields).
- **Rhythm**: Strict multiples of 4px govern interior component paddings, while outer rhythm expands generously between content groupings to maintain a calm, uncrowded cadence.

## Elevation & Depth

Visual hierarchy is achieved through translucent glassmorphism, multi-layered backdrop blurs, and soft ethereal violet halos rather than traditional heavy drop shadows.

- **Base Canvas**: Solid nocturnal tone `#09080e` with deep ambient radial gradients tinted `#8b5cf6` at 8%–15% opacity positioned in the lower third or centered behind core identity anchors.
- **Glass Tiles & Containers**: `backdrop-filter: blur(16px)`, translucent fill `rgba(26, 20, 41, 0.5)`, framed by hairline stroke borders (`1px solid rgba(167, 139, 250, 0.15)`).
- **Elevated Controls & Floating Docks**: `backdrop-filter: blur(24px)`, `background: rgba(35, 27, 56, 0.65)`, rim lighting via `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 12px 32px -8px rgba(0, 0, 0, 0.6)`.
- **Active & Hover Glows**: Interactive hover states produce an inner radiance paired with a diffused ambient halo: `box-shadow: 0 0 20px rgba(167, 139, 250, 0.25), inset 0 0 12px rgba(192, 132, 252, 0.1)`.

## Shapes

The design system embraces a high-radius pill aesthetic (`roundedness: 3`). Navigation bars, category tags, action buttons, and social icons use full pill capsules (`rounded-full` or `9999px`). Content cards, modals, and embedded media containers retain softened rectangular geometry with gentle `rounded-2xl` (1.25rem) to `rounded-3xl` (1.75rem) corners, creating a continuous organic flow throughout the interface.

## Components

### Buttons & Pills
- **Primary Action Pill**: Translucent dark violet fill (`rgba(167, 139, 250, 0.12)`), solid 1px border (`rgba(167, 139, 250, 0.3)`), crisp white text. Hover triggers `background: rgba(167, 139, 250, 0.22)`, border brightness ramp, and a soft outer violet glow.
- **Floating Dock Navigation**: Fixed bottom-center capsule containing icon actions. Glass blurred (`blur(20px)`), `rgba(25, 18, 40, 0.7)` backdrop, 1px subtle gradient border, 8px internal padding, and gentle icon scale-up micro-interactions on hover.

### Cards (Bookmarks, Articles, Projects)
- **Structure**: Glass card with inset border highlights. Padding: `space-lg`.
- **Card Variants**:
  - *Bookmark / Link Tile*: Horizontal row with a frosted favicon/icon badge on the left, primary link title, truncated URL/description, and an external diagonal arrow indicator on hover.
  - *Article / Post Card*: Editorial layout featuring a timestamp chip, `headline-sm` title, subtle excerpt, and violet metadata tags.
  - *Tweet / Micro-thought Card*: Simplified minimalist container, white brand glyph, crisp typography, and understated engagement icons.
- **Hover Behavior**: Subtle Y-axis translation (`translate-y(-2px)`), card border transitions to `rgba(192, 132, 252, 0.4)`, and an underglow halo emerges.

### Chips & Badges
- Pill-shaped status indicators (`rounded-full`, 4px vertical, 12px horizontal padding). Semi-transparent fills with high-contrast text and occasional glowing dot status beacons (e.g., green for availability, violet for featured items).

### Form Inputs & Interactive Controls
- **Inputs**: Darkened inset capsules (`rgba(9, 8, 14, 0.6)`), 1px frosted boundary, placeholder text in muted purple. Focus introduces an electric violet stroke ring (`#8b5cf6`) with zero-distance outer glow.
- **Toggles & Checkboxes**: Pill toggles featuring glowing violet thumb states with smooth cubic-bezier transitions.