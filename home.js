// Homepage featured grid: render the curated, ordered projects (window.HOME_ORDER
// from home-order.js) as cards with the title above each image. Shared by every
// homepage layout variant.
(function () {
  var grid = document.getElementById("home-grid");
  var items = window.HOME_ORDER || [];
  if (!grid) return;

  if (!items.length) {
    grid.innerHTML =
      '<p class="archive-empty">No projects listed. Add entries to ' +
      'home-order.js</p>';
    return;
  }

  var frag = document.createDocumentFragment();
  items.forEach(function (item) {
    // Non-image blocks (e.g. the studio updates list) can be interleaved among
    // the cards by giving the entry a `block` type instead of file/title.
    if (item.block === "updates-featured") {
      frag.appendChild(buildUpdatesFeaturedBlock());
      return;
    }
    if (item.block === "updates-featured-2") {
      frag.appendChild(buildUpdatesFeatured2Block());
      return;
    }
    if (item.block === "quote") {
      frag.appendChild(buildQuoteBlock(item.text));
      return;
    }

    var card = document.createElement("figure");
    card.className = "home-card";

    // Title first so it sits ABOVE the image. The project number leads, in muted
    // grey (matching the All Projects list), followed by the title.
    var caption = document.createElement("figcaption");
    caption.className = "home-card__title";
    if (item.num != null) {
      var num = document.createElement("span");
      num.className = "home-card__num";
      num.textContent = item.num;
      caption.appendChild(num);
      caption.appendChild(document.createTextNode(" "));
    }
    caption.appendChild(document.createTextNode(item.title));

    var img = document.createElement("img");
    img.className = "home-card__img";
    img.src = "images/" + item.file;
    img.alt = item.title;

    card.appendChild(caption);
    card.appendChild(img);
    frag.appendChild(card);
  });
  grid.appendChild(frag);

  // --- Pull quote ------------------------------------------------------------

  // A full-width studio statement, set at the hero text scale (see style.css).
  function buildQuoteBlock(text) {
    var section = document.createElement("section");
    section.className = "home-quote";
    var p = document.createElement("p");
    p.className = "home-quote__text";
    p.textContent = text || "";
    section.appendChild(p);
    return section;
  }

  // --- "Updates" block (two variations share these pieces) -------------------

  function updatesTitle() {
    var title = document.createElement("h2");
    title.className = "home-updates__title";
    title.textContent = "Updates";
    return title;
  }

  // A single update row: headline (with an optional trailing underlined link)
  // on the left, date on the right. `extraClass` tags special rows (e.g. the
  // featured lead row in variation 2).
  function updatesRow(u, extraClass) {
    var row = document.createElement("li");
    row.className = "home-updates__row" + (extraClass ? " " + extraClass : "");

    var text = document.createElement("span");
    text.className = "home-updates__text";
    text.appendChild(document.createTextNode(u.text));
    if (u.link) {                              // optional trailing underlined link
      text.appendChild(document.createTextNode(" "));
      var a = document.createElement("a");
      a.className = "home-updates__link";
      a.href = u.href || "#";
      a.textContent = u.link;
      text.appendChild(a);
    }

    var date = document.createElement("span");
    date.className = "home-updates__date";
    date.textContent = u.date;

    row.appendChild(text);
    row.appendChild(date);
    return row;
  }

  // The list of update rows from window.UPDATES, optionally capped at `limit`.
  function updatesList(limit) {
    var list = document.createElement("ul");
    list.className = "home-updates__list";

    var items = window.UPDATES || [];
    if (limit != null) items = items.slice(0, limit);
    items.forEach(function (u) {
      list.appendChild(updatesRow(u));
    });
    return list;
  }

  function updatesMore() {
    var more = document.createElement("a");
    more.className = "home-updates__more";
    more.href = "#";
    var label = document.createElement("span");
    label.textContent = "All Updates";
    var arrow = document.createElement("span");
    arrow.className = "home-updates__arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    more.appendChild(label);
    more.appendChild(arrow);
    return more;
  }

  // A featured update (image + caption) beside the list. On mobile
  // the featured stacks above the list (handled in CSS).
  function buildUpdatesFeaturedBlock() {
    var f = window.UPDATES_FEATURED || {};
    var section = document.createElement("section");
    section.className = "home-updates home-updates--featured";
    section.setAttribute("aria-label", "Updates");
    section.appendChild(updatesTitle());

    var fig = document.createElement("figure");
    fig.className = "home-updates__featured";

    var media = document.createElement("div");
    media.className = "home-updates__featured-media";
    if (f.file) {
      var img = document.createElement("img");
      img.src = "images/" + f.file;
      img.alt = f.title || "";
      media.appendChild(img);
    }
    fig.appendChild(media);

    var cap = document.createElement("figcaption");
    cap.className = "home-updates__featured-caption";
    var capText = document.createElement("span");
    capText.className = "home-updates__text";
    capText.textContent = f.title || "";
    var capDate = document.createElement("span");
    capDate.className = "home-updates__date";
    capDate.textContent = f.date || "";
    cap.appendChild(capText);
    cap.appendChild(capDate);
    fig.appendChild(cap);
    section.appendChild(fig);

    var col = document.createElement("div");
    col.className = "home-updates__col";
    col.appendChild(updatesList());
    col.appendChild(updatesMore());
    section.appendChild(col);

    return section;
  }

  // Variant 2 of the featured block (own `--featured-2` namespace). The image
  // carries no caption of its own; instead the featured update leads the list
  // column, with the remaining updates trimmed to keep the column height equal
  // to variation 1's.
  function buildUpdatesFeatured2Block() {
    var f = window.UPDATES_FEATURED || {};
    var section = document.createElement("section");
    section.className = "home-updates home-updates--featured-2";
    section.setAttribute("aria-label", "Updates");
    section.appendChild(updatesTitle());

    // Default image (also the lead row's hover target) — from images/updates/.
    var defaultImg = f.img ? "images/updates/" + f.img
                   : f.file ? "images/" + f.file : "";

    var fig = document.createElement("figure");
    fig.className = "home-updates__featured-2";

    var media = document.createElement("div");
    media.className = "home-updates__featured-2-media";
    var mediaImg = null;
    if (defaultImg) {
      mediaImg = document.createElement("img");
      mediaImg.src = encodeURI(defaultImg);
      mediaImg.alt = f.title || "";
      media.appendChild(mediaImg);
    }
    fig.appendChild(media);
    section.appendChild(fig);

    var col = document.createElement("div");
    col.className = "home-updates__col";
    // The featured update becomes the list's lead row (its caption moved up from
    // under the image). The remaining updates are trimmed so the slot count —
    // featured + 4 updates + All Updates — matches variation 1's height.
    var list = updatesList(4);
    list.insertBefore(
      updatesRow({ text: f.title, date: f.date }, "home-updates__featured-2-lead"),
      list.firstChild
    );
    col.appendChild(list);
    col.appendChild(updatesMore());
    section.appendChild(col);

    // Tag each row with the image it should reveal: the lead row shows the
    // default (featured) image; the rest show their own (in images/updates/).
    var rowImgs = [defaultImg].concat(
      (window.UPDATES || []).slice(0, 4).map(function (u) {
        return u.img ? "images/updates/" + u.img : defaultImg;
      })
    );
    var rows = list.querySelectorAll(".home-updates__row");
    for (var i = 0; i < rows.length; i++) {
      if (rowImgs[i]) rows[i].dataset.img = encodeURI(rowImgs[i]);
    }

    wireFeatured2Hover(col, mediaImg, encodeURI(defaultImg));

    return section;
  }

  // Desktop hover: settling on an update row for 100ms swaps the featured image
  // to that row's image; leaving the list restores the default. The debounce
  // avoids flicker when the pointer sweeps across rows. Guarded to the two-column
  // desktop layout (and real hover) so touch/narrow layouts are unaffected.
  function wireFeatured2Hover(col, mediaImg, defaultSrc) {
    if (!mediaImg) return;
    var mql = window.matchMedia("(hover: hover) and (min-width: 1081px)");
    var timer;

    function schedule(src) {
      if (!mql.matches || !src) return;
      clearTimeout(timer);
      timer = setTimeout(function () { mediaImg.src = src; }, 100);
    }

    var rows = col.querySelectorAll(".home-updates__row");
    for (var i = 0; i < rows.length; i++) {
      (function (row) {
        row.addEventListener("mouseenter", function () {
          schedule(row.dataset.img || defaultSrc);
        });
      })(rows[i]);
    }
    col.addEventListener("mouseleave", function () { schedule(defaultSrc); });
  }
})();
