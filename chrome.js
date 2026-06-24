// Shared site chrome — nav, footer, and jump menu — as a single source of truth.
// Each page drops in custom elements (<site-nav>, <site-footer>, <site-jump>)
// that inject the markup below, so every page and every homepage variant stays
// in sync: edit it here once and the change propagates everywhere. Like
// manifest.js / home-order.js, keeping the markup in JS sidesteps file:// (no
// server-side includes or fetch needed).
//
// The elements upgrade during parse, so the chrome appears in place with minimal
// flash — load this file in <head>. site.js (end of <body>) then wires up the
// behaviours on the injected DOM.
//
// Per-page knobs (attributes):
//   <site-nav reveal>                              homepage wordmark-reveal-on-scroll
//   <site-jump base="projects.html" label="Projects"> cross-page links (homepages)
//   <site-jump label="Selected Projects">          same-page links (projects page)

(function () {
  // --- Markup (the single source of truth) ----------------------------------

  function navHTML(reveal) {
    return `
      <header class="nav${reveal ? " nav--reveal-on-scroll" : ""}" id="nav">
        <div class="nav__sizer" aria-hidden="true">CHYBIK + KRISTOF</div>
        <div class="nav__bar">
          <p class="nav__text"><span class="nav__brand"><a class="nav__link">CHYBIK</a> <span class="m">+</span> <a class="nav__link">KRISTOF</a></span><span class="nav__tagline"> = ARCHITECTS</span><span class="nav__facts"> <span class="m">+</span> <span class="m">74</span>&nbsp;<a class="nav__link">ARCHITECTS</a> <span class="m">+</span> <span class="m">153</span>&nbsp;<a class="nav__link">CLIENTS</a> <span class="m">+</span> <span class="m">20</span>&nbsp;<a class="nav__link">COUNTRIES</a> <span class="m">=</span> <a class="nav__link" href="projects.html"><span class="m">608</span>&nbsp;PROJECTS</a><span class="m">;</span> <span class="m">16</span>&nbsp;<a class="nav__link">INSIGHTS</a><span class="m">;</span> <span class="m">22</span>&nbsp;<a class="nav__link">UPDATES</a><span class="m">;</span> <span class="m">1</span>&nbsp;<a class="nav__link">PRODUCT</a><span class="m">;</span> <span class="m">1</span>&nbsp;<a class="nav__link">BOOK</a><span class="m">;</span> <span class="m">3</span>&nbsp;<a class="nav__link">JOBS</a><span class="m">;</span> <span class="m">4</span>&nbsp;<a class="nav__link">OFFICES</a><span class="m">.</span></span></p>

          <button class="nav__toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="nav" aria-label="Toggle studio facts">
            <span class="nav__toggle-label">MENU</span>
            <span class="nav__toggle-close" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.25">
                <line x1="2" y1="2" x2="14" y2="14"></line>
                <line x1="14" y1="2" x2="2" y2="14"></line>
              </svg>
            </span>
          </button>
        </div>
      </header>`;
  }

  var FOOTER_HTML = `
    <footer class="footer">
      <div class="footer__grid footer__main">
        <div class="footer__brand">
          <h2 class="footer__heading">CHYBIK + KRISTOF</h2>
          <ul class="footer__links">
            <li><a>Instagram</a></li>
            <li><a>Facebook</a></li>
            <li><a>Youtube</a></li>
            <li><a>LinkedIn</a></li>
          </ul>
        </div>

        <nav class="footer__col footer__col--studio" aria-label="Studio">
          <h3 class="footer__heading">Studio</h3>
          <ul class="footer__links">
            <li><a>Team</a></li>
            <li><a>Awards</a></li>
            <li><a>Exhibitions</a></li>
            <li><a>Lectures</a></li>
            <li><a>Careers</a></li>
            <li><a>Contact</a></li>
          </ul>
        </nav>

        <nav class="footer__col footer__col--projects" aria-label="Projects">
          <h3 class="footer__heading">Projects</h3>
          <ul class="footer__links">
            <li><a href="projects.html">All Projects</a></li>
            <li><a>Master-planning</a></li>
            <li><a>Sports &amp; Culture</a></li>
            <li><a>Educational</a></li>
            <li><a>Public Space</a></li>
          </ul>
        </nav>

        <nav class="footer__col footer__col--contact" aria-label="Contact">
          <h3 class="footer__heading">Contact</h3>
          <ul class="footer__links">
            <li><a href="mailto:office@chybik-kristof.com">office@chybik-kristof.com</a></li>
            <li><a href="tel:+420775727488">+420 775 727 488</a></li>
            <li><a>Office Locations</a></li>
          </ul>
        </nav>
      </div>

      <div class="footer__grid footer__bottom">
        <p class="footer__copy">© CHYBIK + KRISTOF 2026</p>
        <a class="footer__privacy">Privacy Policy</a>
        <a class="footer__top" href="#top">Back to top<svg class="footer__top-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="1"/><polygon points="5.64 13.89 6.36 14.59 11.5 9.24 11.5 21 12.5 21 12.5 9.24 17.64 14.59 18.36 13.89 12 7.28 5.64 13.89"/></svg></a>
      </div>
    </footer>`;

  function jumpHTML(base, label) {
    return `
      <details class="jump">
        <summary class="jump__button"><span class="jump__label">${label}</span></summary>
        <ul class="jump__list">
          <li><a href="${base}#archive">Selected Projects</a></li>
          <li><a href="${base}#projects">All Projects</a></li>
        </ul>
      </details>`;
  }

  // --- Custom elements -------------------------------------------------------
  // display: contents (set in style.css) means these wrappers generate no box,
  // so the sticky nav / footer / fixed jump behave as direct children of <body>.

  function define(name, render) {
    customElements.define(name, class extends HTMLElement {
      connectedCallback() {
        if (this._mounted) return;   // guard against re-connection
        this._mounted = true;
        this.innerHTML = render(this);
      }
    });
  }

  define("site-nav", function (el) {
    return navHTML(el.hasAttribute("reveal"));
  });
  define("site-footer", function () {
    return FOOTER_HTML;
  });
  define("site-jump", function (el) {
    return jumpHTML(el.getAttribute("base") || "", el.getAttribute("label") || "Projects");
  });
})();
