// Shared interactions used on every page, loaded at the end of <body>:
// the nav MENU toggle and the jump-menu current-section label.

/* Nav toggle: swap the tagline for the studio facts (and MENU for x).
   Opening is a plain class toggle; closing is sequenced so the facts
   leave the flow before the tagline returns (see the .is-closing CSS). */
(function () {
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  if (!nav || !toggle) return;

  var facts = nav.querySelector(".nav__facts");
  var tagline = nav.querySelector(".nav__tagline");
  var bar = nav.querySelector(".nav__bar");
  var sizer = nav.querySelector(".nav__sizer");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var closeTimer;

  function setAria(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      open ? "Hide studio facts" : "Toggle studio facts"
    );
  }

  // Hide the faded-out facts and restore the tagline in ONE reflow (so they
  // never share the line), then fade the tagline in: start it at opacity 0
  // with no transition, commit that with a forced reflow, then release it.
  function finishClose() {
    clearTimeout(closeTimer);
    nav.classList.add("tagline-enter");     // opacity 0, transition off
    nav.classList.remove("is-closing");     // tagline now displays, still at 0
    bar.style.height = "";                  // release to auto (now == closed height)
    void tagline.offsetWidth;               // commit the 0 before transitioning
    nav.classList.remove("tagline-enter");  // fade 0 -> 1
  }

  function open() {
    clearTimeout(closeTimer);
    nav.classList.remove("is-closing");
    nav.classList.add("is-open");
    // Drop any height lock a mid-close left behind so the bar grows back to
    // its full auto height. (Open itself isn't height-animated — the facts
    // just fade in over the expanded panel.)
    bar.style.height = "";
    setAria(true);
  }

  function close() {
    setAria(false);
    if (reduce.matches) {             // no animation: collapse instantly
      nav.classList.remove("is-open");
      return;
    }
    // Roll the panel up: lock the current expanded height, then transition
    // it down to the closed one-line height while the facts fade out.
    bar.style.height = bar.offsetHeight + "px";   // lock the start height
    nav.classList.remove("is-open");
    nav.classList.add("is-closing");              // fade facts out, then finishClose()
    void bar.offsetWidth;                          // commit the start before changing it
    bar.style.height = sizer.offsetHeight + "px"; // animate down to closed height
    clearTimeout(closeTimer);
    closeTimer = setTimeout(finishClose, 400);    // fallback if transitionend is missed
  }

  toggle.addEventListener("click", function () {
    if (nav.classList.contains("is-open")) close();
    else open();
  });

  // The facts' opacity fade IS the close animation; end it when that fade
  // finishes. Guarded so a re-open mid-close (is-closing already gone) is a
  // no-op.
  facts.addEventListener("transitionend", function (e) {
    if (e.propertyName === "opacity" && nav.classList.contains("is-closing")) {
      finishClose();
    }
  });
})();

/* Jump menu label: reflect whichever section currently sits across the
   viewport's vertical middle, so the button reads like a <select>'s
   current value. The menu links are the single source of truth for the
   targets and their names. Cross-page links (href not starting with #)
   are skipped, so the same script is safe on pages without those ids. */
(function () {
  var label = document.querySelector(".jump__label");
  var links = document.querySelectorAll(".jump__list a");
  if (!label || !links.length) return;

  // A zero-height root at the viewport's vertical center: a section "is
  // current" while it straddles that line. The last section to cross it wins.
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) label.textContent = entry.target.dataset.jumpLabel;
    });
  }, { rootMargin: "-50% 0px -50% 0px" });

  links.forEach(function (a) {
    var href = a.getAttribute("href") || "";
    if (href.charAt(0) !== "#") return;   // cross-page link: nothing to observe here
    var section = document.getElementById(href.slice(1));
    if (!section) return;
    section.dataset.jumpLabel = a.textContent.trim();
    io.observe(section);
  });
})();

/* Homepage hero: the nav wordmark/tagline start hidden and fade in once the hero
   (the first section) has scrolled fully past the top of the viewport — i.e. its
   bottom edge crosses the top of the screen — rather than at a fixed pixel
   offset. The MENU toggle stays visible throughout. Opt-in via the
   .nav--reveal-on-scroll class, so it's a no-op on pages without it. */
(function () {
  var nav = document.getElementById("nav");
  if (!nav || !nav.classList.contains("nav--reveal-on-scroll")) return;

  var hero = document.querySelector(".hero");
  if (!hero) { nav.classList.add("is-scrolled"); return; }   // no hero: just show the nav

  // is-scrolled while the hero is NOT intersecting the viewport (scrolled above
  // its top edge). IntersectionObserver re-checks on scroll/resize on its own.
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      nav.classList.toggle("is-scrolled", !entry.isIntersecting);
    });
  }, { threshold: 0 });
  io.observe(hero);
})();

/* Expose the nav's reserved height as --nav-h so the homepage hero can fill the
   viewport below it. Runs on every page (harmless where --nav-h is unused). */
(function () {
  var nav = document.getElementById("nav");
  if (!nav) return;
  function setNavHeight() {
    document.documentElement.style.setProperty("--nav-h", nav.offsetHeight + "px");
  }
  setNavHeight();
  window.addEventListener("resize", setNavHeight, { passive: true });
})();
