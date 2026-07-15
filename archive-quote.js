// Pull-quote module for the projects archive grid (home-archive.html). Drops a
// full-statement pull quote in among the cards of .module-archive and keeps its
// column span in step with however many columns the auto-fill grid is currently
// showing:
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

  var QUOTE = "Transformative neighbourhoods, successful destinations, " +
              "inspiring places and spaces, future heritage, and humble\u00A0icons";
  var INSERT_AFTER = 8;      // place the quote after this many cards (tweak to taste)
  var SIDE = "left";         // which grid edge the quote hugs: "left" or "right"

  var quote = document.createElement("blockquote");
  quote.className = "archive-quote";
  var p = document.createElement("p");
  p.className = "archive-quote__text";
  p.textContent = QUOTE;
  quote.appendChild(p);

  // Insert among the cards. If there are fewer cards than INSERT_AFTER it simply
  // lands at the end (insertBefore(null) === appendChild).
  grid.insertBefore(quote, grid.children[INSERT_AFTER] || null);

  // Count the grid's resolved columns from its computed track list, ignoring the
  // quote's own span (grid-template-columns is the track definition, not the
  // items). e.g. "160px 160px 160px" -> 3.
  function columnCount() {
    var tracks = getComputedStyle(grid).gridTemplateColumns;
    if (!tracks || tracks === "none") return 1;
    return tracks.split(/\s+/).filter(Boolean).length;
  }

  function applySpan() {
    var n = columnCount();
    if (n <= 4) {
      quote.style.gridColumn = "1 / -1";                       // full width
    } else {
      var span = n >= 7 ? 4 : 3;
      // Anchor to a grid edge rather than letting it flow, so it always starts at
      // the same side regardless of how the cards fill the row above it. dense
      // flow (home-archive.css) backfills the cells the quote skips.
      quote.style.gridColumn = SIDE === "right"
        ? "span " + span + " / -1"                            // hug the right edge
        : "1 / span " + span;                                 // hug the left edge
    }
  }

  applySpan();

  var raf;
  window.addEventListener("resize", function () {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(applySpan);
  }, { passive: true });
})();
