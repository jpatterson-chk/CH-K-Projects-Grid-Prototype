// research-data.js — the single, hand-editable source for the Research page web.
//
// Edit this file by hand to add images, tune tags, or write annotation notes.
// research.js reads it, derives each node's nearest "neighbours" from shared
// tags at runtime, and lays them out as a force-directed web — so changing a
// node's `tags` reshapes the web on the next reload; no other file to touch.
// Like manifest.js / home-order.js, keeping the data in a window.* global
// sidesteps file:// (no fetch / server needed).
//
// Node shape:
//   {
//     file:  "image-name.webp",        // required — a file in ./images/
//     title: "Display Title",          // optional — else derived from filename
//     tags:  ["tag-a", "tag-b", ...],  // drives neighbour similarity
//     note:  "Annotation text...",     // optional — shown in the floating block
//     video: "clips/thing.webm",       // optional (future) — loops in place of the image
//   }
//
// Tags are free-form; reuse a shared vocabulary so nodes cluster. The set below
// draws on the project categories (masterplan, cultural, pavilion, residential,
// educational, transformation, public-space, transport, office) plus material /
// form / theme descriptors (timber, adaptive-reuse, landscape, sustainability…).

window.RESEARCH_CONFIG = {
  // How many nearest neighbours fan out around the focused node.
  neighbors: 4,

  // Optional per-tag weights (default 1). Raise a tag to make it pull harder on
  // similarity, e.g. { sustainability: 1.5, timber: 1.25 }.
  tagWeights: {},
};

