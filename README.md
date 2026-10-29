# pausa

A concept storefront for a fictional Milan furniture studio. Built as a portfolio piece to show how far a static Astro site can go: editorial layout, a working cart, filters, side panels, booking and newsletter forms, and a considered motion system, with no UI framework.

> Concept project. No payments are taken and the brand, products and people are fictional. The design was prototyped in Claude Design and re-implemented here by hand.

## Highlights

- **Editorial layout.** Ten sections with deliberately offset, asymmetric grids built on flex-wrap and `clamp()` spacing, with one explicit breakpoint for the nav.
- **Working shop.** Product detail with per-product finishes, a bag keyed by product and finish, quantity controls and a live subtotal.
- **Filterable catalogue.** Category chips with `aria-pressed` state and staggered re-entry of the cards that come back.
- **One side panel, four views.** Product, bag, journal article and service info share a single dialog that slides in and out.
- **Forms with real states.** Showroom visit booking and newsletter signup validate natively and swap to a confirmation.
- **Motion with intent.** Frequency-aware animation: nothing on repeated actions, polish on first-time ones. See [Motion](#motion).
- **Zero framework JS.** Astro renders everything to static HTML. Interactivity is about 300 lines of TypeScript in two small scripts.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | [Astro](https://astro.build) 7 (static output) |
| Styling | [Tailwind CSS](https://tailwindcss.com) 4 via `@tailwindcss/vite`, tokens in `@theme` |
| Language | TypeScript (strict) |
| Fonts | Space Grotesk and DM Sans (Google Fonts) |
| Copy | Spanish (`lang="es"`) |

## Getting started

Requires Node 22.23.4 or newer (Astro 7 engine requirement) and [pnpm](https://pnpm.io) 11.

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # static output in dist/
pnpm preview   # serve the production build
```

## Project structure

```
src/
  pages/index.astro        Page composition
  layouts/Layout.astro     <head>, fonts, `js` flag for progressive enhancement
  components/              One file per section, plus the shared side panel
    Header, Hero, Collection, Objects, Materials, Interlude,
    Process, Journal, About, Visit, Footer, Panel
  data/
    products.ts            Products, categories, finishes, price formatting
    content.ts             Journal articles, service info, filter definitions
  scripts/
    shop.ts                Cart, panel views, filters, forms, menu
    reveal.ts              Scroll reveals (IntersectionObserver)
  styles/global.css        Theme tokens, base styles, motion layer
public/uploads/            Hero photograph
```

Content lives in `src/data/`. Adding a product means adding one entry to `products.ts` and one card to `Objects.astro`.

## Design tokens

Defined once in `src/styles/global.css` under `@theme` and used as Tailwind utilities.

| Token | Value | Use |
| --- | --- | --- |
| `primario` | `#33D17A` | Hero, interlude, visit, primary buttons |
| `verde` | `#0B6B3A` | Eyebrows and links on light backgrounds |
| `ocre` | `#FFE14D` | Accents, focus ring, selection |
| `crema` | `#FBF8EF` | Light surfaces |
| `tinta` | `#1F2A24` | Text and dark sections |

The bright green is too light for cream text, so every surface that uses it carries dark ink. The deeper `verde` exists only for small text on cream, where the bright green would fail contrast.

## Motion

Animation follows one question: how often will someone see this?

- **Hero.** One-shot staggered entrance (80ms steps, ease-out).
- **Scroll reveals.** Fade and 16px rise, once per element, staggered by `--d`. Two photographs reveal with a `clip-path` wipe.
- **Side panel.** Slow in (340ms), fast out (220ms), using a drawer curve. Visibility switches after the exit so the closed panel is out of the tab order.
- **Feedback.** Every button scales to 0.97 on press. The bag counter pops when it grows. New bag lines slide in.
- **Not animated.** Escape to close, quantity steppers and anything a user repeats many times a day.
- **Accessibility.** `prefers-reduced-motion` removes all transitions and animations, and the JS counter pop checks the same media query. Hover effects only apply on devices that can hover.

All easing curves and durations are at the end of `src/styles/global.css`.

## Implementation notes

- **Progressive enhancement.** An inline script adds a `js` class to `<html>`. Reveal styles are scoped to `.js`, so without JavaScript the page is fully visible rather than stuck at opacity 0.
- **Clipped elements are invisible to observers.** A `clip-path: inset(0 0 100% 0)` element has zero visible area, so an `IntersectionObserver` never fires for it and lazy images inside never load. `reveal.ts` observes the parent and reveals the child, and those images are loaded eagerly.
- **State without a framework.** `shop.ts` holds a few module-level variables and a single `render()` that reconciles the DOM. There are no event listeners on re-rendered nodes except those created inside the render.
- **Interruptible UI.** Panels and chips use CSS transitions rather than keyframes, so rapid toggling retargets instead of restarting.

## Known limitations

- Photography is hotlinked from Unsplash and does not always match the product it illustrates. For production, download, optimise with `astro:assets` and credit the photographers.
- The bag is in memory only and resets on reload.
- The dialog does not yet trap focus or return it to the trigger on close.
- Journal, social and contact links are placeholders.
- No Open Graph metadata, favicon or `site` URL is configured yet.

## Credits

Photography from [Unsplash](https://unsplash.com). Typefaces from Google Fonts.
