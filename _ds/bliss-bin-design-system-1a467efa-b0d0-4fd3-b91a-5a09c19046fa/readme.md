# Bliss Bin Design System

Original design system for **Bliss Bin** (also styled "The Bliss Bin" on the client's existing logo) — a premium curated-gifting service serving corporate HR/leadership teams (bulk onboarding, festive, and appreciation kits) and urban B2C gifting for weddings, anniversaries, and festivals in India.

**Source provided:** one reference image, `uploads/Screenshot 2026-07-18 212746.png` — the brand's own existing logo lockup ("THE BLISS BIN · CURATED HAMPERS", forest-green serif wordmark with a gold gift-ribbon monogram on cream). No codebase, Figma file, or additional brand materials were attached. Per the brief, this system does **not** copy any reference design system's colors/type/spacing — it is originated from scratch, informed only by the brand's own logo and the brand/audience description supplied.

This means: **no other source of truth exists yet.** Everything below — palette, type, components, the two UI kits — is a first-pass origination meant to be iterated against real product screens, brand guidelines, or a Figma file once available.

## Index

- `styles.css` — root stylesheet, imports everything under `tokens/`
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `shadows.css`, `motion.css`, `fonts.css`
- `assets/` — `logo-full.png`, `logo-mark.png` (cropped from the supplied logo; see Iconography)
- `guidelines/` — foundation specimen cards (colors, type, spacing, radius, shadow, motion, brand) shown in the Design System tab
- `components/core/` — Button, IconButton, Badge, Tag, Avatar
- `components/forms/` — Input, Textarea, Select, Checkbox, Radio, Switch
- `components/feedback/` — Toast, Tooltip, Dialog
- `components/navigation/` — Tabs, Breadcrumb, Accordion
- `components/data/` — Card, EmptyState, ProductCard
- `ui_kits/marketing/` — Bliss Bin marketing website (B2C-facing home)
- `ui_kits/dashboard/` — Corporate Gifting Dashboard (B2B bulk-order console)
- `ui_kits/storefront/` — Full B2C shopping flow: Home, product listing, product detail, cart drawer, checkout
- `SKILL.md` — Claude Code / Agent Skill wrapper for this system

## Components (20)

Accordion, Avatar, Badge, Breadcrumb, Button, Card, Checkbox, Dialog, EmptyState, IconButton, Input, ProductCard, Radio, Select, Switch, Tabs, Tag, Textarea, Toast, Tooltip.

**Intentional additions:** since no codebase/Figma defined a component inventory, this is an authored "standard set" sized to the brand's two platforms (marketing site + B2B dashboard) — forms-heavy for bulk ordering, plus Toast/Dialog/EmptyState for the operational states a dashboard needs. Nothing here should be read as copied from a specific library.

---

# 1. Brand Philosophy

Bliss Bin exists to remove the anxiety from gifting — the scramble to find something that doesn't feel generic, the guilt of a forgettable corporate hamper, the risk of a swap-out that undermines carefully wrapped effort. The design system's job is to make every screen feel like **the moment right before you open a beautifully wrapped box**: unhurried, considered, warm — never cluttered, discount-coded, or algorithmic like the mass-market gifting sites it competes against.

**Design principles → why they exist:** the visual language leans on a deep forest green (trust, permanence, an evergreen relationship rather than a one-off transaction) and a warm gilt gold (ceremony, the ribbon on the box, the one moment of shine) sitting on a cream "linen" neutral — the color of unbleached wrapping paper, not clinical white. This is a deliberate 90/10 rule: forest + cream carry 90% of every surface; gold is reserved for the few moments that deserve to shine (a CTA, a premium badge, a divider) so it never cheapens into wallpaper.

**Brand voice:** warm, precise, quietly confident — a well-briefed concierge, not a salesperson. Copy states what a gift does for the relationship, not just what's in the box.

**Why the system exists:** Bliss Bin runs two very different surfaces — a B2C marketing/ordering experience that must feel boutique and emotional, and a B2B bulk-ordering dashboard that must feel efficient and trustworthy at HR-procurement scale. One shared token set keeps both feeling like the same company without forcing the dashboard to be twee or the marketing site to feel like enterprise software.

---

# 2. Design Principles

**Clarity** — every screen answers "what do I do next" in one glance. Bulk-order flows in particular (240 hampers, 40 recipients, a finance approval step) fail if hierarchy is muddy; Title → Body → Caption sizes are never skipped or inverted.

**Consistency** — one Button component with five variants, never a bespoke button per team. The forest/gold role split (primary action vs. ceremonial moment) is fixed across marketing and dashboard so switching context never re-teaches the user what color means.

**Hierarchy** — serif Petrona is reserved for emotional headline moments (hero copy, empty-state titles); Public Sans carries every functional word. A page that's "all serif" or "all sans" has lost its hierarchy.

**Accessibility** — see §17 in full; the short version is 4.5:1 minimum body-text contrast, a visible 3px focus ring on every interactive element (never color-only), and 44px+ touch targets on anything tappable.

**Motion with purpose** — durations skew slightly longer than a typical SaaS app (220ms base vs. the more common 150–180ms) because gifting should feel unwrapped, not clicked through. No bounce/overshoot easing on utility UI — that reads as playful-app, not premium-gifting.

**Delight** — reserved for genuinely ceremonial moments (an order-confirmed state, a gift-note preview) rather than sprinkled into every hover. Restraint is itself the delight signal for a premium brand.

**Performance** — inline CSS custom properties, no runtime theme computation, system-first font fallbacks so first paint never waits on a webfont round-trip.

**Scalability** — semantic aliases (`--color-primary`, `--surface-elevated`) sit in front of numbered base ramps (`--forest-600`) so a future rebrand only touches the alias layer, never every component.

---

# 3. Color System

Full ramps and swatches live in `tokens/colors.css` and the Colors cards in the Design System tab. Summary:

| Role | Token | Hex (mid-tone) | Usage |
|---|---|---|---|
| Primary | `--color-primary` (`--forest-600`) | `#3E5C41`→ tuned oklch | Primary buttons, links, active nav, brand chrome |
| Secondary/Accent | `--color-secondary` (`--gilt-500`) | warm gold oklch | Ceremonial CTAs, premium badges, dividers — used sparingly |
| Neutral | `--bin-*` | cream→espresso ramp | Page background, surfaces, borders, body text |
| Success | `--color-success` (`--sage-600`) | muted sage | Delivered, confirmed, in-stock |
| Warning | `--color-warning` (`--amber-600`) | warm amber | Pending approval, low stock |
| Error | `--color-error` (`--terracotta-600`) | muted terracotta (never a cold red — stays in the warm family) | Failed payment, validation |
| Info | `--color-info` (`--dusk-600`) | dusty blue | Neutral system notices |

**Accessibility notes:** `--text-primary` on `--surface`/`--bg-page` exceeds 12:1. `--color-on-primary` (cream) on `--forest-600` exceeds 5:1. Gold text (`--gilt-700`) is only ever used on light surfaces, never as body text on forest — gold-on-forest is reserved for large display type or iconography where AA-large (3:1) applies. Semantic subtle backgrounds (`*-subtle`) always pair with their `*-strong`/base color for text, never with `--text-primary`, to guarantee contrast without per-instance checking.

**Usage guidance:** forest and cream are the "always-on" pair; gold never exceeds ~10% of any composition (a single button, one divider, one badge tone) — if a screen has more than one gold element competing for attention, one of them should move to forest or neutral.

---

# 4. Typography

**Display/Heading/Title — Petrona** (serif). Chosen for the brand: its high-contrast, slightly condensed serif forms echo the wordmark's own serif "B" without imitating it directly, and its italic is genuinely elegant rather than a slanted-roman fake — used for the occasional emotional aside ("for people who notice details"). **Body/Caption/Label/Button — Public Sans** (humanist grotesque). Chosen for warmth and legibility at small sizes across a data-dense B2B dashboard — it reads less corporate-neutral than Helvetica-style grotesques while staying invisible in long paragraphs. **Mono — JetBrains Mono** for order IDs/SKUs.

> **Font substitution flag:** the source material was a logo image only — no licensed brand typeface files were supplied. Petrona, Public Sans, and JetBrains Mono are Google Fonts chosen to match the logo's serif character and the brand's approachable-premium personality. If Bliss Bin owns or licenses specific fonts, please share the files and this system will swap them in at the token layer (`tokens/fonts.css`) with no component changes needed.

Full scale (family/weight/size/line-height/tracking) is defined in `tokens/typography.css` and shown on the Type cards: Display 56px/1.05, H1 40px, H2 32px, H3 24px/600, Title 20px/600, Body Large 18px, Body 16px, Body Small 14px, Caption 13px, Label 13px/600/tracked, Eyebrow 13px/600/wide-tracked, Button 15px/600.

---

# 5. Spacing System

4px base scale (`--space-1` = 4px … `--space-14` = 160px), fine increments below 24px for control padding/icon gaps, coarsening to 8/16px steps above that for layout rhythm — see `tokens/spacing.css` and the Spacing cards. Semantic aliases: `--space-component-*` (control padding), `--space-stack-*` (vertical rhythm within a section), `--space-section-*` (between major page sections), `--space-container-padding*` (page gutters).

---

# 6. Grid System

- **Desktop** (≥1280px): 1200px max content width, 12 columns, 24px gutters, 64px page margins.
- **Tablet** (768–1279px): fluid width, 8 columns, 20px gutters, 32px margins.
- **Mobile** (<768px): fluid width, 4 columns, 16px gutters, 16px margins.
- Marketing pages may go full-bleed for hero imagery/dividers; dashboard/app content always respects the column grid for scan-ability.

---

# 7. Border Radius

`--radius-xs` 4px (badges/checkbox squares) · `sm` 6px (inputs/buttons — `--radius-control`) · `md` 10px (small cards, images) · `lg` 16px (cards, modals — `--radius-card`/`--radius-modal`) · `xl` 24px (hero/feature cards) · `full` (pills/avatars/switches). Philosophy: hampers are structured boxes, not blobs — radius stays restrained; nothing above `xl` exists because anything rounder starts reading as a novelty/toy UI rather than premium packaging.

---

# 8. Shadows

Tinted warm brown-black (`hsl(20 15% 15%)`), never pure black, so elevation reads as soft daylight on linen rather than screen glare. Blur grows faster than offset (`xs`→`xl`) to imply a card physically lifting off the page rather than a flat drop-shadow filter. `--shadow-focus-ring` is a distinct 3px forest halo, kept separate from elevation shadows so focus state is never confused with a "raised" card.

---

# 9. Elevation

`--elevation-0` (flat, flush with page) → `1` hairline lift (list rows on hover) → `2` resting card → `3` popover/select menu → `4` sticky header/dropdown → `5` floating action → `modal` (heaviest, scrim-backed). Components reference `--elevation-*`, which map to the shadow tokens above — never hard-code a shadow value in a component.

---

# 10. Icons

No icon set was supplied with the source. **Lucide** (MIT, CDN-available, consistent 1.5–2px stroke, 2px corner radius on rounded caps) is recommended and substituted here — its restrained, non-filled line style matches the delicate line-art of the logo's gift-box icon better than a filled/glyph set would. Load via `https://unpkg.com/lucide@latest` or the `lucide-react` package. **This is a flagged substitution** — if Bliss Bin has an existing icon library, share it and this system will swap the recommendation. No emoji, no unicode-as-icon in product UI (the ✕/▾ glyphs inside component source are placeholder-only stand-ins pending real Lucide wiring and should be treated as such, not as the intended icon style).

---

# 11. Illustration Style

No illustrations or photography were supplied. Recommended direction, to be validated against real assets:
- **Photography over illustration** for hero/product imagery — warm, natural-light product shots of hampers and their contents (fits "premium/human" better than flat AI illustration or 3D renders).
- **Shape language:** if any supplemental graphic marks are ever created, they should extend the logo's own single-weight line-art motif (the gift-ribbon-and-heart icon) rather than introduce a new illustration system.
- **No gradients, no 3D, no AI-illustration style** — these read as mass-market/templated, the opposite of "curated."
- **Empty states:** a single calm line-icon + warm one-line copy + one action (see `EmptyState` component) — never a large illustration or mascot.
- **No mascot** — the brand voice is a concierge, not a character.

---

# 12. Motion System

Durations: `instant` 80ms (press feedback) · `fast` 150ms (hover) · `base` 220ms (default transitions) · `slow` 340ms (entrances) · `deliberate` 500ms (page-level reveals). Easing: `--ease-standard` for hover/press, `--ease-gift` (a gentle deceleration curve, `cubic-bezier(.22,.61,.36,1)`) for entrances — named for the "unwrap, don't rush" feeling. No spring/bounce easing anywhere in utility UI. **Hover:** background/border/color transitions only, `--motion-hover`. **Focus:** instant, never transitioned — a delayed focus ring reads as latency. **Pressed:** a 1px `transform: scale(0.98)`-style press via `--motion-press`, no color-only feedback. **Loading:** skeletons pulse at `--duration-deliberate`, never a spinner longer than 2s without a label. **Reduced motion:** fully respected via a global `prefers-reduced-motion` override in `tokens/motion.css`.

---

# 13–14. Components & Tokens

See "Components (18)" above for the full list and `components/<group>/` for source + `.d.ts` + `.prompt.md` per component. Each component consumes only semantic tokens (`--color-primary`, `--radius-control`, `--shadow-md`, etc.) — never a raw ramp value — so a future palette change is a one-file edit. Naming convention: `<category>.<role>[-<state>]`, e.g. `colors.primary`, `colors.primary-hover`, `spacing.component-md`, `radius.card`, `shadow.md`, `typography.body`, `motion.fast`.

---

# 15. Tailwind / CSS Variables

This system ships plain CSS custom properties (no build step required to consume it). To map into a Tailwind config:

```js
// tailwind.config.js (excerpt)
theme: { extend: {
  colors: {
    primary: 'var(--color-primary)', secondary: 'var(--color-secondary)',
    surface: 'var(--surface)', 'surface-sunken': 'var(--surface-sunken)',
    success: 'var(--color-success)', warning: 'var(--color-warning)', error: 'var(--color-error)', info: 'var(--color-info)',
  },
  borderRadius: { control: 'var(--radius-control)', card: 'var(--radius-card)', modal: 'var(--radius-modal)' },
  boxShadow: { xs: 'var(--shadow-xs)', sm: 'var(--shadow-sm)', md: 'var(--shadow-md)', lg: 'var(--shadow-lg)', xl: 'var(--shadow-xl)' },
  fontFamily: { display: 'var(--font-display)', body: 'var(--font-body)', mono: 'var(--font-mono)' },
}}
```

---

# 16. Figma Variables

Organize as: **Color** (`primitive/forest/50…900`, `primitive/gilt/50…900`, `primitive/bin/0…900`, `semantic/color-primary`, …) · **Spacing** (`primitive/space/1…14`, `semantic/space-component-sm…lg`) · **Typography** (text styles named `Display`, `H1`…`Caption`, each bound to family/size/line-height/tracking variables) · **Radius** (`radius/xs…full`) · **Shadow** (effect styles `xs…xl`, `overlay`) · **Motion** (documented as dev-mode annotations; Figma has no native duration/easing variable type yet) · **Component tokens**: component-level variables (`button/radius`, `button/padding-x`) alias back to the primitives above, never hard-coded.

---

# 17. Accessibility

WCAG 2.1 AA baseline. Body text ≥4.5:1, large text/icons ≥3:1 (checked against the ramps above). Every focusable element gets `--shadow-focus-ring` (3px, non-color-reliant) — never `outline: none` without a replacement. Full keyboard support: Tab/Shift-Tab order follows visual order, Enter/Space activate buttons, Esc closes Dialog, Arrow keys will drive Select/Tabs in production (documented in each `.prompt.md`, not fully wired in these prototype components). Screen readers: `aria-label` required on all IconButtons, `role="status"` on Toast, `role="tooltip"` on Tooltip, semantic `<label>` wiring on all form controls. Touch targets ≥44×44px on mobile (buttons/inputs are 44px tall by default). `prefers-reduced-motion` disables all transitions/animations globally.

---

# 18. Responsive Strategy

Desktop-first for the dashboard (HR/procurement users are overwhelmingly on desktop during bulk-order sessions); mobile-first for marketing/consumer flows. Both share the same grid breakpoints (§6). Dashboard tables collapse to stacked cards below 768px; marketing hero/grid layouts reflow from 3–4 columns → 2 → 1.

---

# 19. Design Patterns

Marketing (see `ui_kits/marketing/`): hero, curated collection grid, corporate-gifting cross-sell band, footer. Dashboard (see `ui_kits/dashboard/`): sidebar nav, bulk-order table, order-detail drawer pattern (via Dialog), empty/loading states. Storefront (see `ui_kits/storefront/`): sticky nav + search, home (hero, occasion grid, best-sellers, corporate band, testimonials), product listing with filters/sort, product detail (gallery, variants, gift note, accordion, related products), cart drawer (gift wrap, coupon, free-delivery progress), single-page checkout with confirmation state. Authentication, Settings, Pricing, Docs, AI Chat, Analytics: not built in this pass — flagged in Caveats below as candidates for a follow-up UI kit once prioritized.

---

# 20. Component Naming Convention

PascalCase component names matching their file (`Button.jsx`), grouped by concern directory (`core`, `forms`, `feedback`, `navigation`, `data`) rather than atomic/molecule/organism jargon — chosen because a design team of any size can guess "where's the Toast?" (feedback) faster than debating whether Toast is an atom or a molecule.

---

# 21. Design System Governance

**Versioning:** semver at the system level (`1.0.0` = this initial origination). A token value change is a minor bump; a component prop rename is a major bump. **Contribution:** new components require a `.d.ts` prop contract and a `.prompt.md` usage note before merge — undocumented components don't ship. **Review:** any new semantic color/spacing alias needs a one-line rationale (why existing tokens don't cover it) before addition — prevents token sprawl. **Deprecation:** mark a token `/* @deprecated use --x instead */` for one release cycle before removal; never delete silently.

