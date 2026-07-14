// Curated homepage grid for the MOSAIC 2 variant only (home-mosaic-2.html) — a
// fork of home-order.js. Differs from the shared order in two ways: the second
// featured-updates block (updates-featured-2) is dropped, and the trailing
// "Municipal Affordable Housing" card is removed so the grid doesn't end on a
// lone half-empty row. Images load from images-mosaic-2/ (see HOME_IMAGE_BASE in
// home-mosaic-2.html). Kept separate so the other homepage variants are unchanged.
window.HOME_ORDER = [
  { num: 366, file: "jihlava-multipurpose-urban-arena.webp",   title: "Jihlava Multipurpose Urban Arena" },
  { num: 571, file: "london-colosseum.webp",                   title: "London Colosseum" },
  { num: 188, file: "lahofer-winery.webp",                     title: "Lahofer Winery" },
  { num: 416, file: "mendel-square.webp",                      title: "Mendel Square Reclaimed" },
  { num: 103, file: "waltrovka-masterplan.webp",               title: "Waltrovka 630-home Masterplan" },
  { num: 358, file: "mendel's-greenhouse.webp",                title: "Mendel's Greenhouse" },
  // Full-width featured studio update + list (content in updates.js). It spans
  // every column, so to avoid empty cells keep it on a row boundary — a multiple
  // of 6 cards lands cleanly at all breakpoints (1 / 2 / 3 columns).
  { block: "updates-featured" },
  { num: 272, file: "nusle-brewery-quarter.webp",              title: "Nusle Brewery Quarter" },
  { num: 275, file: "zvonarka-bus-station.webp",               title: "Zvonarka Bus Station" },
  { num: 360, file: "modular-office-and-research-centre.webp", title: "Modular Office and Research Centre" },
  { num: 225, file: "house-of-wine-tasting.webp",              title: "House of Wine Tasting" },
  { num: 464, file: "KVIFF-TV-pavilion.webp",                  title: "KVIFF Park Pavilion" },
  { num: 367, file: "manifesto-market.webp",                   title: "Manifesto Market for Urban Activation" },
  // Full-width pull quote. Like the updates block it spans every column, so it's
  // placed on a row boundary (a multiple of 6 cards precede it) to avoid empty
  // cells at the 1 / 2 / 3-column breakpoints.
  { block: "quote", text: "Transformative neighbourhoods, successful destinations, inspiring places and spaces, future heritage, and humble icons" },
  { num: 186, file: "vila-park-residences.webp",               title: "Vila Park" },
  { num: 170, file: "gallery-of-furniture.webp",               title: "Gallery of Furniture" },
  { num: 507, file: "broadway-adaptive-tower.webp",            title: "Broadway Adaptive Tower" },
  { num: 249, file: "forestry-HQ.webp",                        title: "Forestry HQ" },
  { num: 518, file: "learning-landscape-primary-school.webp",  title: "Primary School as Learning Landscape" },
  { num: 534, file: "multifunctional-tower-tirana.webp",       title: "Multifunctional Tower Tirana" },
  { num: 338, file: "vernacular-school-in-mulbekh.webp",       title: "Vernacular School in Mulbekh" },
];
