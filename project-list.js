// Renders the tabular project list (.project-list): builds every row from
// window.PROJECTS (projects.js) up front, then reveals them 10 at a time via
// the "View More +" button. The last visible row fades as a teaser while more
// remain. Shared by projects.html and home-archive.html — load it after
// projects.js. No-op if the list containers are absent.
(function () {
  var rowsEl = document.getElementById("projectRows");
  var moreBtn = document.getElementById("projectMore");
  if (!rowsEl || !moreBtn) return;

  var projects = window.PROJECTS || [];
  var STEP = 10, TOTAL = projects.length, shown = 0;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Idempotent: if the script re-runs (e.g. live-preview hot reload), start
  // from an empty container so we never end up with duplicate rows and a
  // stranded faded row from a previous pass.
  rowsEl.innerHTML = "";

  // textContent (not innerHTML) so any commas/markup-like characters in the
  // data render as literal text rather than breaking the row.
  function cell(text) {
    var span = document.createElement("span");
    span.className = "project-row__cell";
    span.textContent = text;
    return span;
  }

  var frag = document.createDocumentFragment();
  projects.forEach(function (p) {
    var row = document.createElement("div");
    row.className = "project-row";
    row.hidden = true;

    var name = cell("");
    var num = document.createElement("span");
    num.className = "project-row__num";
    num.textContent = p.num;
    var label = document.createElement("span");
    label.className = "project-row__name";
    label.textContent = p.name;
    name.appendChild(num);
    name.appendChild(label);

    row.appendChild(name);
    row.appendChild(cell(p.city));
    row.appendChild(cell(p.category));
    row.appendChild(cell(p.status));
    row.appendChild(cell(p.year));
    frag.appendChild(row);
  });
  rowsEl.appendChild(frag);
  var allRows = rowsEl.querySelectorAll(".project-row");

  function render() {
    allRows.forEach(function (r, idx) {
      r.hidden = idx >= shown;
      r.classList.remove("is-fade");
    });
    var moreRemain = shown < TOTAL;
    moreBtn.hidden = !moreRemain;
    if (moreRemain && shown > 0) allRows[shown - 1].classList.add("is-fade");
  }

  moreBtn.addEventListener("click", function () {
    shown = Math.min(shown + STEP, TOTAL);

    if (reduce.matches) {           // no animation: reveal instantly
      render();
      return;
    }

    // FLIP the container height so the section visibly unrolls. Clear any
    // in-flight lock first so the before/after heights are the natural ones.
    rowsEl.style.height = "";
    var startH = rowsEl.offsetHeight;   // height with the current rows
    render();                            // reveal the next batch
    var endH = rowsEl.offsetHeight;     // height with the new rows
    rowsEl.style.height = startH + "px";
    void rowsEl.offsetWidth;            // commit the start before changing it
    rowsEl.style.height = endH + "px";  // transition up to the taller height
  });

  // Release the lock back to auto once the unroll settles, so the container
  // stays responsive to reflow (e.g. viewport resize).
  rowsEl.addEventListener("transitionend", function (e) {
    if (e.propertyName === "height") rowsEl.style.height = "";
  });

  shown = Math.min(STEP, TOTAL);
  render();
})();
