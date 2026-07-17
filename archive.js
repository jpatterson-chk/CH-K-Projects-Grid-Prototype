// Renders the projects archive grid (.module-archive#archive) from the image
// filenames in window.PROJECT_IMAGES (manifest.js), prepending each card's
// 3-digit project code. Shared by projects.html and home-archive.html so the
// two pages stay in sync — load it after manifest.js and archive-data.js. No-op
// if #archive is absent, so it's safe to include anywhere.
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

  // Title helper + code map are shared with justified-rows.js (archive-data.js).
  var titleFromFilename = window.titleFromArchiveFilename;
  var PROJECT_CODES = window.PROJECT_CODES || {};

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
