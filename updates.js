// Studio updates shown in the homepage "Updates" block (rendered by home.js when
// home-order.js contains a { block: "updates" } entry). Each item is
// { text, date }, with an optional trailing { link, href } for an underlined link.
window.UPDATES = [
  { text: "Rákosmező Masterplan Proposal Receives 2nd Prize", date: "18.05" },
  { text: "Jihlava Arena Seating Wins 1st Prize at Red Dot Awards", date: "14.05" },
  { text: "Construction Begins on Mulbekh Vernacular School", date: "12.03" },
  { text: "Creative Reuse of Cities, Lecture at", link: "London School of Economics", href: "#", date: "19.02" },
  { text: "Rákosmező Masterplan Proposal Gets 2nd Prize", date: "18.05" },
];

// The single highlighted update for the "featured" variation of the block
// (rendered when home-order.js has a { block: "updates-featured" } entry).
window.UPDATES_FEATURED = {
  file: "london-colosseum.webp",
  title: "London Colosseum Unveiled",
  date: "17.06",
};
