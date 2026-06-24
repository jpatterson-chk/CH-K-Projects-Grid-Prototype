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
    if (item.block === "updates") {
      frag.appendChild(buildUpdatesBlock());
      return;
    }
    if (item.block === "updates-featured") {
      frag.appendChild(buildUpdatesFeaturedBlock());
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

  // The list of update rows (headline | date) from window.UPDATES.
  function updatesList() {
    var list = document.createElement("ul");
    list.className = "home-updates__list";

    (window.UPDATES || []).forEach(function (u) {
      var row = document.createElement("li");
      row.className = "home-updates__row";

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
      list.appendChild(row);
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

  // Variation A: a plain full-width list.
  function buildUpdatesBlock() {
    var section = document.createElement("section");
    section.className = "home-updates";
    section.setAttribute("aria-label", "Updates");
    section.appendChild(updatesTitle());
    section.appendChild(updatesList());
    section.appendChild(updatesMore());
    return section;
  }

  // Variation B: a featured update (image + caption) beside the list. On mobile
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
})();
