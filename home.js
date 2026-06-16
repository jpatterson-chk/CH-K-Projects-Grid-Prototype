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
    var card = document.createElement("figure");
    card.className = "home-card";

    // Title first so it sits ABOVE the image.
    var caption = document.createElement("figcaption");
    caption.className = "home-card__title";
    caption.textContent = item.title;

    var img = document.createElement("img");
    img.className = "home-card__img";
    img.src = "images/" + item.file;
    img.alt = item.title;

    card.appendChild(caption);
    card.appendChild(img);
    frag.appendChild(card);
  });
  grid.appendChild(frag);
})();
