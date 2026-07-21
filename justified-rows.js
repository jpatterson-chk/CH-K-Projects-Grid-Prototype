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

  var ROW_H = 250;                       // fixed image/row height (px); refreshed
                                         // from the CSS --jrow-h on each layout()
  var GAP = 16;                          // uniform gap (px); refreshed from the CSS
                                         // --jgap (responsive) on each layout()
  var QUOTE_AFTER = 8;                   // place the quote tile after this many images
  var QUOTE_W = 360;                     // quote tile width (px); refreshed from the
                                         // CSS --jquote-w. Fixed width => the text
                                         // re-wraps consistently and never rescales.
  var MIN_SCALE = 0.8;                   // how narrow images may get before a row
                                         // reflows: the smallest fraction of natural
                                         // width they'll shrink to. Refreshed from
                                         // the CSS --jrow-min-scale. Higher (->1) =
                                         // reflow sooner, wider images, fewer per row.
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

  // Model the quote as a fixed-width item so it flows into a row like an image:
  // row-breaking reserves its width, but unlike an image it does NOT stretch — the
  // images in its row flex-grow to absorb the justification, so the quote keeps its
  // width, its text re-wraps the same way every time, and the font never rescales.
  // Placed after QUOTE_AFTER images.
  if (QUOTE_AFTER > 0 && QUOTE_AFTER <= items.length) {
    items.splice(QUOTE_AFTER, 0, { quote: true, text: QUOTE_TEXT });
  }

  // Natural (pre-justification) width of an item at the current row height: images
  // scale by aspect ratio; the quote is a fixed width, capped to the container.
  function natWidthOf(item) {
    return item.quote ? Math.min(QUOTE_W, gallery.clientWidth) : ROW_H * item.ratio;
  }

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

  // The quote tile: a fixed-width text box (width from CSS --jquote-w). It sits in a
  // row like a card but never grows; the text wraps within that width at a constant
  // font size, so nothing is clipped and the padding stays consistent.
  function buildQuote(item) {
    var tile = document.createElement("div");
    tile.className = "jquote-tile";
    var p = document.createElement("p");
    p.className = "jquote-tile__text";
    p.textContent = item.text;
    tile.appendChild(p);
    return tile;
  }

  // The factor by which a row's flexible (image) cells get scaled to fill W: the
  // width left after the fixed cells (the quote) and the gaps, over the images'
  // combined natural width. < 1 means the row shrinks its images below natural.
  function flexScale(cells, W) {
    var fixed = 0, flexNat = 0;
    cells.forEach(function (c) {
      if (c.quote) fixed += natWidthOf(c);
      else flexNat += natWidthOf(c);
    });
    if (flexNat <= 0) return 1;           // nothing flexible to judge (quote-only)
    return (W - fixed - (cells.length - 1) * GAP) / flexNat;
  }

  // Greedily group items into rows that fill width W at height ROW_H. A row closes
  // once the cells' natural widths (ROW_H * ratio, or the quote's fixed width) plus
  // the gaps reach W. But if that last cell would shrink the row's images below
  // MIN_SCALE of their natural width, it's popped back to start the next row, so
  // this row fills with fewer, slightly wider images instead of cramped ones.
  // (This is also what lets the fixed-width quote reflow to the next row rather than
  // squeezing the images beside it.) Returns an array of rows.
  function breakIntoRows(list, W) {
    var rows = [], row = [], natWidth = 0;
    list.forEach(function (item) {
      row.push(item);
      natWidth += natWidthOf(item);
      var gaps = (row.length - 1) * GAP;
      if (natWidth + gaps >= W) {
        if (row.length > 1 && flexScale(row, W) < MIN_SCALE) {
          row.pop();                      // too cramped — reflow this cell down
          rows.push(row);
          row = [item];
          natWidth = natWidthOf(item);
        } else {
          rows.push(row);
          row = [];
          natWidth = 0;
        }
      }
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
      if (item.quote) {
        // Fixed-width, non-growing tile (width comes from CSS --jquote-w); the
        // images in this row absorb the justification around it.
        el.appendChild(buildQuote(item));
        return;
      }
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

  function layout() {
    var W = gallery.clientWidth;
    if (!W) return;

    // Refresh the row height, gap, and quote width from the CSS custom properties
    // (responsive per breakpoint) so the row-breaking math matches what's rendered.
    var cs = getComputedStyle(gallery);
    ROW_H = parseFloat(cs.getPropertyValue("--jrow-h")) || ROW_H;
    GAP = parseFloat(cs.getPropertyValue("--jgap")) || GAP;
    QUOTE_W = parseFloat(cs.getPropertyValue("--jquote-w")) || QUOTE_W;
    MIN_SCALE = parseFloat(cs.getPropertyValue("--jrow-min-scale")) || MIN_SCALE;

    var rows = breakIntoRows(items, W);

    var frag = document.createDocumentFragment();
    rows.forEach(function (row, ri) {
      // Only the gallery's trailing partial row is left natural (left-aligned).
      var isLastRow = ri === rows.length - 1;
      frag.appendChild(renderRow(row, !isLastRow));
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
