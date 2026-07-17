// Display order for the projects archive grid on home-archive.html ONLY.
// archive.js prefers window.ARCHIVE_ORDER over the alphabetical window.PROJECT_IMAGES
// from the auto-generated manifest.js, so reordering here doesn't touch
// projects.html and isn't clobbered by generate-manifest.sh. Filenames must match
// the files in ./images/ (the trailing comment is just the code + name for easy
// reordering). Reorder the lines to reorder the grid.
window.ARCHIVE_ORDER = [
  // --- Curated lead (first 8) ---
  "jihlava-multipurpose-urban-arena.webp",   // 366 Jihlava Arena
  "lahofer-winery.webp",                     // 188 Lahofer Winery
  "house-of-wine-tasting.webp",              // 225 House of Wine Tasting
  "gallery-of-furniture.webp",               // 170 Gallery of Furniture
  "london-bowl.webp",                        // 571 London Bowl
  "forestry-HQ.webp",                        // 249 Forestry HQ
  "mendel's-greenhouse.webp",                // 358 Mendel Greenhouse
  "mendel-square.webp",                      // 416 Mendel Square

  // --- Remainder, interleaved for a horizontal/vertical mix. The archive is
  //     portrait-heavy, so the 6 landscapes + 1 square are spread out (~every 3rd
  //     tile) so most justified rows get a wide image among the tall ones.
  //     Orientation shown in the trailing comment: L landscape, P portrait, S square.
  "KVIFF-TV-pavilion.webp",                  // 464 KVIFF Park Pavilion — P
  "OUT-HABIT-dialogues.webp",                // 403 OUT HABIT Dialogues — P
  "ODA-tirana-meeting-hub.webp",             // 512 ODA Tirana Meeting Hub — L
  "broadway-adaptive-tower.webp",            // 507 Broadway — P
  "czech-pavilion-expo-2015.webp",           // 131 Czech Pavilion at Expo 2015 — P
  "nusle-brewery-quarter.webp",              // 272 Nusle Brewery — L
  "learning-landscape-primary-school.webp",  // 518 Primary School as a Learning Landscape — P
  "manifesto-market.webp",                   // 367 Manifesto Market — P
  "pearl-gallery-and-community-centre.webp", // 479 Pearl Gallery and Community Centre — L
  "modular-office-and-research-centre.webp", // 360 Modular Office and Research Centre — P
  "moravska-trebova-cultural-centre.webp",   // 477 Moravska Trebova Cultural Centre — P
  "prague-main-train-station.webp",          // 487 Prague Brutalist Main Train Station — L
  "multifunctional-tower-tirana.webp",       // 534 Multifunctional Tower Tirana — P
  "municipal-affordable-housing.webp",       // 303 Municipal Affordable Housing — P
  "vila-park-residences.webp",               // 186 Vila Park Residences — L
  "private-art-gallery.webp",                // 383 Private Art Gallery — P
  "slovak-pavilion-at-PQ-2019.webp",         // 314 Slovak Pavilion at PQ 2019 — P
  "vernacular-school-in-mulbekh.webp",       // 338 Vernacular School in Mulbekh — S
  "urban-infill-apartment.webp",             // 174 Urban Infill Apartment House — P
  "vltava-philharmonic-hall.webp",           // 453 Vltava Philharmonic Hall — P
  "waltrovka-masterplan.webp",               // 103 Waltrovka — L
  "zvonarka-bus-station.webp",               // 275 Zvonarka Bus Station — P
];
