// Renders the projects archive grid (.module-archive#archive) from the image
// filenames in window.PROJECT_IMAGES (manifest.js), prepending each card's
// 3-digit project code. Shared by projects.html and home-archive.html so the
// two pages stay in sync — load it after manifest.js. No-op if #archive is
// absent, so it's safe to include anywhere.
(function () {
  var grid = document.getElementById("archive");
  if (!grid) return;
  // A page can supply its own display order via window.ARCHIVE_ORDER (e.g.
  // home-archive-order.js); otherwise fall back to the alphabetical manifest.
  var images = window.ARCHIVE_ORDER || window.PROJECT_IMAGES || [];

  if (!images.length) {
    grid.innerHTML =
      '<p class="archive-empty">No images found. Add files to ./images/ ' +
      'and run ./generate-manifest.sh</p>';
    return;
  }

  // Derive a display title from the image filename.
  function titleFromFilename(name) {
    return name
      .replace(/\.[^.]+$/, "")        // drop extension
      .replace(/[-_]+/g, " ")          // dashes/underscores -> spaces
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  // 3-digit project codes, keyed by image filename. Kept here (not in the
  // auto-generated manifest.js) so regenerating the manifest never clobbers
  // them. Prepended to the caption, e.g. "366 Jihlava Multipurpose Urban Arena".
  var PROJECT_CODES = {
    "KVIFF-TV-pavilion.webp": "464",
    "ODA-tirana-meeting-hub.webp": "512",
    "OUT-HABIT-dialogues.webp": "403",
    "broadway-adaptive-tower.webp": "507",
    "czech-pavilion-expo-2015.webp": "131",
    "forestry-HQ.webp": "249",
    "gallery-of-furniture.webp": "170",
    "house-of-wine-tasting.webp": "225",
    "jihlava-multipurpose-urban-arena.webp": "366",
    "lahofer-winery.webp": "188",
    "learning-landscape-primary-school.webp": "518",
    "london-bowl.webp": "571",
    "manifesto-market.webp": "367",
    "mendel's-greenhouse.webp": "358",
    "mendel-square.webp": "416",
    "modular-office-and-research-centre.webp": "360",
    "moravska-trebova-cultural-centre.webp": "477",
    "multifunctional-tower-tirana.webp": "534",
    "municipal-affordable-housing.webp": "303",
    "nusle-brewery-quarter.webp": "272",
    "pearl-gallery-and-community-centre.webp": "479",
    "prague-main-train-station.webp": "487",
    "private-art-gallery.webp": "383",
    "slovak-pavilion-at-PQ-2019.webp": "314",
    "urban-infill-apartment.webp": "174",
    "vernacular-school-in-mulbekh.webp": "338",
    "vila-park-residences.webp": "186",
    "vltava-philharmonic-hall.webp": "453",
    "waltrovka-masterplan.webp": "103",
    "zvonarka-bus-station.webp": "275",
  };

  var frag = document.createDocumentFragment();

  images.forEach(function (file) {
    var title = titleFromFilename(file);
    var code = PROJECT_CODES[file];

    var card = document.createElement("figure");
    card.className = "archive-card";

    var img = document.createElement("img");
    img.className = "archive-card__img";
    img.src = "images/" + file;
    img.alt = code ? code + " " + title : title;

    var caption = document.createElement("figcaption");
    caption.className = "archive-card__title";
    // Muted code in its own span so it can be greyed like the list numbers,
    // then the title text as a sibling node.
    if (code) {
      var num = document.createElement("span");
      num.className = "archive-card__num";
      num.textContent = code;
      caption.appendChild(num);
    }
    caption.appendChild(document.createTextNode(title));

    card.appendChild(img);
    card.appendChild(caption);
    frag.appendChild(card);
  });

  grid.appendChild(frag);
})();
