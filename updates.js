// Studio updates shown in the homepage "Updates" block (rendered by home.js when
// home-order.js contains an { block: "updates-featured" } / "updates-featured-2"
// entry). Each item is { text, date }, with an optional trailing { link, href }
// for an underlined link, and an `img` (a file in images/updates/) used by the
// featured-2 hover interaction to swap the featured image.
window.UPDATES = [
  { text: "Rákosmező Masterplan Proposal Receives 2nd Prize", date: "18.05", img: "rakosmezo.webp" },
  { text: "Jihlava Arena Seating Wins 1st Prize at Red Dot Awards", date: "14.05", img: "reddotdesign.png" },
  { text: "Construction Begins on Mulbekh Vernacular School", date: "12.03", img: "mulbekh.webp" },
  { text: "Creative Reuse of Cities, Lecture at", link: "London School of Economics", href: "#", date: "19.02", img: "J4098_N131_website.avif" },
  { text: "Rákosmező Masterplan Proposal Gets 2nd Prize", date: "18.05", img: "rakosmezo.webp" },
];

// The single highlighted update for the featured variations of the block. `img`
// (in images/updates/) is the default image shown by featured-2 and the hover
// target of its lead row.
window.UPDATES_FEATURED = {
  file: "london-colosseum.webp",
  img: "london colosseum.webp",
  title: "London Colosseum Unveiled",
  date: "17.06",
};
