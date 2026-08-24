// Pull-quote modules for the projects archive grid (home-archive.html). Drops
// full-statement pull quotes in among the cards of .module-archive and keeps each
// one's column span in step with however many columns the auto-fill grid is
// currently showing:
//     >= 7 columns -> span 4
//     5-6 columns  -> span 3
//     <= 4 columns -> full width
// The archive grid has no per-breakpoint column count (auto-fill decides it from
// the viewport width), so the span is read from the grid's resolved
// grid-template-columns rather than from media queries, and re-checked on resize.
// Load AFTER archive.js so the cards already exist; no-op if #archive is absent.
(function () {
  var grid = document.getElementById("archive");
  if (!grid) return;

  // Edit/reorder these to change the quotes. `after` = how many cards precede the
  // quote; `side` = which grid edge it hugs ("left" or "right").
  var QUOTES = [
    {
      text: "Transformative neighbourhoods, successful destinations, " +
            "inspiring places and spaces, future heritage, and humble icons",
      after: 5,
      side: "left",
    },
    {
      // PLACEHOLDER — awaiting final copy.
      text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. " +
            "Aenean commodo ligula eget dolor. Aenean massa.",
      after: 15,
      side: "right",
    },
  ];

  // Snapshot the cards first so each `after` counts cards only, and isn't shifted
  // by the quotes inserted ahead of it.
  var cards = Array.prototype.slice.call(grid.children);

  var quotes = QUOTES.map(function (spec) {
    var quote = document.createElement("blockquote");
    quote.className = "archive-quote";
    var p = document.createElement("p");
    p.className = "archive-quote__text";
    p.textContent = spec.text;
    quote.appendChild(p);

    // Past the last card it simply lands at the end (insertBefore(null)).
    grid.insertBefore(quote, cards[spec.after] || null);
    return { el: quote, side: spec.side };
  });

  // Count the grid's resolved columns from its computed track list, ignoring the
  // quotes' own spans (grid-template-columns is the track definition, not the
  // items). e.g. "160px 160px 160px" -> 3.
  function columnCount() {
    var tracks = getComputedStyle(grid).gridTemplateColumns;
    if (!tracks || tracks === "none") return 1;
    return tracks.split(/\s+/).filter(Boolean).length;
  }

  function applySpans() {
    var n = columnCount();
    var span = n >= 7 ? 4 : 3;

    quotes.forEach(function (q) {
      if (n <= 4) {
        q.el.style.gridColumn = "1 / -1";                      // full width
      } else {
        // Anchor to a grid edge rather than letting it flow, so each quote always
        // starts at the same side regardless of how the cards fill the row above
        // it. dense flow (home-archive.css) backfills the cells it skips.
        q.el.style.gridColumn = q.side === "right"
          ? "span " + span + " / -1"                          // hug the right edge
          : "1 / span " + span;                               // hug the left edge
      }
    });
  }

  applySpans();

  var raf;
  window.addEventListener("resize", function () {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(applySpans);
  }, { passive: true });
})();