---

# 22. Design QA Checklist

- [ ] Uses semantic tokens only — no hard-coded hex/px in component styles
- [ ] Focus ring visible and non-color-only on every interactive element
- [ ] Body text ≥14px, ≥4.5:1 contrast against its surface
- [ ] Touch targets ≥44×44px on mobile viewports
- [ ] Gold accent used on ≤1 element per composition
- [ ] Empty/loading/error states designed, not just the happy path
- [ ] Motion respects `prefers-reduced-motion`
- [ ] Component has `.d.ts` + `.prompt.md` before merge

---

# 23. Future Expansion

Year 1: replace substituted fonts/icons once brand files are supplied; expand UI kits to Settings, Auth, and Pricing patterns; add a Table/DataGrid component for bulk-order line items. Year 2–3: dark-mode surface/elevation ramp (forest becomes the dark base rather than an accent); a mobile app UI kit if Bliss Bin ships one. Year 3–5: multi-brand tokening if Bliss Bin white-labels the B2B platform for corporate clients' own branded gifting portals — the semantic-alias layer (§3/§13) is what makes that swap possible without touching component code.

---

## Content Fundamentals

**Tone:** warm, precise, quietly confident — like a concierge who already knows what you need, never a salesperson upselling. Sentences are short and concrete ("Delivered by Friday," not "Experience seamless delivery excellence").

