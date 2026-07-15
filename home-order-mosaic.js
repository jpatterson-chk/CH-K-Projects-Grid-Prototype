// Curated homepage grid for the MOSAIC variant only (home-mosaic.html) — a fork
// of home-order.js so its layout-driven tweaks don't affect home.html /
// home-centered.html.
//
// Structure: three 6-card sections separated by two full-width blocks (the
// featured quote and the updates block). Because the full-width blocks reset the
// row and each section is a clean 6 cards, every section packs as a clean
// staggered 2-large-+-4-small unit — no lone-large / 2x2 small-tile cluster.
//
// The pull quote is a FEATURED block: it carries a manually-set image (Nusle
// Brewery Quarter, which relates to the statement) beside the text. That image is
// set here, outside the card cadence — so Nusle is featured in the quote rather
// than repeated as a grid card. Mulbekh is moved up into the second section to
// keep it a full 6 cards. The second updates block and the Municipal card are
// dropped (vs the shared order).
window.HOME_ORDER = [
  { num: 366, file: "jihlava-multipurpose-urban-arena.webp",   title: "Jihlava Multipurpose Urban Arena" },
  { num: 571, file: "london-bowl.webp",                        title: "London Bowl" },
  { num: 188, file: "lahofer-winery.webp",                     title: "Lahofer Winery" },
  { num: 416, file: "mendel-square.webp",                      title: "Mendel Square Reclaimed" },
  { num: 103, file: "waltrovka-masterplan.webp",               title: "Waltrovka 630-home Masterplan" },
  { num: 358, file: "mendel's-greenhouse.webp",                title: "Mendel's Greenhouse" },
  // Full-width featured pull quote: related image (Nusle) beside the statement.
  {
    block: "quote",
    text: "Transformative neighbourhoods, successful destinations, inspiring places and spaces, future heritage, and humble icons",
    image: "nusle-brewery-quarter.webp",
    imageNum: 272,
    imageTitle: "Nusle Brewery Quarter",
  },
  { num: 275, file: "zvonarka-bus-station.webp",               title: "Zvonarka Bus Station" },
  { num: 360, file: "modular-office-and-research-centre.webp", title: "Modular Office and Research Centre" },
  { num: 225, file: "house-of-wine-tasting.webp",              title: "House of Wine Tasting" },
  { num: 464, file: "KVIFF-TV-pavilion.webp",                  title: "KVIFF Park Pavilion" },
  { num: 367, file: "manifesto-market.webp",                   title: "Manifesto Market for Urban Activation" },
  { num: 338, file: "vernacular-school-in-mulbekh.webp",       title: "Vernacular School in Mulbekh" },
  // Full-width featured studio update + list.
  { block: "updates-featured" },
  { num: 186, file: "vila-park-residences.webp",               title: "Vila Park" },
  { num: 170, file: "gallery-of-furniture.webp",               title: "Gallery of Furniture" },
  { num: 507, file: "broadway-adaptive-tower.webp",            title: "Broadway Adaptive Tower" },
  { num: 249, file: "forestry-HQ.webp",                        title: "Forestry HQ" },
  { num: 518, file: "learning-landscape-primary-school.webp",  title: "Primary School as Learning Landscape" },
  { num: 534, file: "multifunctional-tower-tirana.webp",       title: "Multifunctional Tower Tirana" },
];