window.RESEARCH_NODES = [
  {
    file: "lahofer-winery.webp",
    title: "Lahofer Winery",
    tags: ["cultural", "wine", "landscape", "curved-roof", "agriculture"],
    note: "A roofscape you can walk on — the winery folds its amphitheatre into " +
          "the vineyard, blurring building and terrain. A recurring studio move: " +
          "architecture as continuous ground.",
  },
  {
    file: "house-of-wine-tasting.webp",
    title: "House of Wine Tasting",
    tags: ["cultural", "wine", "hospitality", "landscape", "timber"],
  },
  {
    file: "vltava-philharmonic-hall.webp",
    title: "Vltava Philharmonic Hall",
    tags: ["cultural", "performance", "landmark", "riverfront", "civic"],
    note: "A public terrace spiralling up to the river — the concert hall as a " +
          "piece of the city's topography rather than a sealed monument.",
  },
  {
    file: "moravska-trebova-cultural-centre.webp",
    title: "Moravská Třebová Cultural Centre",
    tags: ["cultural", "community", "civic", "transformation"],
  },
  {
    file: "pearl-gallery-and-community-centre.webp",
    title: "Pearl Gallery and Community Centre",
    tags: ["cultural", "gallery", "community", "civic"],
  },
  {
    file: "private-art-gallery.webp",
    title: "Private Art Gallery",
    tags: ["cultural", "gallery", "art", "private", "residential"],
  },
  {
    file: "gallery-of-furniture.webp",
    title: "Gallery of Furniture",
    tags: ["cultural", "gallery", "retail", "transformation", "adaptive-reuse"],
  },
  {
    file: "KVIFF-TV-pavilion.webp",
    title: "KVIFF TV Pavilion",
    tags: ["pavilion", "temporary", "media", "timber", "event"],
  },
  {
    file: "czech-pavilion-expo-2015.webp",
    title: "Czech Pavilion Expo 2015",
    tags: ["pavilion", "expo", "temporary", "national", "landscape"],
  },
  {
    file: "slovak-pavilion-at-PQ-2019.webp",
    title: "Slovak Pavilion at PQ 2019",
    tags: ["pavilion", "exhibition", "temporary", "national", "installation"],
  },
  {
    file: "OUT-HABIT-dialogues.webp",
    title: "Out of Habit Dialogues",
    tags: ["installation", "exhibition", "conceptual", "furniture"],
  },
  {
    file: "forestry-HQ.webp",
    title: "Forestry HQ",
    tags: ["office", "timber", "sustainability", "workplace", "nature"],
    note: "A timber headquarters for a forestry company — the material is the " +
          "message. Structure, cladding and brief all trace back to the forest.",
  },
  {
    file: "modular-office-and-research-centre.webp",
    title: "Modular Office and Research Centre",
    tags: ["office", "modular", "research", "workplace", "sustainability"],
  },
  {
    file: "mendel's-greenhouse.webp",
    title: "Mendel's Greenhouse",
    tags: ["educational", "greenhouse", "science", "glass", "nature"],
    note: "A reconstruction of Gregor Mendel's lost greenhouse — where modern " +
          "genetics began — as a glass volume that is equal parts monument and " +
          "working laboratory.",
  },
  {
    file: "learning-landscape-primary-school.webp",
    title: "Learning Landscape Primary School",
    tags: ["educational", "school", "landscape", "community"],
  },
  {
    file: "vernacular-school-in-mulbekh.webp",
    title: "Vernacular School in Mulbekh",
    tags: ["educational", "school", "vernacular", "sustainability", "community"],
  },
  {
    file: "municipal-affordable-housing.webp",
    title: "Municipal Affordable Housing",
    tags: ["residential", "housing", "affordable", "civic", "community"],
  },
  {
    file: "urban-infill-apartment.webp",
    title: "Urban Infill Apartment",
    tags: ["residential", "housing", "urban", "infill"],
  },
  {
    file: "vila-park-residences.webp",
    title: "Vila Park Residences",
    tags: ["residential", "housing", "landscape", "mixed-use"],
  },
  {
    file: "broadway-adaptive-tower.webp",
    title: "Broadway Adaptive Tower",
    tags: ["tower", "adaptive-reuse", "residential", "highrise", "transformation"],
  },
  {
    file: "multifunctional-tower-tirana.webp",
    title: "Multifunctional Tower Tirana",
    tags: ["tower", "mixed-use", "tirana", "highrise", "residential"],
  },
  {
    file: "ODA-tirana-meeting-hub.webp",
    title: "ODA Tirana Meeting Hub",
    tags: ["mixed-use", "tirana", "civic", "community", "highrise"],
  },
  {
    file: "london-bowl.webp",
    title: "London Bowl",
    tags: ["cultural", "performance", "landmark", "adaptive-reuse", "highrise"],
  },
  {
    file: "jihlava-multipurpose-urban-arena.webp",
    title: "Jihlava Multipurpose Urban Arena",
    tags: ["sports", "arena", "public-space", "civic", "large-scale"],
  },
  {
    file: "nusle-brewery-quarter.webp",
    title: "Nusle Brewery Quarter",
    tags: ["masterplan", "transformation", "adaptive-reuse", "mixed-use", "industrial"],
    note: "A disused brewery becomes a city quarter — keeping the industrial " +
          "bones and threading new public life through them. Reuse at the scale " +
          "of a neighbourhood.",
  },
  {
    file: "waltrovka-masterplan.webp",
    title: "Waltrovka Masterplan",
    tags: ["masterplan", "urban", "mixed-use", "transformation"],
  },
  {
    file: "mendel-square.webp",
    title: "Mendel Square",
    tags: ["public-space", "urban", "landscape", "civic"],
  },
  {
    file: "manifesto-market.webp",
    title: "Manifesto Market",
    tags: ["public-space", "market", "temporary", "community", "food"],
  },
  {
    file: "prague-main-train-station.webp",
    title: "Prague Main Train Station",
    tags: ["transport", "transformation", "public-space", "infrastructure", "landmark"],
  },
  {
    file: "zvonarka-bus-station.webp",
    title: "Zvonařka Bus Station",
    tags: ["transport", "transformation", "adaptive-reuse", "infrastructure", "brutalist"],
    note: "A brutalist bus terminal stripped back and re-lit — the studio treats " +
          "the concrete not as a problem to hide but as the material worth " +
          "revealing.",
  },
];
