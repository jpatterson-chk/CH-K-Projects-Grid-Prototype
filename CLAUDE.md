# Project Grid Prototype

## Goal

Build a responsive project archive grid that replicates the layout behavior of the grid found at `mesura.eu/projects`. This is a CSS Grid–driven layout where project cards reflow across columns as the viewport resizes, with gap sizes and card dimensions shifting at defined breakpoints.

## Project images

All project card images are located in the `./images/` folder. Each card should display one image with a project title beneath it. Use whatever images are present in that folder — the exact number of cards doesn't matter, just populate the grid with what's available.

## Grid container (`.module-archive`)

The grid container lets the browser choose the column count, and the slack between column jumps lands in the **column gap** (bounded by a `clamp()`), not in the outer margins. The core declaration is:

```css
.module-archive {
  --card-min: 160px;   /* min card width; past it, a new column drops in */
  --gap-min: 16px;     /* column-gap floor */
  --gap-max: 72px;     /* column-gap ceiling */
  --archive-row-gap: 96px;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--card-min), 1fr));
  column-gap: clamp(var(--gap-min), 4%, var(--gap-max));
  row-gap: var(--archive-row-gap);
  align-items: start;
}
```

Key idea: leftover width can only go to the **cards**, the **gaps**, or the **outer margins**. Cards are `1fr` so they fill the row — that eliminates the outer margins (the grid spans the full content width). The column gap is then the element that flexes, but `clamp()` holds it between `--gap-min` and `--gap-max` so it can't balloon. `auto-fill` still drops in a new column once there's room for one at `--card-min`. Because the clamped gap absorbs most of the width growth, the cards stay near `--card-min` and read as fixed-size. Use `auto-fill` (not `auto-fit`) so a short final row stays left-aligned instead of stretching full width.

Tuning is a few knobs, not a breakpoint table:
- **`--gap-min` / `--gap-max`** — the gap's floor and ceiling; the `4%` middle term is the preferred gap as a share of container width (raise it for roomier gaps that hit the max sooner).
- **`--card-min`** — smaller = more, narrower columns; larger = fewer, wider columns.

## Breakpoint system

The grid itself needs **no per-viewport column breakpoints** — `auto-fill` handles column count and the `clamp()` handles the gap. The only overrides are:

- **≤ 640px (mobile):** `--card-min: 130px` so two cards comfortably fit a phone (the desktop min is too wide). The clamped gap already collapses toward `--gap-min` on narrow screens, so no gap override is needed.
- **`.page` padding** still steps up with the viewport (56 → 64 → 72px) independently of the grid.

Historical note: the first version fixed the column count and card width per breakpoint and let `justify-content: space-between` pour slack into the gaps — that ballooned the gaps at wide widths. The second version (`auto-fill` + fixed gap + `justify-content: center`) fixed the gaps but pushed the slack into flexing outer margins. The current version pins the cards (`1fr` fill) and lets the **gap** flex within a `clamp()`. Do not reintroduce fixed per-breakpoint column counts or `justify-content: center` here.

## Card component (`.archive-card`)

Each card consists of:

1. **An image** — displayed at the width of its grid track (at least `--card-min`, then `1fr`-filled). The image should maintain its natural aspect ratio (use `width: 100%; height: auto;`). Images on the reference site are predominantly portrait-oriented (roughly 4:5 or 3:4 ratio) but some are landscape or square — the grid accommodates mixed aspect ratios with `align-items: start` on the container so cards anchor to the top of their row.
2. **A project title** — a short text label below the image. Styled small, muted, minimal — think 11–12px, light grey or similar understated treatment. Use the image filename (without extension, dashes/underscores replaced with spaces) as the title if no other data is available.

Cards have **no border, no background, no shadow, no hover card-lift effect**. The design is extremely minimal. On hover, the only effect on the reference site is a subtle opacity reduction on the image (e.g., `opacity: 0.7` on hover with a short transition).

## Overall page styling

- Background: white.
- Color: use full black or 50% grey for lighter ui parts.
- The grid should be horizontally centered on the page with generous horizontal padding (around 40–80px on desktop, 16–20px on mobile) so it doesn't touch the edges.
- No header or navigation is needed — this is a standalone grid prototype.
- Typography: use only Arial regular. Keep it very quiet — the images are the focus.

## What NOT to build

- No filtering, sorting, or search functionality.
- No lightbox or detail view on click.
- No JavaScript-driven layout (pure CSS grid).
- No masonry / Pinterest-style staggered layout — this is a standard grid where each row has uniform height determined by the tallest card in that row.
- No lazy loading or infinite scroll — just render all cards.

## Tech stack

Use plain HTML and CSS. No frameworks, no build tools. A single `index.html` file with embedded `<style>` or a separate `style.css` is fine. If a small script is needed to dynamically read filenames from the `./images/` folder and generate card markup, that's acceptable, but the layout itself must be pure CSS.
