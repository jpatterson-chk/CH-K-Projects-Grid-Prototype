// Justified-rows gallery for home-archive-rows.html. Renders the archive images
// (window.ARCHIVE_ORDER, or the alphabetical manifest as a fallback) as rows that:
//   - span the full width of the container (identical row widths),
//   - keep every image the same fixed height (ROW_H), cropped via object-fit,
//   - use a uniform gap between images across all rows,
//   - vary image widths by each image's original aspect ratio.
//
// How: a JS pass groups images into rows (greedy fill to the container width at
// ROW_H), then CSS flexbox justifies each row — figure flex-grow = aspect ratio,
// flex-basis 0, so widths distribute proportional to aspect and fill the row
// exactly. A full-width pull-quote band is inserted after the row that reaches a
// target image count (always between two full rows). The gallery's trailing
// partial row is left at natural width, left-aligned. Re-runs on resize (only the
// grouping is recomputed; flexbox does the rest).
//
// Load after archive-data.js (PROJECT_CODES + title helper) and image-ratios.js.
(function () {
  var gallery = document.getElementById("archive");
  if (!gallery) return;

  var ROW_H = 200;                       // fixed image height (px)
  var GAP = 16;                          // uniform gap (px); refreshed from the CSS
                                         // --jgap (responsive) on each layout()
  var QUOTE_AFTER = 8;                   // insert the quote band after this many images
  var QUOTE_TEXT = "Transformative neighbourhoods, successful destinations, " +
                   "inspiring places and spaces, future heritage, and humble icons";

  var images = window.ARCHIVE_ORDER || window.PROJECT_IMAGES || [];
  var RATIOS = window.IMAGE_RATIOS || {};
  var CODES = window.PROJECT_CODES || {};
  var titleOf = window.titleFromArchiveFilename || function (s) { return s; };

  if (!images.length) {
    gallery.innerHTML =
      '<p class="archive-empty">No images found. Add files to ./images/ ' +
      'and run ./generate-manifest.sh</p>';
    return;
  }

  gallery.classList.add("jgallery");

  // Build the per-image model once (ratio defaults to 1 if missing).
  var items = images.map(function (file) {
    return { file: file, ratio: RATIOS[file] || 1, code: CODES[file], title: titleOf(file) };
  });

  // One image tile: <figure><img 200px cover><figcaption code + title></figure>.
  function buildFigure(item) {
    var fig = document.createElement("figure");
    fig.className = "jcard";

    var img = document.createElement("img");
    img.className = "jcard__img";
    img.src = "images/" + item.file;
    img.alt = item.code ? item.code + " " + item.title : item.title;
    fig.appendChild(img);

    var cap = document.createElement("figcaption");
    cap.className = "jcard__title";
    if (item.code) {
      var num = document.createElement("span");
      num.className = "jcard__num";
      num.textContent = item.code;
      cap.appendChild(num);
    }
    cap.appendChild(document.createTextNode(item.title));
    fig.appendChild(cap);

    return fig;
  }

  // Greedily group a list of items into rows that fill width W at height ROW_H.
  // A row closes once the images' natural widths (ROW_H * ratio) plus the gaps
  // reach W. Returns an array of rows (each an array of items).
  function breakIntoRows(list, W) {
    var rows = [], row = [], natWidth = 0;
    list.forEach(function (item) {
      row.push(item);
      natWidth += ROW_H * item.ratio;
      var gaps = (row.length - 1) * GAP;
      if (natWidth + gaps >= W) { rows.push(row); row = []; natWidth = 0; }
    });
    if (row.length) rows.push(row);       // trailing partial row
    return rows;
  }

  // Render one row. `justified` fills the width (flex-grow by ratio + cover crop);
  // otherwise (the gallery's last row) images sit at natural width, left-aligned.
  function renderRow(row, justified) {
    var el = document.createElement("div");
    el.className = "jrow" + (justified ? "" : " jrow--natural");
    row.forEach(function (item) {
      var fig = buildFigure(item);
      if (justified) {
        fig.style.flexGrow = item.ratio;   // proportional width; flex-basis:0 in CSS
      } else {
        // natural: width = height * ratio, no stretch
        fig.style.width = Math.round(ROW_H * item.ratio) + "px";
      }
      el.appendChild(fig);
    });
    return el;
  }

  function quoteBand() {
    var band = document.createElement("section");
    band.className = "jquote";
    var p = document.createElement("p");
    p.className = "jquote__text";
    p.textContent = QUOTE_TEXT;
    band.appendChild(p);
    return band;
  }

  function layout() {
    var W = gallery.clientWidth;
    if (!W) return;

    // Refresh the gap from the CSS custom property (responsive per breakpoint) so
    // the row-breaking math matches the rendered flex gap.
    GAP = parseFloat(getComputedStyle(gallery).getPropertyValue("--jgap")) || GAP;

    var rows = breakIntoRows(items, W);

    // Place the quote band after the (full) row that reaches QUOTE_AFTER images —
    // between two full rows, never after a lone stretched image. Skip if that
    // would be the last row (nothing follows it).
    var quoteAfterRow = -1;
    if (QUOTE_AFTER > 0) {
      for (var i = 0, count = 0; i < rows.length; i++) {
        count += rows[i].length;
        if (count >= QUOTE_AFTER) { quoteAfterRow = i; break; }
      }
      if (quoteAfterRow === rows.length - 1) quoteAfterRow = -1;
    }

    var frag = document.createDocumentFragment();
    rows.forEach(function (row, ri) {
      // Only the gallery's trailing partial row is left natural (left-aligned).
      var isLastRow = ri === rows.length - 1;
      frag.appendChild(renderRow(row, !isLastRow));
      if (ri === quoteAfterRow) frag.appendChild(quoteBand());
    });

    gallery.innerHTML = "";
    gallery.appendChild(frag);
  }

  layout();

  var raf;
  window.addEventListener("resize", function () {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(layout);
  }, { passive: true });
})();
