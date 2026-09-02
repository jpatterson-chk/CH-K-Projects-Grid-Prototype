// Per-card title overrides for the archive grid on home-archive-kijonka-ratios.html
// ONLY. archive.js prefers window.ARCHIVE_TITLES[file] over the title derived
// from the filename (window.titleFromArchiveFilename), so overriding here doesn't
// touch projects.html or the other archive pages. Keys must match the filenames
// in ./images/ (same keys as window.PROJECT_CODES in archive-data.js). Load
// before archive.js.
//
// Each title leads with the project name on its own line, then the sentence
// below: the "\n" is rendered as a line break by `white-space: pre-line` on
// .archive-card__title (home-archive-kijonka-ratios.css).
window.ARCHIVE_TITLES = {
  "jihlava-municipal-arena.webp":
    "Jihlava Municipal Arena\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "house-of-wine-tasting.webp":
    "House of Wine Tasting\nLorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "forestry-HQ.webp":
    "Forestry HQ\nLorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "zvonarka-bus-station.webp":
    "Zvonarka Bus Station\nA self-initiated transformation of Brutalist infrastructure into an open piece of the city.",
  "nusle-brewery-quarter.webp":
    "Nusle Brewery Quarter\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "vernacular-school-in-mulbekh.webp":
    "Vernacular School in Mulbekh\nLorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "KVIFF-TV-pavilion.webp":
    "KVIFF TV Pavilion\nLorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "ODA-tirana-meeting-hub.webp":
    "ODA Tirana Meeting Hub\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "czech-pavilion-expo-2015.webp":
    "Czech Pavilion Expo 2015\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "learning-landscape-primary-school.webp":
    "Learning Landscape Primary School\nLorem ipsum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  "Rákosrendező-Budapest-Masterplan.webp":
    "Rákosrendező Budapest Masterplan\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "moravska-trebova-cultural-centre.webp":
    "Moravska Trebova Cultural Centre\nLorem ipsum consectetur adipiscing elit, sed do eiusmod tempor.",
  "multifunctional-tower-tirana.webp":
    "Multifunctional Tower Tirana\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "municipal-affordable-housing.webp":
    "Municipal Affordable Housing\nLorem ipsum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  "private-art-gallery.webp":
    "Private Art Gallery\nLorem ipsum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  "urban-infill-apartment.webp":
    "Urban Infill Apartment\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
};