**Voice/person:** B2C copy speaks directly to the giver — second person ("Add a note for Priya"), warm and specific. B2B/dashboard copy is first-person-plural/organizational ("Your order · 240 hampers · 3 approvals pending") — procurement language, not gift-emotion language, because HR buyers are evaluating logistics, not sentiment.

**Casing:** Sentence case everywhere in UI copy and headings (never Title Case, never ALL CAPS except short tracked eyebrows/labels which use letter-spacing to read as a deliberate label, not shouting).

**Emoji:** none. The brand's warmth comes from word choice and the gold/forest palette, not emoji — emoji would undercut "premium."

**Example lines:** hero — "Curated, considered gifting." / dashboard empty state — "No hampers yet. Build your first curated hamper in minutes." / order confirmation — "Order placed. Confirmation sent to priya@company.com." / CTA — "Send as Gift" (not "Buy Now" — reframes the transaction as the relationship it's for).

## Visual Foundations

**Colors:** forest green + cream carry ~90% of every surface; gold is a ~10% accent reserved for one CTA, one badge tone, or a divider per composition (see §3). **Type:** serif Petrona for the handful of emotional headline moments, Public Sans for everything functional (see §4) — a page is never "all serif." **Spacing:** 4px scale, generous section spacing (64–160px) on marketing, tighter component spacing (4–16px) in the dashboard's data-dense tables (see §5). **Backgrounds:** flat cream/forest fields, no gradients, no repeating patterns/textures — the one permitted "pattern" is the logo's own gift-ribbon-and-sparkle motif used sparingly as a section divider (see `guidelines/brand/ornament-divider.html`). **Photography:** warm, natural-light, product-focused — never cool/blue-toned or heavily desaturated (flagged as a recommendation pending real assets; see §11). **Animation:** gentle, no bounce — 220ms base, deceleration easing (see §12). **Hover states:** background/border/color shift only (e.g. `--forest-600` → `--forest-700`) — never a scale/shadow pop on hover, that's reserved for press feedback. **Press states:** a subtle scale-down via `--motion-press`, not a color change. **Borders:** 1px hairlines in `--border-subtle`/`--border-default`, never a colored left-border accent on cards (a pattern this system deliberately avoids as a dated "SaaS card" trope). **Shadows:** warm-tinted, elevation-based (§8/§9), never a generic black box-shadow. **Corner radii:** restrained, 4–24px (§7). **Cards:** hairline border by default, shadow-elevated only when floating over a tinted background (never both border + shadow at once). **Transparency/blur:** only on the modal scrim (`--surface-overlay`, 45% forest) — no frosted-glass panels elsewhere; blur would compete with the crisp, considered feeling the brand wants. **Imagery color vibe:** warm, minimal grain, no B&W (pending real photography).

## Iconography

No icon system was supplied with the source (the only asset was a logo screenshot). **Lucide** is recommended and substituted here for its restrained line style (see §10) — flagged for confirmation/replacement once real brand assets exist. No emoji, no unicode-as-icon in shipped product UI. The two real brand assets copied into `assets/` are `logo-full.png` (full lockup) and `logo-mark.png` (the B-monogram + gift-ribbon icon cropped from the same source, for favicons/avatars/loading states) — both cropped directly from the supplied screenshot, never redrawn.

## Caveats & Ask

- **No codebase, Figma file, or brand guideline doc was attached** — only one logo screenshot. Every color, font, spacing value, and component in this system is an original first pass reasoned from that logo + the brand brief, not extracted from an existing product. Please treat this as v1 to react to, not a locked spec.
- **Fonts are substituted** (Petrona / Public Sans / JetBrains Mono, all Google Fonts) — no licensed Bliss Bin typeface was supplied. Share font files if the brand owns/licenses specific ones.
- **Icons are substituted** (Lucide recommended, not yet wired as real SVGs in components — placeholder glyphs sit in component source pending that integration).
- **No product photography, illustration, or additional brand assets** exist yet beyond the two logo crops — the Illustration/Photography guidance in §11 is a recommendation to validate, not a documented existing style.
- **Only 3 of the 5 "Design Patterns" platforms are built** (marketing site, B2B dashboard, B2C storefront) — a native mobile app kit wasn't built this pass.
- **The storefront is a cosmetic recreation, not production commerce logic** — cart math, coupons, and delivery slots are illustrative; wire real inventory/payment/shipping before shipping.

**Bold ask:** send real product screens, a Figma file, brand guidelines, or actual photography/fonts if they exist anywhere — even partial — and this whole system gets rebuilt from ground truth instead of informed guesswork. In the meantime, tell me which piece to iterate on first: the color/type direction, the dashboard, or the marketing site.
