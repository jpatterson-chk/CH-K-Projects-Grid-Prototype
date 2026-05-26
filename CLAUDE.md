# Project Grid Prototype

## Goal

Build a responsive project archive grid that replicates the layout behavior of the grid found at `mesura.eu/projects`. This is a CSS Grid–driven layout where project cards reflow across columns as the viewport resizes, with gap sizes and card dimensions shifting at defined breakpoints.

## Project images

All project card images are located in the `./images/` folder. Each card should display one image with a project title beneath it. Use whatever images are present in that folder — the exact number of cards doesn't matter, just populate the grid with what's available.

## Grid container (`.module-archive`)

The grid container uses CSS custom properties to control its behavior. The core declaration is:

```css
.module-archive {
  display: grid;
  grid-template-columns: repeat(var(--module-archive-cols), var(--archive-card-w));
  gap: var(--archive-card-gap) var(--module-archive-gap);
  justify-content: center;
  align-items: start;
}
```

This is NOT an `auto-fill` / `auto-fit` grid. The column count is **explicitly set** via the `--module-archive-cols` variable at each breakpoint, and the card width is a **fixed value** set via `--archive-card-w`. The grid is then horizontally centered within its container via `justify-content: center`. The remaining horizontal space is consumed by the column gap (`--module-archive-gap`), which is also a fixed value per breakpoint — not a fluid `minmax()` range.

The row gap (`--archive-card-gap`) controls vertical spacing between rows of cards.

## Breakpoint system

The layout uses a mobile-first approach with these breakpoints. Implement all of them:

| Viewport width | `--module-archive-cols` | `--archive-card-w` | `--module-archive-gap` | `--archive-card-gap` |
|---|---|---|---|---|
| ≤ 640px | 2 | 130px | 16px | 16px |
| 641px – 1024px | 3 | 150px | 30px | 20px |
| 1025px – 1280px | 4 | 130px | 20px | 20px |
| 1281px – 1440px | 4 | 160px | 60px | 20px |
| 1441px – 1680px | 5 | 160px | 80px | 20px |
| > 1680px | 5 | 180px | 90px | 20px |

These values are approximate and tuned to produce a visually similar result to the reference site. Adjust if needed to look right, but the core principle is: **column count and card width are fixed per breakpoint, not fluid**.

## Card component (`.archive-card`)

Each card consists of:

1. **An image** — displayed at the width dictated by `--archive-card-w`. The image should maintain its natural aspect ratio (use `width: 100%; height: auto;`). Images on the reference site are predominantly portrait-oriented (roughly 4:5 or 3:4 ratio) but some are landscape or square — the grid accommodates mixed aspect ratios with `align-items: start` on the container so cards anchor to the top of their row.
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
