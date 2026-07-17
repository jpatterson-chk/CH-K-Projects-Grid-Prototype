// Shared archive data + helpers, used by both the grid renderer (archive.js) and
// the justified-rows renderer (justified-rows.js) so the project-code map lives in
// ONE place. Load before either renderer.
(function () {
  // 3-digit project codes, keyed by image filename. Kept here (not in the
  // auto-generated manifest.js) so regenerating the manifest never clobbers them.
  window.PROJECT_CODES = {
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

  // Derive a display title from an image filename (drop extension, dashes/
  // underscores -> spaces, Title Case).
  window.titleFromArchiveFilename = function (name) {
    return name
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  };
})();
