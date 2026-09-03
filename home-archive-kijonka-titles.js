// Per-card title overrides for the archive grid on home-archive-kijonka.html
// ONLY. archive.js prefers window.ARCHIVE_TITLES[file] over the title derived
// from the filename (window.titleFromArchiveFilename), so overriding here doesn't
// touch projects.html or the other archive pages. Keys must match the filenames
// in ./images/ (same keys as window.PROJECT_CODES in archive-data.js). Load
// before archive.js.
//
// Each title leads with the project name on its own line, then the sentence
// below: the "\n" is rendered as a line break by `white-space: pre-line` on
// .archive-card__title (home-archive-kijonka.css). Entries are in the grid's
// display order (home-archive-kijonka-order.js).
window.ARCHIVE_TITLES = {
  "jihlava-municipal-arena.webp":
    "Jihlava Municipal Arena\nA porous urban campus opening multipurpose infrastructure to everyday public life and play.",
  "lahofer-winery.webp":
    "Lahofer Winery\nA productive landscape extended into a public destination for culture, community and collective experience.",
  "house-of-wine-tasting.webp":
    "House of Wine Tasting\nA contemporary wine space carved into the accumulated architectural layers of the city.",
  "london-bowl.webp":
    "London Bowl\nA hybrid venue reframed as part of the neighbourhood beyond the spectacle.",
  "gallery-of-furniture.webp":
    "Gallery of Furniture\nAn ordinary commercial shell transformed through the architectural reuse of an everyday product.",
  "forestry-HQ.webp":
    "Forestry HQ\nThe Czech Republic’s largest timber building, expanding into the forest, turning the workplace into a learning landscape.",
  "mendel's-greenhouse.webp":
    "Mendel's Greenhouse\nScientific heritage reimagined as an open structure for learning, exchange and community life.",
  "zvonarka-bus-station.webp":
    "Zvonarka Bus Station\nA self-initiated transformation of Brutalist infrastructure into an open piece of the city.",
  "nusle-brewery-quarter.webp":
    "Nusle Brewery Quarter\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "vernacular-school-in-mulbekh.webp":
    "Vernacular School in Mulbekh\nLorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "waltrovka-masterplan.webp":
    "Waltrovka Masterplan\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua, quis nostrud exercitation.",
  "mendel-square.webp":
    "Mendel Square\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
  "KVIFF-TV-pavilion.webp":
    "KVIFF TV Pavilion\nLorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "sugar-factory-neighbourhood.webp":
    "Sugar Factory Neighbourhood\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
  "OUT-HABIT-dialogues.webp":
    "OUT HABIT Dialogues\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
  "ODA-tirana-meeting-hub.webp":
    "ODA Tirana Meeting Hub\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "broadway-adaptive-tower.webp":
    "Broadway Adaptive Tower\nConsectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim.",
  "czech-pavilion-expo-2015.webp":
    "Czech Pavilion Expo 2015\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "learning-landscape-primary-school.webp":
    "Learning Landscape Primary School\nLorem ipsum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  "manifesto-market.webp":
    "Manifesto Market\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt labore.",
  "pearl-gallery-and-community-centre.webp":
    "Pearl Gallery and Community Centre\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
  "modular-office-and-research-centre.webp":
    "Modular Office and Research Centre\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.",
  "Rákosrendező-Budapest-Masterplan.webp":
    "Rákosrendező Budapest Masterplan\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "moravska-trebova-cultural-centre.webp":
    "Moravska Trebova Cultural Centre\nLorem ipsum consectetur adipiscing elit, sed do eiusmod tempor.",
  "prague-main-train-station.webp":
    "Prague Main Train Station\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
  "multifunctional-tower-tirana.webp":
    "Multifunctional Tower Tirana\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "municipal-affordable-housing.webp":
    "Municipal Affordable Housing\nLorem ipsum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  "vila-park-residences.webp":
    "Vila Park Residences\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt magna.",
  "private-art-gallery.webp":
    "Private Art Gallery\nLorem ipsum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  "slovak-pavilion-at-PQ-2019.webp":
    "Slovak Pavilion at PQ 2019\nConsectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "urban-infill-apartment.webp":
    "Urban Infill Apartment\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "vltava-philharmonic-hall.webp":
    "Vltava Philharmonic Hall\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
};
